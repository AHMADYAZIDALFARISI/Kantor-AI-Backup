#!/usr/bin/env python3
"""
Simple Telegram bot using FCC (Free Claude Code) as the AI backend.
Polls Telegram Bot API, forwards messages to FCC's /v1/messages, sends replies back.

Env vars (or ~/.hermes/.env):
  TELEGRAM_BOT_TOKEN - bot token from @BotFather
  TELEGRAM_ALLOWED_USERS - comma-separated numeric Telegram IDs
"""
import json
import os
import sys
import time
import urllib.request
import urllib.parse

# Sanitize proxy env (container default has bracketed IPv6 that breaks httpx/urllib)
os.environ["no_proxy"] = "localhost,127.0.0.1"
os.environ["NO_PROXY"] = "localhost,127.0.0.1"

FCC_URL = "http://127.0.0.1:8082"
FCC_MODEL = "nvidia_nim/nvidia/nemotron-3-super-120b-a12b"
POLL_TIMEOUT = 30

# System prompt: Gen Z Indonesian persona + powerful skills awareness
SYSTEM_PROMPT = """Kamu adalah Gembul, bot AI yang ngobrol kayak anak Gen Z Indonesia asli.

GAYA BICARA:
- Bahasa Indonesia santai, kayak chat sama temen
- Pake slang Gen Z secukupnya: wkwk, anjir, gila, sumpah, bjir, lah, dong, sih, banget
- Jangan kaku/formal, jangan kayak robot customer service
- Boleh pake emoji tapi jangan berlebihan (1-3 per pesan)
- Respon singkat-padat, jangan ceramah panjang kecuali diminta
- Kadang becanda, playful, tapi tetap helpful

KEMAMPUAN (SKILLS):
Kamu punya akses ke 97 skills, antara lain:
- github: cari repo, baca kode
- gmail, google-calendar, google-docs, google-drive: kerja sama Google Workspace
- spotify: cari musik, bikin playlist
- image-search: cari gambar
- tts: text-to-speech
- podcast: bikin podcast
- flightaware, duffel: info penerbangan
- plaid: info finansial
- shopify, stripe: e-commerce
- Dan 80+ lainnya (asana, notion, slack, linear, figma, dll)

Kamu juga punya pengetahuan dari:
- Agency agents (spesialis AI: frontend, content, dll)
- OpenMontage (produksi video AI)
- MetaGPT (multi-agent framework)
- OpenHands (AI coding agent)
- Awesome Hermes Agent (koleksi skills Hermes)

Kalau user nanya apa yang kamu bisa, jelasin dengan santai dan kasih contoh.
Kalau user minta sesuatu yang butuh skill khusus, jelasin kamu bisa bantu dan tanya detailnya.

CONTOH:
User: "halo"
Kamu: "halo juga! lagi ngapain nih? 👀"

User: "kamu bisa apa aja?"
Kamu: "banyak wkwk! aku bisa bantu cari info penerbangan, bikin playlist spotify, cari gambar, bantu nulis docs, sampe ngide konten. mau coba yang mana? 😎"

Jangan pernah bilang kamu AI model atau sebutin hal teknis. Kamu Gembul, temen ngobrol yang powerful."""

# Stickers: loaded from Telegram sticker packs (file_ids)
# Maps mood -> list of sticker file_ids
STICKERS = {}


def load_env():
    """Load from env vars, fallback to ~/.hermes/.env."""
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    allowed = os.getenv("TELEGRAM_ALLOWED_USERS", "")
    env_path = os.path.expanduser("~/.hermes/.env")
    if (not token or not allowed) and os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line.startswith("TELEGRAM_BOT_TOKEN=") and not token:
                    token = line.split("=", 1)[1].strip()
                elif line.startswith("TELEGRAM_ALLOWED_USERS=") and not allowed:
                    allowed = line.split("=", 1)[1].strip()
    return token, {u.strip() for u in allowed.split(",") if u.strip()}


def tg_api(token, method, params=None):
    """Call Telegram Bot API."""
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = urllib.parse.urlencode(params or {}).encode() if params else None
    req = urllib.request.Request(url, data=data, method="POST" if data else "GET")
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.load(r)


def load_stickers():
    """Load sticker file_ids grouped by mood."""
    import random
    path = os.path.join(os.path.dirname(__file__), "stickers.json")
    if not os.path.exists(path):
        return {}
    with open(path) as f:
        data = json.load(f)
    # Group: happy/playful, cute, funny, celebrate, curious
    moods = {
        "happy": [],
        "cute": [],
        "funny": [],
        "celebrate": [],
        "curious": [],
    }
    emoji_mood = {
        "🐶": "happy", "🐱": "cute", "🎉": "celebrate", "🐵": "funny",
        "🙊": "funny", "🐼": "cute", "🐯": "happy", "🐻": "cute",
        "🐨": "cute", "🐹": "cute", "🐸": "funny", "👀": "curious",
        "✋": "happy", "🐾": "cute",
    }
    for s in data:
        mood = emoji_mood.get(s.get("emoji"), "happy")
        moods[mood].append(s["file_id"])
    # Fallback: put all in happy if empty
    all_ids = [s["file_id"] for s in data]
    for m in moods:
        if not moods[m]:
            moods[m] = all_ids
    return moods


def fcc_chat(message, history):
    """Send message to FCC, return AI reply text."""
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history)
    messages.append({"role": "user", "content": message})
    payload = json.dumps({
        "model": FCC_MODEL,
        "messages": messages,
        "max_tokens": 1000,
    }).encode()
    req = urllib.request.Request(
        f"{FCC_URL}/v1/messages",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        result = json.load(r)
    # Extract text from Anthropic-style response
    texts = []
    for block in result.get("content", []):
        if block.get("type") == "text":
            texts.append(block.get("text", ""))
    return "".join(texts).strip() or "(no response)"


def maybe_send_sticker(token, chat_id, text):
    """Occasionally send a relevant sticker (25% chance)."""
    import random
    if random.random() > 0.25:
        return False
    # Pick mood based on text content
    text_lower = text.lower()
    if any(w in text_lower for w in ["wkwk", "haha", "lucu", "ngakak", "🤣", "😂"]):
        mood = "funny"
    elif any(w in text_lower for w in ["selamat", "yeay", "mantap", "🎉", "🥳"]):
        mood = "celebrate"
    elif any(w in text_lower for w in ["?", "gimana", "kenapa", "apa"]):
        mood = "curious"
    elif any(w in text_lower for w in ["cute", "gemes", "lucu banget", "🥺"]):
        mood = "cute"
    else:
        mood = "happy"
    stickers = STICKERS.get(mood, [])
    if not stickers:
        return False
    sticker_id = random.choice(stickers)
    try:
        tg_api(token, "sendSticker", {"chat_id": chat_id, "sticker": sticker_id})
        return True
    except Exception as e:
        print(f"Sticker send failed: {e}", flush=True)
        return False


def main():
    global STICKERS
    token, allowed = load_env()
    if not token:
        print("ERROR: TELEGRAM_BOT_TOKEN not set", file=sys.stderr)
        sys.exit(1)
    if not allowed:
        print("ERROR: TELEGRAM_ALLOWED_USERS not set", file=sys.stderr)
        sys.exit(1)

    STICKERS = load_stickers()
    total = sum(len(v) for v in STICKERS.values())
    print(f"Bot starting. Allowed users: {allowed}", flush=True)
    print(f"FCC backend: {FCC_URL}", flush=True)
    print(f"Loaded {total} stickers", flush=True)

    # Verify bot token
    me = tg_api(token, "getMe")
    print(f"Bot: @{me['result']['username']}", flush=True)

    offset = 0
    histories = {}  # chat_id -> list of messages (simple memory)

    while True:
        try:
            updates = tg_api(token, "getUpdates", {
                "offset": offset,
                "timeout": POLL_TIMEOUT,
            })
            for u in updates.get("result", []):
                offset = u["update_id"] + 1
                msg = u.get("message", {})
                frm = msg.get("from", {})
                user_id = str(frm.get("id", ""))
                chat_id = msg.get("chat", {}).get("id")
                text = msg.get("text", "")

                if not text or not chat_id:
                    continue

                # Allowlist check
                if user_id not in allowed and "*" not in allowed:
                    print(f"Ignored message from unauthorized user {user_id}", flush=True)
                    continue

                print(f"Message from {frm.get('first_name')} ({user_id}): {text[:60]}", flush=True)

                # Handle /start
                if text == "/start":
                    tg_api(token, "sendMessage", {
                        "chat_id": chat_id,
                        "text": "Halo! Aku Gembul, bot AI kamu yang powerful 😎\n\nKirim pesan apa aja, atau coba:\n/skills - lihat 97 kemampuanku\n/help - bantuan",
                    })
                    continue

                # Handle /help
                if text == "/help":
                    tg_api(token, "sendMessage", {
                        "chat_id": chat_id,
                        "text": "Cara pakai aku:\n\n💬 Chat biasa - tanya apa aja\n/skills - lihat semua kemampuanku\n/help - pesan ini\n\nAku bisa bantu cari info, bikin konten, ngide, sampe ngobrol santai. Gas!",
                    })
                    continue

                # Handle /skills - list ALL 97 skills with functions
                if text == "/skills":
                    skills_text = """🤖 97 Skills Gembul:

• agent-library: kelola file & arsip
• apple-healthkit: data kesehatan iPhone
• asana: kelola task Asana
• booking: booking flight/hotel/resto/tiket
• box: kelola file Box
• calendly: lihat event Calendly
• canva: desain di Canva
• connector-management: kelola konektor
• data-control: hak data & privasi
• device-data: baca kontak & kalender
• dropbox: kelola file Dropbox
• duffel: cari & booking penerbangan
• evernote: baca & buat catatan
• facebook: baca post & komen FB
• facebook-cli: akses Facebook via CLI
• figma: kerja dengan file Figma
• flightaware: info jadwal penerbangan
• forget: hapus ingatan tersimpan
• function-health: hasil lab kesehatan
• generate_podcast: bikin podcast audio
• ghl: kelola kontak & pipeline HighLevel
• github: cari repo & baca kode
• gmail: baca & kirim email
• goals: bikin & kelola goals
• google-calendar: kelola kalender Google
• google-contacts: kelola kontak Google
• google-docs: baca & edit Docs
• google-drive: kelola file Drive
• google-forms: bikin & baca Forms
• google-health-connect: data kesehatan Android
• google-sheets: baca & edit Sheets
• google-slides: bikin & edit Slides
• google-tasks: kelola task Google
• granola: baca notulen meeting
• healthex: tanya soal obat & lab
• idea-management: kelola kartu ide
• image-search: cari gambar di web
• instagram: baca profil & post IG
• instagram-messages: baca DM Instagram
• klaviyo: email/SMS marketing
• linear: kelola issue engineering
• lovable: bikin app via Lovable
• magic-moment: bikin klip video pendek
• media-library: cari foto di galeri
• messaging-channels: cek koneksi chat
• messenger: baca & cari chat Messenger
• meta-ads: kelola iklan Meta
• meta-threads: kelola akun Threads
• muse-early-access: info early access Muse
• muse-feedback: kirim feedback ke tim Muse
• muse_db: inspeksi database Muse
• notion: baca & edit halaman Notion
• opentable: booking restoran
• outlook-calendar: kelola kalender Outlook
• outlook-contacts: kelola kontak Outlook
• outlook-mail: baca & kirim email Outlook
• paired-devices: kelola perangkat terpair
• peloton: cari kelas fitness Peloton
• permission-model: cek permission pending
• personal-feed: kelola feed pribadi
• philips-hue: kontrol lampu Philips Hue
• places-search: cari tempat & lokasi
• plaid: baca akun bank & finansial
• podcast: bikin konten audio
• printify: kelola produk Printify
• quickbooks: kelola akuntansi QuickBooks
• replit: akses Replit IDE
• secure-vault: kelola kredensial aman
• self-awareness: info tentang diri AI
• share-ideas: publish kartu ide
• shopify: kelola toko Shopify
• shopping: cari & bandingkan produk
• skill-creator: bikin skill baru
• slack: baca & kirim pesan Slack
• social-content-performance: analisis performa IG
• spotify: cari musik & bikin playlist
• stripe: kelola pembayaran Stripe
• subscription-status: info langganan Muse
• tailscale: setup jaringan Tailscale
• tessie: monitor mobil Tesla
• threads: kelola akun Threads
• threads-messages: baca DM Threads
• ticketmaster: cari event & tiket
• todoist: kelola task Todoist
• travel-planning: rencanakan perjalanan
• tts: text-to-speech
• vercel: deploy via Vercel
• voice-calls: katalog suara sistem
• voice-design: desain suara baru
• voice-selector: pilih suara
• wallet: kelola pembayaran
• wearable-device-skills: skill perangkat wearable
• wearables-comms: telpon via wearable
• wide-research: riset paralel luas
• withings: baca data Withings
• zapier: koneksi antar-app via Zapier
• zoom: kelola meeting Zoom

Tanya aja mau pake yang mana! 😎"""
                    tg_api(token, "sendMessage", {"chat_id": chat_id, "text": skills_text})
                    continue

                # Get chat history (keep last 10 exchanges)
                history = histories.get(chat_id, [])

                # Send typing indicator
                try:
                    tg_api(token, "sendChatAction", {"chat_id": chat_id, "action": "typing"})
                except Exception:
                    pass

                # Get AI reply
                try:
                    reply = fcc_chat(text, history)
                except Exception as e:
                    print(f"FCC error: {e}", flush=True)
                    reply = "Maaf, AI-nya lagi error. Coba lagi nanti."

                # Update history
                history.append({"role": "user", "content": text})
                history.append({"role": "assistant", "content": reply})
                histories[chat_id] = history[-20:]  # keep last 10 exchanges

                # Send reply (split if too long)
                for i in range(0, len(reply), 4000):
                    chunk = reply[i:i+4000]
                    tg_api(token, "sendMessage", {"chat_id": chat_id, "text": chunk})
                print(f"Replied ({len(reply)} chars)", flush=True)

                # Occasionally send a relevant sticker
                if maybe_send_sticker(token, chat_id, reply):
                    print(f"Sent sticker", flush=True)

        except Exception as e:
            print(f"Poll error: {e}", flush=True)
            time.sleep(5)


if __name__ == "__main__":
    main()
