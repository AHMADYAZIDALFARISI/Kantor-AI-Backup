#!/usr/bin/env python3
"""
Gembul Super Agent Bot - aiogram entry point.
Uses super_agent_core.py (SecurityGuard, PersistentStore, SuperAgentOrchestrator)
with real FCC backend for AI.
"""
import asyncio
import logging
import os
import sys

# Sanitize proxy
os.environ["no_proxy"] = "localhost,127.0.0.1"
os.environ["NO_PROXY"] = "localhost,127.0.0.1"

from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.client.session.aiohttp import AiohttpSession

# Import super agent core
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import delegation as delegation_mod
import office_ops
from super_agent_core import (
    AppConfig, SecurityGuard, PersistentStore,
    ObservabilityMetrics, SuperAgentOrchestrator,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("GembulBot")

# Gen Z system prompt is baked into super_agent_core._call_muse

async def main():
    # Load config from env
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if not token:
        # Fallback to ~/.hermes/.env
        env_path = os.path.expanduser("~/.hermes/.env")
        if os.path.exists(env_path):
            with open(env_path) as f:
                for line in f:
                    if line.strip().startswith("TELEGRAM_BOT_TOKEN="):
                        token = line.strip().split("=", 1)[1]
    if not token:
        print("ERROR: TELEGRAM_BOT_TOKEN not set", file=sys.stderr)
        sys.exit(1)

    allowed = os.getenv("TELEGRAM_ALLOWED_USERS", "") or os.getenv("ALLOWED_USER_IDS", "")
    if not allowed:
        env_path = os.path.expanduser("~/.hermes/.env")
        if os.path.exists(env_path):
            with open(env_path) as f:
                for line in f:
                    if line.strip().startswith("TELEGRAM_ALLOWED_USERS="):
                        allowed = line.strip().split("=", 1)[1]
    # Set env for AppConfig
    if allowed:
        os.environ["ALLOWED_USER_IDS"] = allowed
        os.environ["ADMIN_USER_IDS"] = allowed

    config = AppConfig(bot_token=token)
    store = PersistentStore(config.db_path)
    metrics = ObservabilityMetrics()
    guard = SecurityGuard(config)
    orchestrator = SuperAgentOrchestrator(config, store, metrics, guard)

    # Configure proxy for aiogram - pass explicitly
    proxy_url = os.getenv("https_proxy") or os.getenv("HTTPS_PROXY")
    session = AiohttpSession(proxy=proxy_url) if proxy_url else AiohttpSession()
    bot = Bot(token=token, session=session)
    dp = Dispatcher()

    @dp.message(Command("start"))
    async def cmd_start(msg: types.Message):
        await msg.answer(
            "Halo! Aku Gembul, bot AI super agent 😎\n\n"
            "Kirim pesan apa aja, atau coba:\n"
            "/skills - lihat kemampuanku\n"
            "/status - status sistem\n"
            "/help - bantuan"
        )

    @dp.message(Command("help"))
    async def cmd_help(msg: types.Message):
        await msg.answer(
            "Cara pakai:\n\n"
            "💬 Chat biasa - tanya apa aja\n"
            "/skills - lihat skills\n"
            "/status - cek sistem\n"
            "/help - pesan ini"
        )

    @dp.message(Command("status"))
    async def cmd_status(msg: types.Message):
        snap = metrics.snapshot() if hasattr(metrics, 'snapshot') else {}
        await msg.answer(
            f"📊 Status: 🟢 OK\n"
            f"Request: {snap.get('total_requests', 'N/A')}\n"
            f"Bot jalan normal!"
        )

    @dp.message(Command("skills"))
    async def cmd_skills(msg: types.Message):
        await msg.answer(
            "🤖 Skills: github, gmail, spotify, image-search, tts, "
            "google-docs, notion, slack, dan 90+ lainnya!\n\n"
            "Tanya aja mau ngapain 😎"
        )

    async def handle_delegation(msg: types.Message, text: str):
        # Format: "delegasikan ke <nama lead>: <instruksi>"
        body = text[len("delegasikan"):].strip()
        if body.lower().startswith("ke "):
            body = body[3:].strip()
        target, _, instruction = body.partition(":")
        target, instruction = target.strip(), instruction.strip()
        lead_id = office_ops.resolve_staff(target) if target else None
        if not lead_id or not instruction:
            await msg.answer(
                "Format delegasi: delegasikan ke <nama lead>: <instruksi>\n"
                "Contoh: delegasikan ke Yazid: periksa keamanan endpoint /api/chat")
            return
        await msg.answer(f"Siap, delegasi ke {target} dibuat. Menjalankan subtugas ke sub-agennya...")
        try:
            orch = delegation_mod.production_orchestrator()
            run = await orch.run_delegation(
                lead_id, instruction, f"tg:{msg.chat.id}:{msg.message_id}")
        except Exception as e:  # noqa: BLE001
            await msg.answer(f"Delegasi gagal dibuat: {str(e)[:200]}")
            return
        lines = [f"Delegasi {run['id']} — status: {run['status']}"]
        for st in run.get("subtasks", []):
            mark = "✅" if st["status"] == "completed" else "❌"
            lines.append(f"{mark} {st['sub_name']}: {st['status']}")
        if run.get("synthesis"):
            lines.append("\nRingkasan lead:\n" + run["synthesis"]["summary"][:1500])
        if run.get("error"):
            lines.append("Error: " + run["error"][:300])
        await msg.answer("\n".join(lines)[:4000])
        try:
            note = office_ops.redeploy()
            await msg.answer("Publikasi ke situs: " + note)
        except Exception as e:  # noqa: BLE001
            await msg.answer("Catatan: redeploy untuk publikasi tertunda (" + str(e)[:120] + ")")

    @dp.message()
    async def handle_message(msg: types.Message):
        if not msg.text:
            return
        user_id = msg.from_user.id
        if msg.text.strip().lower().startswith("delegasikan"):
            # hanya pemilik yang boleh mendelegasikan (samakan dengan gate inti bot)
            from super_agent_core import AppConfig as _AC
            if user_id not in _AC().allowed_user_ids:
                await msg.answer("Maaf, delegasi hanya untuk pemilik kantor.")
                return
            await handle_delegation(msg, msg.text.strip())
            return
        # Typing indicator
        await bot.send_chat_action(msg.chat.id, "typing")
        # Route through super agent orchestrator
        result = await orchestrator.execute_request(user_id, msg.text)
        if result.get("ok"):
            reply = result.get("reply", "(no response)")
            # Split long messages
            for i in range(0, len(reply), 4000):
                await msg.answer(reply[i:i+4000])
        else:
            await msg.answer(f"⚠️ {result.get('error', 'Error')}")

    logger.info("Starting Gembul Super Agent Bot...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())
