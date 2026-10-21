#!/bin/bash
# Start the Telegram AI bot (@AyasiGembulBot) — Super Agent build.
# Uses 9router (Claude) at 127.0.0.1:20128 as the AI backend.
# Config (bot token, allowed users) read from ~/.hermes/.env (chmod 600).
# NOTE 2026-10-14: entry point is super_bot.py (wired AI via FCC); the old
# bot.py is retired and kept only as a fallback. Starting bot.py alongside
# super_bot.py causes a 409 Conflict on the Telegram token.
# Run: bash start-bot.sh
# Stop: pkill -f "python super_bot.py"

cd ~/workspace/telegram-bot
exec .venv/bin/python super_bot.py
