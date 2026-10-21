#!/usr/bin/env python3
"""
Gembul Telegram Bot - Standalone version for VPS deployment.
Calls NVIDIA NIM API directly (no FCC needed).
"""
import json
import os
import sys
import time
import random
import urllib.request
import urllib.parse

NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"
NVIDIA_MODEL = "nvidia/nemotron-3-super-120b-a12b"
POLL_TIMEOUT = 30

SYSTEM_PROMPT = """Kamu adalah Gembul, bot AI yang ngobrol kayak anak Gen Z Indonesia asli.

GAYA BICARA:
- Bahasa Indonesia santai, kayak chat sama temen
- Pake slang Gen Z secukupnya: wkwk, anjir, gila, sumpah, bjir, lah, dong, sih, banget
- Jangan kaku/formal, jangan kayak robot customer service
- Boleh pake emoji tapi jangan berlebihan (1-3 per pesan)
- Respon singkat-padat, jangan ceramah panjang kecuali diminta
- Kadang becanda, playful, tapi tetap helpful

Jangan pernah bilang kamu AI model atau sebutin hal teknis. Kamu Gembul, temen ngobrol."""

# Sticker file_ids (from Telegram 'Animals' pack)
STICKER_IDS = [
    "CAACAgIAAxUAAWrO480_LZwisK5AvMxNwhm2IPGnAALeAAP0exkAAb2F7273xc49PQQ",
    "CAACAgIAAxUAAWrO481gBcaS2Z6g7T304IARC8FtAAIEAQAC9HsZAAb2F7273xc49PQQ",
    "CAACAgIAAxUAAWrO483p6nBbTQarwm_-9Fp0ie5nAALeAAP0exkAAb2F7273xc49PQQ",
]


SKILLS_TEXT = """🤖 97 Skills Gembul:

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


def tg_api(token, method, params=None):
    url = f"https://api.telegram.org/bot{token}/{method}"
    data = urllib.parse.urlencode(params or {}).encode() if params else None
    req = urllib.request.Request(url, data=data, method="POST" if data else "GET")
    with urllib.request.urlopen(req, timeout=40) as r:
        return json.load(r)


def nvidia_chat(api_key, message, history):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(history)
    messages.append({"role": "user", "content": message})
    payload = json.dumps({
        "model": NVIDIA_MODEL,
        "messages": messages,
        "max_tokens": 1000,
        "temperature": 0.7,
    }).encode()
    req = urllib.request.Request(
        NVIDIA_API_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        result = json.load(r)
    return result["choices"][0]["message"]["content"].strip()


def main():
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    api_key = os.getenv("NVIDIA_NIM_API_KEY", "")
    allowed = {u.strip() for u in os.getenv("TELEGRAM_ALLOWED_USERS", "").split(",") if u.strip()}

    if not token or not api_key or not allowed:
        print("ERROR: Set TELEGRAM_BOT_TOKEN, NVIDIA_NIM_API_KEY, TELEGRAM_ALLOWED_USERS", file=sys.stderr)
        sys.exit(1)

    print(f"Bot starting. Allowed: {allowed}", flush=True)
    me = tg_api(token, "getMe")
    print(f"Bot: @{me['result']['username']}", flush=True)

    offset = 0
    histories = {}

    while True:
        try:
            updates = tg_api(token, "getUpdates", {"offset": offset, "timeout": POLL_TIMEOUT})
            for u in updates.get("result", []):
                offset = u["update_id"] + 1
                msg = u.get("message", {})
                user_id = str(msg.get("from", {}).get("id", ""))
                chat_id = msg.get("chat", {}).get("id")
                text = msg.get("text", "")
                if not text or not chat_id:
                    continue
                if user_id not in allowed and "*" not in allowed:
                    continue

                print(f"Msg from {user_id}: {text[:50]}", flush=True)

                if text == "/start":
                    tg_api(token, "sendMessage", {"chat_id": chat_id,
                        "text": "Halo! Aku Gembul 😎\n\nKirim pesan apa aja, atau coba:\n/skills - lihat 97 kemampuanku\n/help - bantuan"})
                    continue

                if text == "/help":
                    tg_api(token, "sendMessage", {"chat_id": chat_id,
                        "text": "Cara pakai aku:\n\n💬 Chat biasa - tanya apa aja\n/skills - lihat semua kemampuanku\n/help - pesan ini\n\nAku bisa bantu cari info, bikin konten, ngide, sampe ngobrol santai. Gas!"})
                    continue

                if text == "/skills":
                    tg_api(token, "sendMessage", {"chat_id": chat_id, "text": SKILLS_TEXT})
                    continue

                history = histories.get(chat_id, [])
                try:
                    tg_api(token, "sendChatAction", {"chat_id": chat_id, "action": "typing"})
                except Exception:
                    pass

                try:
                    reply = nvidia_chat(api_key, text, history)
                except Exception as e:
                    print(f"NVIDIA error: {e}", flush=True)
                    reply = "Maaf, AI-nya lagi error. Coba lagi nanti."

                history.append({"role": "user", "content": text})
                history.append({"role": "assistant", "content": reply})
                histories[chat_id] = history[-20:]

                for i in range(0, len(reply), 4000):
                    tg_api(token, "sendMessage", {"chat_id": chat_id, "text": reply[i:i+4000]})

                # Random sticker (25%)
                if random.random() < 0.25 and STICKER_IDS:
                    try:
                        tg_api(token, "sendSticker", {"chat_id": chat_id, "sticker": random.choice(STICKER_IDS)})
                    except Exception:
                        pass

                print(f"Replied ({len(reply)} chars)", flush=True)

        except Exception as e:
            print(f"Poll error: {e}", flush=True)
            time.sleep(5)


if __name__ == "__main__":
    main()
