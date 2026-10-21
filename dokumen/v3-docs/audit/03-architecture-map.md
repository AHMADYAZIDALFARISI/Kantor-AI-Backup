# 03 — Peta Arsitektur Aktual

```
┌──────────────┐  HTTPS   ┌───────────────────────────────┐
│  Pengunjung  │ ───────► │  Vercel (kantor-kcsh)          │
│  (browser)   │          │  ┌─────────────────────────┐  │
└──────────────┘          │  │ SPA statis (Vite)        │  │
                          │  │ 3D three.js, drawer UI,    │  │
                          │  │ data/*.json + *.glb       │  │
                          │  └────────────┬────────────┘  │
                          │               │ /api/*        │
                          │  ┌────────────▼────────────┐  │
                          │  │ api/health.js           │  │
                          │  │ api/chat.js             │  │
                          │  │  ├─ bridge-first        │──┼──┐ (bila env diisi)
                          │  │  └─ fallback Gemini     │──┼──┐ ke Google
                          │  └─────────────────────────┘  │  │
                          └───────────────────────────────┘  │  │
                                                             │  │
┌──────────────────────────────┐                             │  │
│  VM (ephemeral, proxy-only)  │                             │  │
│  ┌────────────────────────┐  │                             │  │
│  │ kantor-bridge :20129   │◄─┘  TUNNEL: MUSTAHIL            │  │
│  │  /v1/chat (bearer)     │     (ngrok/cloudflared/         │  │
│  │  /v1/mcp/*  (ArtCraft  │      localtunnel gagal)        │  │
│  │  614 tools)            │                                │  │
│  └───────────┬────────────┘                                │  │
│              │ 9router :20128                               │  │
│              │  ├─ Claude Pro (OAuth)                       │  │
│              │  └─ Gemini AI Studio (API key)               │  │
│  ┌───────────▼────────────┐                                │  │
│  │ Telegram bot           │                                │  │
│  │ @AyasiGembulBot        │                                │  │
│  │  AKSI JSON →           │── office_ops.py ──► tasks.json │
│  │  tasks.json + redeploy │     (public/data)    (Vercel   │
│  └────────────────────────┘     via CLI          CLI)      │
│  ┌────────────────────────┐                                │
│  │ watchdog 5 mnt         │ supervisor: 9router/FCC/bot/  │
│  │ (supervise-agents.sh)  │ bridge                         │
│  └────────────────────────┘                                │
└──────────────────────────────┘
```

## Alur data tugas

```
tasks.json (repo, sumber global)
   │  dibaca saat build → dibundel ke dist/data/tasks.json (statis)
   ├─► bot Telegram: baca/tulis LANGSUNG file repo → redeploy (global, semua pengunjung)
   └─► pengunjung situs: baca snapshot statis + centang localStorage 'gembul-tasks' (perangkat sendiri)
```

**Catatan jujur:** tidak ada database; "live sync" tugas = redeploy situs. Edit di drawer situs tidak kembali ke repo.

## Alur chat

```
UI drawer (bridge.js) ──POST /api/chat {agent_id, messages}──► Vercel Function
   ├─ BRIDGE_URL+TOKEN ada → kantor-bridge /v1/chat (bearer) → 9router → Claude/Gemini (persona bridge)
   └─ tidak ada → Gemini direct (GEMINI_API_KEY env) → 14 persona (api/_personas.js)
UI: chat_start/chat_reply/chat_error → titik avatar menyala (event nyata saja)
Health: GET /api/health tiap 30 dtk → chip "AI terhubung/belum dikonfigurasi/offline"
```

## Batas komponen

| Komponen | Terverifikasi | Catatan |
|----------|---------------|---------|
| SPA 3D + UI | ✅ | build PASS, render 0 error |
| Vercel Functions | ✅ | health ok; chat 429 (kuota Google, eksternal) |
| kantor-bridge | ✅ | sehat lokal :20129; tidak terjangkau publik |
| 9router + provider | ⚠️ | Claude Pro kuota 100% (reset 15:10 WIB); Gemini key dibatasi |
| Telegram bot | ✅ | 1 instance; AKSI → tasks.json + redeploy v3 |
| Task engine | ❌ | tidak ada (F-06) |
| Observability | ❌ | tidak ada (F-05/F-06) |
| Skill execution (situs) | ❌ | read-only (F-09) |
