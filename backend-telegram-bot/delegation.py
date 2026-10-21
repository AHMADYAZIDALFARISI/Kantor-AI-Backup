#!/usr/bin/env python3
"""delegation — orchestrator delegasi lead → sub-agent (Fase D1).

Berjalan di proses bot Telegram (VM). Prinsip (docs/evolution/13):
- Satu-satunya penulis delegations.json; penulisan atomik (tmp + rename).
- Sub-agent hanya dari org.json milik lead tsb; capability divalidasi server-side.
- D1: eksekusi teks-saja via LLM. Tidak ada tool tulis/eksternal.
- Retry 2x backoff HANYA untuk error provider (429/5xx/timeout).
- Idempotency: idempotency_key yang sama tidak membuat run kedua.
"""
import asyncio
import datetime
import json
import os
import re

HOME = os.path.expanduser("~")
DATA = os.path.join(HOME, "workspace", "kantor-kcsh", "v3", "office3d", "public", "data")
RUN_FILE = os.path.join(DATA, "delegations.json")

TERMINAL = {"completed", "failed", "cancelled"}
TRANSITIONS = {
    "queued": {"planning", "cancelled"},
    "planning": {"assigned", "failed", "cancelled"},
    "assigned": {"running", "cancelled"},
    "running": {"completed", "failed", "blocked", "retrying", "waiting_approval", "cancelled"},
    "retrying": {"running", "failed", "cancelled"},
    "blocked": {"running", "cancelled"},
    "waiting_approval": {"running", "cancelled"},
}


def _now():
    return datetime.datetime.now().astimezone().isoformat(timespec="seconds")


def _slug(s):
    return re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")[:48]


def load_runs():
    try:
        with open(RUN_FILE, encoding="utf-8") as f:
            d = json.load(f)
        return d if isinstance(d, dict) and isinstance(d.get("runs"), list) else {"runs": []}
    except FileNotFoundError:
        return {"runs": []}


def save_runs(d):
    tmp = RUN_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False, indent=1)
    os.replace(tmp, RUN_FILE)


def load_json(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as f:
        return json.load(f)


class ProviderError(Exception):
    """Error provider yang boleh di-retry (429/5xx/timeout)."""


def _is_provider_error(e):
    if isinstance(e, ProviderError):
        return True
    s = str(e)
    return any(c in s for c in ("429", "500", "502", "503", "504", "timeout", "Timeout", "ConnectError"))


def _set_status(obj, new):
    cur = obj["status"]
    if new == cur:
        return
    if new not in TRANSITIONS.get(cur, set()):
        raise ValueError(f"transisi status tidak valid: {cur} -> {new}")
    obj["status"] = new
    obj["updated_at"] = _now()


def _extract_json(text, fallback=None):
    """Ambil JSON pertama dari teks LLM; fallback bila gagal."""
    if not text:
        return fallback
    m = re.search(r"(\[.*\]|\{.*\})", text, re.S)
    if not m:
        return fallback
    try:
        return json.loads(m.group(1))
    except Exception:
        return fallback


class DelegationOrchestrator:
    """chat_fn: async (system: str, user: str) -> str (teks balasan model)."""

    def __init__(self, chat_fn, max_subtasks=5, timeout_note=None, chat_plan=None, chat_synth=None, engine=None):
        self.chat = chat_fn
        self.chat_plan = chat_plan or chat_fn
        self.chat_synth = chat_synth or chat_fn
        self.engine = engine
        self.max_subtasks = max_subtasks
        self._lock = asyncio.Lock()

    # ---------- validasi organisasi ----------
    def _org(self):
        org = load_json("org.json")
        staff = {s["id"]: s for s in load_json("staff.json")}
        return org, staff

    def subs_of(self, lead_id):
        org, staff = self._org()
        if lead_id not in staff:
            raise ValueError(f"lead tidak dikenal: {lead_id}")
        return staff[lead_id], org.get("leads", {}).get(lead_id, [])

    # ---------- langkah LLM dengan retry ----------
    async def _call(self, system, user, attempts_obj=None, fn=None):
        last = None
        for i in range(3):  # 1 + 2 retry
            if attempts_obj is not None:
                attempts_obj["attempts"] = attempts_obj.get("attempts", 0) + 1
            try:
                return await (fn or self.chat)(system, user)
            except Exception as e:  # noqa: BLE001
                last = e
                if not _is_provider_error(e) or i == 2:
                    raise
                await asyncio.sleep(5 if i == 0 else 20)
        raise last

    # ---------- dekomposisi oleh lead ----------
    async def decompose(self, lead_id, instruction):
        lead, subs = self.subs_of(lead_id)
        if not subs:
            raise ValueError(f"{lead.get('name', lead_id)} tidak memiliki sub-agen terdaftar.")
        katalog = "\n".join(
            f"- id:{u['id']} nama:{u['name']} peran:{u['role']} kapabilitas:{', '.join(u.get('capabilities', []))}"
            for u in subs)
        system = (
            f"Kamu adalah {lead.get('name')}, {lead.get('title','')} di kantor Team Kreatif Agent AI Yazid. "
            "Tugasmu memecah instruksi pemilik menjadi subtugas untuk sub-agenmu. "
            "Jawab HANYA JSON array: [{\"sub_agent_id\":\"...\",\"capability\":\"...\",\"instruction\":\"...\"}]. "
            "Gunakan hanya sub_agent_id & capability dari katalog. Maksimal "
            f"{self.max_subtasks} subtugas. Instruksi subtugas harus konkret dan singkat.")
        raw = await self._call(system, f"Katalog sub-agen:\n{katalog}\n\nInstruksi pemilik: {instruction}", fn=self.chat_plan)
        plan = _extract_json(raw, fallback=None)
        if not isinstance(plan, list) or not plan:
            raise ValueError("lead tidak menghasilkan rencana subtugas yang valid")
        by_id = {u["id"]: u for u in subs}
        out = []
        for item in plan[: self.max_subtasks]:
            sid = (item or {}).get("sub_agent_id")
            cap = (item or {}).get("capability")
            ins = ((item or {}).get("instruction") or "").strip()
            if sid not in by_id:
                raise ValueError(f"sub-agen tidak dikenal dari lead ini: {sid}")
            if cap not in (by_id[sid].get("capabilities") or []):
                raise ValueError(f"kapabilitas '{cap}' tidak dimiliki sub-agen {sid}")
            if not ins:
                raise ValueError("instruksi subtugas kosong")
            out.append({"sub_agent_id": sid, "capability": cap, "instruction": ins[:800]})
        return out

    # ---------- eksekusi satu subtask ----------
    async def _execute_subtask(self, sub_meta, instruction):
        system = (
            f"Kamu adalah {sub_meta['name']}, {sub_meta['role']} di kantor Team Kreatif Agent AI Yazid. "
            f"{sub_meta.get('desc','')} Kerjakan instruksi berikut secara konkret dan ringkas "
            "(maks ~200 kata). Ini eksekusi teks: jangan mengklaim telah mengubah sistem apa pun.")
        return (await self.chat(system, instruction))[:4000]

    # ---------- run penuh ----------
    async def run_delegation(self, lead_id, instruction, idempotency_key, actor="telegram"):
        async with self._lock:
            d = load_runs()
            for r in d["runs"]:
                if r.get("idempotency_key") == idempotency_key:
                    return r  # duplikat pengiriman: kembalikan run yang ada
            lead, _ = self.subs_of(lead_id)
            run = {
                "id": "run_" + datetime.datetime.now().strftime("%Y%m%d%H%M%S") + "_" + _slug(lead_id),
                "lead_id": lead_id, "lead_name": lead.get("name", lead_id),
                "instruction": instruction[:1200], "actor": actor,
                "idempotency_key": idempotency_key,
                "status": "queued", "created_at": _now(), "updated_at": _now(),
                "subtasks": [], "synthesis": None, "error": None,
                "engine": self.engine,
            }
            d["runs"].append(run)
            save_runs(d)
        try:
            _set_status(run, "planning")
            plan = await self.decompose(lead_id, instruction)
            _, subs = self.subs_of(lead_id)
            by_id = {u["id"]: u for u in subs}
            run["subtasks"] = [{
                "id": f"sub_{i+1}", "sub_agent_id": p["sub_agent_id"],
                "sub_name": by_id[p["sub_agent_id"]]["name"],
                "capability": p["capability"], "instruction": p["instruction"],
                "status": "assigned", "attempts": 0, "result": None, "error": None,
            } for i, p in enumerate(plan)]
            _set_status(run, "assigned")
            async with self._lock:
                d = load_runs()
                d["runs"] = [run if r["id"] == run["id"] else r for r in d["runs"]]
                save_runs(d)
            _set_status(run, "running")
            for st in run["subtasks"]:
                st["status"] = "running"
                try:
                    res = await self._call_sub(st, by_id[st["sub_agent_id"]])
                    st["result"] = {"summary": res}
                    st["status"] = "completed"
                except Exception as e:  # noqa: BLE001
                    st["error"] = str(e)[:300]
                    st["status"] = "failed"
                st["updated_at"] = _now()
                async with self._lock:
                    d = load_runs()
                    d["runs"] = [run if r["id"] == run["id"] else r for r in d["runs"]]
                    save_runs(d)
            failed = [s for s in run["subtasks"] if s["status"] == "failed"]
            if failed and len(failed) == len(run["subtasks"]):
                run["error"] = "semua subtugas gagal: " + (failed[0]["error"] or "")
                _set_status(run, "failed")
            else:
                lead2, _ = self.subs_of(lead_id)
                ringkasan = "\n".join(
                    f"- {s['sub_name']}: {((s.get('result') or {}).get('summary') or ('GAGAL: ' + (s.get('error') or '')))[:600]}"
                    for s in run["subtasks"])
                system = (
                    f"Kamu adalah {lead2.get('name')}, {lead2.get('title','')}. Satukan hasil sub-agenmu menjadi "
                    "satu ringkasan akhir untuk pemilik (Bahasa Indonesia, maks ~150 kata). Sebutkan yang gagal bila ada.")
                try:
                    synth = await self._call(system, f"Instruksi awal: {instruction}\n\nHasil sub-agen:\n{ringkasan}", fn=self.chat_synth)
                    run["synthesis"] = {"summary": synth[:3000]}
                except Exception as e:  # noqa: BLE001
                    run["synthesis"] = {"summary": ringkasan[:3000], "note": f"sintesis LLM gagal ({str(e)[:120]}); menampilkan hasil mentah"}
                _set_status(run, "completed")
        except Exception as e:  # noqa: BLE001
            run["error"] = str(e)[:300]
            try:
                _set_status(run, "failed")
            except Exception:
                run["status"] = "failed"
        run["updated_at"] = _now()
        async with self._lock:
            d = load_runs()
            d["runs"] = [run if r["id"] == run["id"] else r for r in d["runs"]]
            save_runs(d)
        return run

    async def _call_sub(self, st, sub_meta):
        last = None
        for i in range(3):
            st["attempts"] = st.get("attempts", 0) + 1
            try:
                return await self._execute_subtask(sub_meta, st["instruction"])
            except Exception as e:  # noqa: BLE001
                last = e
                if not _is_provider_error(e) or i == 2:
                    raise
                st["status"] = "retrying"
                await asyncio.sleep(5 if i == 0 else 20)
        raise last


# ---------- chat_fn produksi: 9router (pola sama dengan super_agent_core) ----------
def _ninerouter_key():
    import sqlite3
    con = sqlite3.connect(os.path.join(HOME, ".9router", "db", "data.sqlite"))
    row = con.execute("SELECT key FROM apiKeys WHERE name='gembul-design' LIMIT 1").fetchone()
    con.close()
    if not row:
        raise RuntimeError("9router apiKey 'gembul-design' missing")
    return row[0]


async def nine_router_chat(system, user, model="cc/claude-haiku-4-5-20251001", max_tokens=900):
    import httpx
    async with httpx.AsyncClient(timeout=90.0, trust_env=False) as client:
        r = await client.post(
            "http://127.0.0.1:20128/api/v1/chat/completions",
            headers={"Authorization": "Bearer " + _ninerouter_key()},
            json={"model": model, "max_tokens": max_tokens, "stream": False,
                  "messages": [{"role": "system", "content": system},
                               {"role": "user", "content": user}]})
        if r.status_code in (429, 500, 502, 503, 504):
            raise ProviderError(f"9router HTTP {r.status_code}")
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"]


# Routing model bertingkat (strategi efisiensi token, 2026-10-20):
# rencana + sintesis -> Sonnet (penalaran terstruktur), eksekusi -> Gemini Flash
# (kuota gratis, volume) dengan fallback Haiku saat Gemini gagal/kosong.
async def nine_router_chat_plan(system, user):
    return await nine_router_chat(system, user, model="cc/claude-sonnet-5", max_tokens=1200)


async def nine_router_chat_exec(system, user):
    try:
        out = await nine_router_chat(system, user, model="gemini/gemini-3.5-flash", max_tokens=1100)
        if out and out.strip():
            return out
        raise ProviderError("gemini_empty")
    except Exception:
        return await nine_router_chat(system, user)


def production_orchestrator():
    return DelegationOrchestrator(
        nine_router_chat_exec,
        chat_plan=nine_router_chat_plan,
        chat_synth=nine_router_chat_plan,
        engine={"plan": "cc/claude-sonnet-5",
                "exec": "gemini/gemini-3.5-flash (fallback cc/claude-haiku-4-5)",
                "synth": "cc/claude-sonnet-5"})
