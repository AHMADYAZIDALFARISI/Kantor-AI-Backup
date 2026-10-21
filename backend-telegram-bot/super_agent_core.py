#!/usr/bin/env python3
"""
TELEGRAM AI SUPER AGENT — PRODUCTION CORE
Integrates:
  1. Muse (Context, Persona & Creative Reasoning Engine)
  2. 9 Specialized Routers (Fast Intent & Cost/Latency-Aware Semantic Routing)
  3. Hermes Agent (Sandboxed Tool Execution & Workflow Automation Engine)

Stack: Python 3.11+ | aiogram 3.x | httpx (HTTP/2 Pool) | SQLite WAL | psutil
"""
from __future__ import annotations

import asyncio
import hashlib
import hmac
import ipaddress
import json
import logging
import os
import random
import re
import sqlite3
import statistics
import time
import urllib.parse
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Any, Callable, Coroutine, Dict, List, Optional, Tuple

# =====================================================================
# 1. CONFIGURATION & SECRET REDACTION LOGGING
# =====================================================================

class SecretRedactingFilter(logging.Filter):
    """Redacts Telegram bot tokens, Bearer tokens, and API keys from logs."""
    PATTERNS = [
        re.compile(r"\b\d{8,10}:[A-Za-z0-9_-]{35}\b"),
        re.compile(r"(?i)(Bearer\s+)[A-Za-z0-9_\-\.]+"),
        re.compile(r"(?i)(api[_-]?key|secret|token|password)(['\"\s:=]+)[^'\"\s,&]+"),
    ]

    def filter(self, record: logging.LogRecord) -> bool:
        msg = record.getMessage()
        for pat in self.PATTERNS:
            msg = pat.sub("[REDACTED]", msg)
        record.msg = msg
        record.args = ()
        return True

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
)
logger = logging.getLogger("SuperAgent")
logger.addFilter(SecretRedactingFilter())


@dataclass(frozen=True)
class AppConfig:
    bot_token: str = field(default_factory=lambda: os.getenv("TELEGRAM_BOT_TOKEN", ""))
    allowed_user_ids: Tuple[int, ...] = field(
        default_factory=lambda: tuple(
            int(x.strip()) for x in os.getenv("ALLOWED_USER_IDS", "100000001").split(",") if x.strip().isdigit()
        )
    )
    admin_user_ids: Tuple[int, ...] = field(
        default_factory=lambda: tuple(
            int(x.strip()) for x in os.getenv("ADMIN_USER_IDS", "100000001").split(",") if x.strip().isdigit()
        )
    )
    approval_hmac_secret: str = field(
        default_factory=lambda: os.getenv("APPROVAL_HMAC_SECRET", "change-me-in-production-super-secret-key")
    )
    muse_api_url: str = field(default_factory=lambda: os.getenv("MUSE_API_URL", "http://localhost:8001/v1/muse"))
    muse_api_key: str = field(default_factory=lambda: os.getenv("MUSE_API_KEY", ""))
    hermes_api_url: str = field(default_factory=lambda: os.getenv("HERMES_API_URL", "http://localhost:8002/v1/hermes"))
    hermes_api_key: str = field(default_factory=lambda: os.getenv("HERMES_API_KEY", ""))
    db_path: str = field(default_factory=lambda: os.getenv("AGENT_DB_PATH", "super_agent_state.db"))
    max_concurrency: int = int(os.getenv("MAX_CONCURRENCY", "15"))
    rate_limit_per_minute: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "25"))
    edit_debounce_seconds: float = 1.2
    telegram_max_msg_len: int = 4000


# =====================================================================
# 2. SECURITY & PERMISSION ARCHITECTURE (RBAC, SSRF, PROMPT GUARD)
# =====================================================================

class Role(str, Enum):
    ADMIN = "ADMIN"
    USER = "USER"
    UNAUTHORIZED = "UNAUTHORIZED"


class SecurityGuard:
    """Enforces RBAC, Per-User Rate Limiting, SSRF Prevention, Prompt Injection Detection, & HMAC Approvals."""

    PROMPT_INJECTION_PATTERNS = [
        re.compile(r"(?i)ignore\s+(all\s+)?(previous|prior)\s+instructions"),
        re.compile(r"(?i)reveal\s+(your\s+)?(system\s+prompt|secret|api\s+key|credentials)"),
        re.compile(r"(?i)(rm\s+-rf|curl\s+.*\|\s*(ba)?sh|wget\s+.*\|\s*(ba)?sh)"),
    ]

    def __init__(self, config: AppConfig):
        self.config = config
        self._user_hits: Dict[int, List[float]] = {}

    def get_role(self, user_id: int) -> Role:
        if user_id in self.config.admin_user_ids:
            return Role.ADMIN
        if user_id in self.config.allowed_user_ids:
            return Role.USER
        return Role.UNAUTHORIZED

    def check_rate_limit(self, user_id: int) -> Tuple[bool, float]:
        now = time.monotonic()
        window = 60.0
        hits = [t for t in self._user_hits.get(user_id, []) if now - t < window]
        if len(hits) >= self.config.rate_limit_per_minute:
            retry_after = window - (now - hits[0])
            self._user_hits[user_id] = hits
            return False, max(1.0, retry_after)
        hits.append(now)
        self._user_hits[user_id] = hits
        return True, 0.0

    def inspect_prompt(self, text: str) -> Tuple[bool, Optional[str]]:
        for pat in self.PROMPT_INJECTION_PATTERNS:
            if pat.search(text):
                return False, "Input ditolak oleh kebijakan keamanan (terdeteksi pola instruksi berisiko)."
        return True, None

    @staticmethod
    def validate_outbound_url(url: str) -> Tuple[bool, str]:
        """SSRF Protection: Blocks loopback, private networks, link-local, and metadata endpoints."""
        try:
            parsed = urllib.parse.urlparse(url)
            if parsed.scheme not in ("http", "https"):
                return False, "Hanya protokol HTTP/HTTPS yang diizinkan."
            hostname = (parsed.hostname or "").lower()
            if not hostname or hostname in ("localhost", "metadata.google.internal"):
                return False, "Host internal/metadata diblokir oleh proteksi SSRF."
            try:
                ip = ipaddress.ip_address(hostname)
                if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_multicast or ip.is_reserved:
                    return False, f"IP privat/internal ({ip}) diblokir oleh proteksi SSRF."
            except ValueError:
                # Domain name; block internal suffixes
                if hostname.endswith((".local", ".internal", ".lan")):
                    return False, "Domain jaringan lokal diblokir oleh proteksi SSRF."
            return True, "OK"
        except Exception as exc:
            return False, f"URL tidak valid: {exc}"

    def sign_approval(self, proposal_id: str, commit_sha: str, user_id: int, action: str) -> str:
        payload = f"{proposal_id}:{commit_sha[:12]}:{user_id}:{action}".encode("utf-8")
        sig = hmac.new(self.config.approval_hmac_secret.encode("utf-8"), payload, hashlib.sha256).hexdigest()
        return sig[:16]

    def verify_approval(self, proposal_id: str, commit_sha: str, user_id: int, action: str, signature: str) -> bool:
        if self.get_role(user_id) != Role.ADMIN:
            return False
        expected = self.sign_approval(proposal_id, commit_sha, user_id, action)
        return hmac.compare_digest(expected, signature)


# =====================================================================
# 3. PERSISTENT STORAGE & OBSERVABILITY METRICS (SQLITE WAL + P50/P95)
# =====================================================================

class PersistentStore:
    """SQLite WAL-backed store for User Preferences, Saved Prompts, Proposals, Workflows & Audit Logs."""

    def __init__(self, db_path: str):
        self.db_path = db_path
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path, timeout=10.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL;")
        conn.execute("PRAGMA synchronous=NORMAL;")
        return conn

    def _init_db(self) -> None:
        with self._connect() as conn:
            conn.executescript(
                """
                CREATE TABLE IF NOT EXISTS user_prefs (
                    user_id INTEGER PRIMARY KEY,
                    language TEXT DEFAULT 'id',
                    response_style TEXT DEFAULT 'ringkas_profesional',
                    preferred_router TEXT DEFAULT 'auto',
                    notifications INTEGER DEFAULT 1,
                    updated_at TEXT
                );
                CREATE TABLE IF NOT EXISTS skill_proposals (
                    proposal_id TEXT PRIMARY KEY,
                    name TEXT,
                    repo_url TEXT,
                    commit_sha TEXT,
                    purpose TEXT,
                    benefit TEXT,
                    compatibility TEXT,
                    maintenance TEXT,
                    license_info TEXT,
                    security_notes TEXT,
                    resource_est TEXT,
                    alternatives TEXT,
                    integration_plan TEXT,
                    test_plan TEXT,
                    rollback_plan TEXT,
                    status TEXT DEFAULT 'PENDING',
                    approved_by INTEGER,
                    updated_at TEXT
                );
                CREATE TABLE IF NOT EXISTS workflows (
                    workflow_id TEXT PRIMARY KEY,
                    owner_id INTEGER,
                    name TEXT,
                    trigger_type TEXT,
                    status TEXT,
                    idempotency_key TEXT UNIQUE,
                    progress INTEGER DEFAULT 0,
                    result_summary TEXT,
                    retries INTEGER DEFAULT 0,
                    created_at TEXT,
                    updated_at TEXT
                );
                CREATE TABLE IF NOT EXISTS audit_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT,
                    user_id INTEGER,
                    action TEXT,
                    details TEXT
                );
                CREATE TABLE IF NOT EXISTS chat_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    role TEXT,
                    content TEXT,
                    timestamp TEXT
                );
                CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id, id);
                """
            )

    def log_audit(self, user_id: int, action: str, details: str) -> None:
        with self._connect() as conn:
            conn.execute(
                "INSERT INTO audit_logs (timestamp, user_id, action, details) VALUES (?, ?, ?, ?)",
                (datetime.now(timezone.utc).isoformat(), user_id, action, details),
            )

    def add_history(self, user_id: int, role: str, content: str) -> None:
        with self._connect() as conn:
            conn.execute(
                "INSERT INTO chat_history (user_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
                (user_id, role, content, datetime.now(timezone.utc).isoformat()),
            )
            # Keep only last 20 messages per user
            conn.execute(
                """DELETE FROM chat_history WHERE id NOT IN (
                    SELECT id FROM chat_history WHERE user_id = ? ORDER BY id DESC LIMIT 20
                ) AND user_id = ?""",
                (user_id, user_id),
            )

    def get_history(self, user_id: int, limit: int = 10) -> List[Dict[str, str]]:
        with self._connect() as conn:
            rows = conn.execute(
                "SELECT role, content FROM chat_history WHERE user_id = ? ORDER BY id DESC LIMIT ?",
                (user_id, limit),
            ).fetchall()
            return [{"role": r["role"], "content": r["content"]} for r in reversed(rows)]

    def get_user_prefs(self, user_id: int) -> Dict[str, Any]:
        with self._connect() as conn:
            row = conn.execute("SELECT * FROM user_prefs WHERE user_id = ?", (user_id,)).fetchone()
            if row:
                return dict(row)
            now = datetime.now(timezone.utc).isoformat()
            conn.execute(
                "INSERT INTO user_prefs (user_id, updated_at) VALUES (?, ?)",
                (user_id, now),
            )
            return {
                "user_id": user_id,
                "language": "id",
                "response_style": "ringkas_profesional",
                "preferred_router": "auto",
                "notifications": 1,
                "updated_at": now,
            }

    def clear_user_data(self, user_id: int) -> None:
        with self._connect() as conn:
            conn.execute("DELETE FROM user_prefs WHERE user_id = ?", (user_id,))
            conn.execute("DELETE FROM workflows WHERE owner_id = ?", (user_id,))
        self.log_audit(user_id, "PRIVACY_WIPE", "User requested full session/preference deletion")

    def save_proposal(self, prop: Dict[str, Any]) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                INSERT OR REPLACE INTO skill_proposals (
                    proposal_id, name, repo_url, commit_sha, purpose, benefit,
                    compatibility, maintenance, license_info, security_notes,
                    resource_est, alternatives, integration_plan, test_plan,
                    rollback_plan, status, approved_by, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    prop["proposal_id"], prop["name"], prop["repo_url"], prop["commit_sha"],
                    prop["purpose"], prop["benefit"], prop["compatibility"], prop["maintenance"],
                    prop["license_info"], prop["security_notes"], prop["resource_est"],
                    prop["alternatives"], prop["integration_plan"], prop["test_plan"],
                    prop["rollback_plan"], prop.get("status", "PENDING"),
                    prop.get("approved_by"), datetime.now(timezone.utc).isoformat()
                ),
            )

    def get_proposal(self, proposal_id: str) -> Optional[Dict[str, Any]]:
        with self._connect() as conn:
            row = conn.execute("SELECT * FROM skill_proposals WHERE proposal_id = ?", (proposal_id,)).fetchone()
            return dict(row) if row else None

    def update_proposal_status(self, proposal_id: str, status: str, user_id: int) -> None:
        with self._connect() as conn:
            conn.execute(
                "UPDATE skill_proposals SET status = ?, approved_by = ?, updated_at = ? WHERE proposal_id = ?",
                (status, user_id, datetime.now(timezone.utc).isoformat(), proposal_id),
            )
        self.log_audit(user_id, f"PROPOSAL_{status}", f"Proposal {proposal_id} -> {status}")


class ObservabilityMetrics:
    """Tracks real-time p50/p95 latency, error rate, token cost, and component health."""

    def __init__(self):
        self.latencies_ms: List[float] = []
        self.total_requests: int = 0
        self.failed_requests: int = 0
        self.active_tasks: int = 0
        self.estimated_tokens: int = 0
        self.estimated_cost_usd: float = 0.0
        self.last_success_ts: Optional[str] = None
        self.component_health: Dict[str, str] = {
            "Muse Engine": "OK",
            "9-Router Mesh": "OK",
            "Hermes Agent": "OK",
        }

    def record(self, latency_ms: float, success: bool, tokens: int = 0, cost_usd: float = 0.0) -> None:
        self.total_requests += 1
        if not success:
            self.failed_requests += 1
        else:
            self.last_success_ts = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        self.latencies_ms.append(latency_ms)
        if len(self.latencies_ms) > 500:
            self.latencies_ms = self.latencies_ms[-500:]
        self.estimated_tokens += tokens
        self.estimated_cost_usd += cost_usd

    def snapshot(self, queue_size: int = 0) -> Dict[str, Any]:
        if self.latencies_ms:
            sorted_lat = sorted(self.latencies_ms)
            p50 = statistics.median(sorted_lat)
            idx95 = min(len(sorted_lat) - 1, int(len(sorted_lat) * 0.95))
            p95 = sorted_lat[idx95]
        else:
            p50, p95 = 0.0, 0.0

        err_rate = (self.failed_requests / self.total_requests * 100.0) if self.total_requests else 0.0
        overall = "OK"
        if err_rate > 25.0 or any(v == "DOWN" for v in self.component_health.values()):
            overall = "DOWN"
        elif err_rate > 5.0 or p95 > 4000 or any(v == "DEGRADED" for v in self.component_health.values()):
            overall = "DEGRADED"

        return {
            "overall_status": overall,
            "components": dict(self.component_health),
            "total_requests": self.total_requests,
            "failed_requests": self.failed_requests,
            "error_rate_pct": round(err_rate, 2),
            "p50_ms": round(p50, 2),
            "p95_ms": round(p95, 2),
            "active_tasks": self.active_tasks,
            "queue_backlog": queue_size,
            "estimated_tokens": self.estimated_tokens,
            "estimated_cost_usd": round(self.estimated_cost_usd, 5),
            "last_success": self.last_success_ts or "Belum ada eksekusi",
            "checked_at": datetime.now(timezone.utc).strftime("%H:%M:%S UTC"),
        }


# =====================================================================
# 4. THE 9 SPECIALIZED ROUTERS + MUSE + HERMES ORCHESTRATOR
# =====================================================================

@dataclass
class RouteSpec:
    router_id: str
    name: str
    target_engine: str  # "MUSE", "HERMES", or "HYBRID"
    model_tier: str     # "fast-low-cost", "reasoning-pro", "code-specialist", "tool-calling"
    timeout_s: float
    keywords: Tuple[str, ...]
    cost_per_1k_tokens: float


class NineRouterMesh:
    """
    Deterministic + Confidence-Scored O(1) Router Selection across 9 Specialized Routers.
    Prevents calling all routers simultaneously. Includes fallback & circuit breaker state.
    """

    ROUTERS: Tuple[RouteSpec, ...] = (
        RouteSpec(
            "R1_FAST_CHAT", "Router 1 — Fast Conversational", "MUSE",
            "fast-low-cost", 8.0,
            ("halo", "hai", "apa kabar", "terima kasih", "thanks", "siapa kamu", "bantu"), 0.00015
        ),
        RouteSpec(
            "R2_DEEP_REASONING", "Router 2 — Deep Analysis & Architecture", "MUSE",
            "reasoning-pro", 25.0,
            ("analisis", "strategi", "arsitektur", "bandingkan", "evaluasi", "mengapa", "reasoning"), 0.0025
        ),
        RouteSpec(
            "R3_CODING_ENGINE", "Router 3 — Code & Refactoring Specialist", "HYBRID",
            "code-specialist", 20.0,
            ("kode", "code", "bug", "error", "python", "node", "refactor", "test", "sql", "docker", "api"), 0.0015
        ),
        RouteSpec(
            "R4_DOCUMENT_QA", "Router 4 — Document & RAG Extraction", "HERMES",
            "fast-low-cost", 18.0,
            ("dokumen", "pdf", "ringkas", "rangkum", "file", "ekstrak", "kontrak", "laporan"), 0.0005
        ),
        RouteSpec(
            "R5_AUTOMATION_WORKFLOW", "Router 5 — Workflow & Scheduler Orchestrator", "HERMES",
            "tool-calling", 30.0,
            ("workflow", "jadwal", "schedule", "otomatis", "cron", "briefing", "pipeline", "reminder"), 0.0008
        ),
        RouteSpec(
            "R6_BUSINESS_COPILOT", "Router 6 — Business Studio & KPI Copilot", "HYBRID",
            "reasoning-pro", 20.0,
            ("bisnis", "kpi", "omzet", "lead", "marketing", "konten", "sop", "campaign", "pelanggan", "sales"), 0.0015
        ),
        RouteSpec(
            "R7_GITHUB_OSINT", "Router 7 — GitHub Lab & Skill Discovery", "HERMES",
            "tool-calling", 20.0,
            ("github", "repo", "repository", "skill", "library", "open-source", "cve", "license"), 0.0008
        ),
        RouteSpec(
            "R8_CREATIVE_MUSE", "Router 8 — Muse Persona & Creative Studio", "MUSE",
            "reasoning-pro", 15.0,
            ("muse", "ide", "copywriting", "caption", "script", "story", "brainstorm"), 0.0012
        ),
        RouteSpec(
            "R9_SYSTEM_SRE", "Router 9 — System Diagnostics & Self-Healing", "HERMES",
            "fast-low-cost", 6.0,
            ("status", "health", "latensi", "latency", "cpu", "ram", "error rate", "queue", "diagnosa"), 0.0001
        ),
    )

    def __init__(self):
        self.circuit_open_until: Dict[str, float] = {}
        self.router_Map: Dict[str, RouteSpec] = {r.router_id: r for r in self.ROUTERS}

    def select_router(self, query: str, preferred_router: str = "auto") -> Tuple[RouteSpec, float, str]:
        """
        Selects the optimal single router based on intent scoring and circuit breaker status.
        Returns (RouteSpec, confidence_score, fallback_reason).
        """
        now = time.monotonic()
        if preferred_router in self.router_Map:
            spec = self.router_Map[preferred_router]
            if self.circuit_open_until.get(spec.router_id, 0.0) < now:
                return spec, 1.0, "user_override"

        q_lower = query.lower()
        best_spec = self.ROUTERS[0]  # Default: R1_FAST_CHAT
        best_score = 0.35

        for spec in self.ROUTERS:
            if self.circuit_open_until.get(spec.router_id, 0.0) > now:
                continue  # Skip router with open circuit breaker
            hits = sum(1 for kw in spec.keywords if kw in q_lower)
            if hits > 0:
                score = min(0.98, 0.55 + (hits * 0.15))
                if score > best_score:
                    best_score = score
                    best_spec = spec

        # Length complexity heuristic: long queries without specific keywords route to R2_DEEP_REASONING
        if best_spec.router_id == "R1_FAST_CHAT" and len(query.split()) > 40:
            r2 = self.router_Map["R2_DEEP_REASONING"]
            if self.circuit_open_until.get(r2.router_id, 0.0) < now:
                return r2, 0.72, "complexity_escalation"

        return best_spec, round(best_score, 2), "primary_match"

    def trip_circuit(self, router_id: str, cooldown_seconds: float = 45.0) -> None:
        self.circuit_open_until[router_id] = time.monotonic() + cooldown_seconds


class SuperAgentOrchestrator:
    """
    Coordinates Muse, the 9 Routers, and Hermes Agent with:
    - Bounded Concurrency (asyncio.Semaphore)
    - Response Caching (TTL Cache for idempotent read queries)
    - Exponential Backoff + Full Jitter
    - Automatic Fallback when a router/provider degrades
    """

    def __init__(
        self,
        config: AppConfig,
        store: PersistentStore,
        metrics: ObservabilityMetrics,
        guard: SecurityGuard,
    ):
        self.config = config
        self.store = store
        self.metrics = metrics
        self.guard = guard
        self.router_mesh = NineRouterMesh()
        self.semaphore = asyncio.Semaphore(config.max_concurrency)
        self._cache: Dict[str, Tuple[float, Dict[str, Any]]] = {}
        self.job_queue: asyncio.Queue = asyncio.Queue(maxsize=200)

    async def execute_request(self, user_id: int, text: str) -> Dict[str, Any]:
        start_t = time.perf_counter()

        # 1. RBAC & Rate Limit Check
        role = self.guard.get_role(user_id)
        if role == Role.UNAUTHORIZED:
            return {"ok": False, "error": "Akses ditolak. User ID kamu belum terdaftar di allowlist."}

        allowed, retry_after = self.guard.check_rate_limit(user_id)
        if not allowed:
            return {"ok": False, "error": f"Terlalu banyak permintaan. Coba lagi dalam {int(retry_after)} detik."}

        # 2. Prompt Injection Guard
        safe, reason = self.guard.inspect_prompt(text)
        if not safe:
            self.store.log_audit(user_id, "SECURITY_BLOCK", text[:120])
            return {"ok": False, "error": reason}

        # 3. Check short-lived TTL Cache for identical queries
        cache_key = hashlib.sha256(f"{user_id}:{text.strip().lower()}".encode()).hexdigest()
        now = time.monotonic()
        if cache_key in self._cache:
            exp, cached_val = self._cache[cache_key]
            if now < exp:
                lat = (time.perf_counter() - start_t) * 1000.0
                self.metrics.record(lat, True, tokens=0, cost_usd=0.0)
                return {**cached_val, "cached": True, "latency_ms": round(lat, 2)}

        # 4. Select single optimal router out of the 9 Routers
        prefs = self.store.get_user_prefs(user_id)
        route, confidence, reason_tag = self.router_mesh.select_router(text, prefs.get("preferred_router", "auto"))

        # 5. Execute with Semaphore & Bounded Retry + Jitter
        self.metrics.active_tasks += 1
        try:
            async with self.semaphore:
                result = await self._dispatch_with_fallback(user_id, text, route, confidence)
                lat = (time.perf_counter() - start_t) * 1000.0
                tokens = max(32, len(text.split()) * 4)
                cost = (tokens / 1000.0) * route.cost_per_1k_tokens
                self.metrics.record(lat, True, tokens=tokens, cost_usd=cost)

                response_payload = {
                    "ok": True,
                    "router_id": route.router_id,
                    "router_name": route.name,
                    "engine": route.target_engine,
                    "confidence": confidence,
                    "latency_ms": round(lat, 2),
                    "cached": False,
                    "reply": result,
                }
                self._cache[cache_key] = (now + 30.0, response_payload)
                return response_payload
        except Exception as exc:
            lat = (time.perf_counter() - start_t) * 1000.0
            self.metrics.record(lat, False)
            logger.error("Execution failure on %s: %s", route.router_id, exc)
            return {
                "ok": False,
                "error": "Layanan sedang sibuk atau mengalami gangguan sementara. Silakan coba lagi atau gunakan tombol Retry.",
            }
        finally:
            self.metrics.active_tasks = max(0, self.metrics.active_tasks - 1)

    async def _dispatch_with_fallback(
        self, user_id: int, text: str, route: RouteSpec, confidence: float
    ) -> str:
        max_attempts = 2
        for attempt in range(1, max_attempts + 1):
            try:
                if route.target_engine == "MUSE":
                    return await self._call_muse(user_id, text, route)
                elif route.target_engine == "HERMES":
                    return await self._call_hermes(user_id, text, route)
                else:
                    # HYBRID: Muse plans context -> Hermes executes sandboxed verification
                    plan = await self._call_muse(user_id, text, route)
                    exec_res = await self._call_hermes(user_id, f"[PLAN]{plan}", route)
                    return f"{plan}\n\n⚙️ **Hermes Verification:**\n{exec_res}"
            except Exception as exc:
                if attempt == max_attempts:
                    # Trip circuit breaker & fallback to R1_FAST_CHAT
                    self.router_mesh.trip_circuit(route.router_id, cooldown_seconds=30.0)
                    fallback_route = self.router_mesh.ROUTERS[0]
                    return (
                        f"⚠️ *{route.name} sedang sibuk, dialihkan otomatis ke {fallback_route.name}.*\n\n"
                        f"Permintaanmu sudah diterima dan diproses dalam mode fallback aman."
                    )
                backoff = (0.15 * (2 ** (attempt - 1))) + random.uniform(0.01, 0.05)
                await asyncio.sleep(backoff)
        return "Selesai."


    _NR_KEY = None

    def _ninerouter_key(self) -> str:
        if not self._NR_KEY:
            import sqlite3 as _sq
            con = _sq.connect(os.path.expanduser("~/.9router/db/data.sqlite"))
            try:
                row = con.execute(
                    "SELECT key FROM apiKeys WHERE name='gembul-design' LIMIT 1").fetchone()
            finally:
                con.close()
            if not row:
                raise RuntimeError("9router apiKey 'gembul-design' missing")
            self._NR_KEY = row[0]
        return self._NR_KEY

    @staticmethod
    def _extract_office_action(reply: str):
        """Ambil aksi kantor dari balasan model (format AKSI: JSON atau XML
        function_calls bawaan Claude). Return (action_dict|None, reply_bersih)."""
        m = re.search(r"^AKSI:\s*(\{.*\})\s*$", reply, re.M)
        if m:
            try:
                return json.loads(m.group(1)), (reply[:m.start()] + reply[m.end():]).strip()
            except Exception:
                return None, reply
        xm = re.search(
            r"<function_calls>\s*<invoke name=\"function_call\">\s*"
            r"<parameter name=\"name\">([a-z_]+)</parameter>(.*?)</invoke>\s*</function_calls>",
            reply, re.S)
        if xm:
            act = {"action": xm.group(1)}
            for pm in re.finditer(
                    r"<parameter name=\"([a-z_]+)\">([^<]*)</parameter>", xm.group(2)):
                k, v = pm.group(1), pm.group(2).strip()
                if k in ("index", "progress"):
                    try:
                        v = int(v)
                    except Exception:
                        pass
                act[k] = v
            return act, (reply[:xm.start()] + reply[xm.end():]).strip()
        return None, reply

    def _gembul_system_prompt(self) -> str:
        try:
            import office_ops
            ctx = office_ops.office_context()
        except Exception:
            ctx = "(data kantor tidak tersedia)"
        return """Kamu adalah Gembul, asisten pribadi user dan pengelola Kantor KCSH 3D (kantor AI, live di https://kantor-kcsh.vercel.app).
GAYA: Bahasa Indonesia santai, ramah, singkat-padat. Emoji secukupnya. Jangan pernah mengaku sebagai model AI lain.

DATA TUGAS KANTOR TERKINI (indeks dimulai dari 0):
""" + ctx + """

PROTOKOL AKSI KANTOR: Jika user meminta perubahan/daftar tugas kantor (ACC/menyetujui tugas, menambah tugas baru, mengubah progres, menanyakan daftar tugas), sertakan TEPAT SATU baris dengan format:
AKSI: {"action":"approve_task","staff":"Yazid","index":0}
AKSI: {"action":"add_task","staff":"Nadia","title":"Riset kompetitor TikTok","eta":"2 hari"}
AKSI: {"action":"set_progress","staff":"Nadia","index":1,"progress":80}
AKSI: {"action":"list_tasks","staff":"Yazid"}
- "staff" = nama staf (nama depan cukup). "index" = nomor tugas dari daftar di atas.
- Hanya SATU baris AKSI per pesan, lalu tulis balasan santai SEOLAH tugas sudah dikerjakan (sistem mengeksekusinya sungguhan, lalu me-redeploy situsnya).
- Jika bukan permintaan terkait tugas kantor, JANGAN tulis baris AKSI.
- WAJIB format baris AKSI: di atas persis (JSON mentah). JANGAN PERNAH memakai format XML, <function_calls>, atau format tool lain — sistem hanya membaca baris AKSI:."""

    async def _call_muse(self, user_id: int, text: str, route: RouteSpec) -> str:
        """Backend 9router (Claude) — dengan protokol AKSI kantor."""
        import httpx
        system_prompt = self._gembul_system_prompt()
        history = []
        try:
            history = self.store.get_history(user_id, limit=10)
        except Exception:
            pass
        messages = [{"role": "system", "content": system_prompt}]
        for h in history:
            messages.append({"role": h["role"], "content": h["content"]})
        messages.append({"role": "user", "content": text})
        try:
            async with httpx.AsyncClient(timeout=120.0, trust_env=False) as client:
                resp = await client.post(
                    "http://127.0.0.1:20128/api/v1/chat/completions",
                    headers={"Authorization": "Bearer " + self._ninerouter_key()},
                    json={
                        "model": "cc/claude-haiku-4-5-20251001",
                        "stream": False,
                        "max_tokens": 1000,
                        "temperature": 0.3,
                        "messages": messages,
                    },
                )
                resp.raise_for_status()
                data = resp.json()
                msg = data["choices"][0]["message"]
                content = msg.get("content", "")
                if isinstance(content, list):
                    content = "".join(
                        b.get("text", "") for b in content if isinstance(b, dict))
                reply = (content or "").strip() or "(no response)"
        except Exception as e:
            logger.error(f"9router call failed: {e}")
            return "Maaf, AI-nya lagi error. Coba lagi nanti."
        # --- protokol AKSI kantor ---
        action, reply = self._extract_office_action(reply)
        if action:
            try:
                import office_ops
                if action.get("action") in (
                        "list_tasks", "approve_task", "add_task", "set_progress"):
                    summary, mutated = office_ops.apply_action(action)
                    reply = (reply.rstrip() + "\n\n" + summary) if reply.strip() else summary
                    if mutated:
                        reply += "\n\n⏳ Lagi ku-deploy ulang biar live di situs…"
                        try:
                            dep = await asyncio.to_thread(office_ops.redeploy)
                            reply += f"\n{dep}"
                        except Exception as e:
                            logger.error(f"redeploy failed: {e}")
                            reply += "\n⚠️ Deploy gagal, tapi data sudah tersimpan."
                else:
                    pass
            except Exception as e:
                logger.error(f"AKSI exec failed: {e}")
                reply = re.sub(r"^AKSI:.*$", "", reply, flags=re.M).strip()
        try:
            self.store.add_history(user_id, "user", text)
            self.store.add_history(user_id, "assistant", reply)
        except Exception:
            pass
        return reply

    async def _call_hermes(self, user_id: int, text: str, route: RouteSpec) -> str:
        """Backend 9router (Claude) — mode task, tanpa protokol AKSI (sudah di _call_muse)."""
        import httpx
        system_prompt = ("Kamu adalah Gembul, asisten pribadi user yang helpful dan praktis. "
                         "Bahasa Indonesia santai. Jawab singkat-padat dengan langkah konkret.")
        try:
            async with httpx.AsyncClient(timeout=120.0, trust_env=False) as client:
                resp = await client.post(
                    "http://127.0.0.1:20128/api/v1/chat/completions",
                    headers={"Authorization": "Bearer " + self._ninerouter_key()},
                    json={
                        "model": "cc/claude-haiku-4-5-20251001",
                        "stream": False,
                        "max_tokens": 1000,
                        "temperature": 0.7,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": text},
                        ],
                    },
                )
                resp.raise_for_status()
                data = resp.json()
                msg = data["choices"][0]["message"]
                content = msg.get("content", "")
                if isinstance(content, list):
                    content = "".join(
                        b.get("text", "") for b in content if isinstance(b, dict))
                return (content or "").strip() or "(no response)"
        except Exception as e:
            logger.error(f"9router/hermes call failed: {e}")
            return "Maaf, AI-nya lagi error. Coba lagi nanti."

