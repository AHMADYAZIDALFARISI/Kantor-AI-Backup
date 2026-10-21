# 07 — Change Log

Semua perubahan 2026-10-20 (WIB). Status deploy dicatat jujur per entri.

## Sudah LIVE (deploy sebelum audit ini)

| File | Perubahan | Validasi |
|------|-----------|----------|
| `office3d/index.html` | Nama → Team Kreatif Agent AI Yazid (title, meta, boot) | curl live: title baru ✓ |
| `office3d/src/ui/shell.js` | Brand baru; chip jam = real-time WIB (`Intl` Asia/Jakarta) | render headless: label WIB, jam bergerak ✓ |
| `office3d/package.json` | name → team-kreatif-agent-ai-yazid | build PASS |
| `office3d/src/scene/finish.js` (baru) | Tekstur prosedural (wood/fabric/metal) + shader rim-light fresnel karakter | render 0 error |
| `office3d/src/scene/{furniture,characters}.js` | Integrasi finish.js | build PASS |
| `office3d/api/chat.js` | DITULIS ULANG: bridge-first + fallback Gemini + persona | health live ok |
| `office3d/api/_personas.js` (baru) | 14 persona dari staff.json | — |
| `office3d/api/health.js` | Backend detection (bridge/gemini/not_configured) | live: `{"ok":true,"backend":"gemini"}` |
| env Vercel | `GEMINI_API_KEY` (rahasia), `ALLOWED_ORIGIN` | tidak dicatat nilainya |
| `~/workspace/telegram-bot/office_ops.py` | Dialihkan ke data v3 + redeploy via Vercel CLI | import lolos; staff v3 terbaca |
| `~/workspace/telegram-bot/super_agent_core.py` | Contoh AKSI diganti nama agen v3 (Yazid/Nadia) | bot restart, 1 instance |

## Perubahan audit — LIVE (deploy disetujui pemilik 2026-10-20 12:05 WIB, terverifikasi: build `index-0WSYDq6p.js`, health ok)

| File | Perubahan | Validasi |
|------|-----------|----------|
| `office3d/src/state/store.js` | F-01: loadPlans memakai progress+done dari tasks.json | headless: progress 55/80 terbaca ✓ |
| `office3d/src/ui/shell.js` | F-01: drawer menampilkan "Progres: N%" + bar | render ✓ |
| `office3d/src/ui/styles.css` | `.plans .pbar` | — |
| `office3d/api/_lib.js` | F-02: rate limiter prune kedaluwarsa (anti-flush) | probe: true,true,false ✓ |
| `office3d/api/chat.js` | F-03: 400 unknown_agent di jalur Gemini | node --check ✓ |
| `office3d/src/integration/bridge.js` | F-04: teks not_configured generik | build ✓ |
| `office3d/.env.example` (baru) | F-10: dokumentasi variabel env tanpa nilai | — |
| `docs/audit/01..07` (baru) | Artefak audit Master Brief | — |

## Belum selesai (sengaja)

- e2e bawaan repo — BLOCKED, butuh instalasi playwright Python.
- Chat generate — 429 kuota Google (eksternal; pulih otomatis).
- Tunnel bridge — mustahil dari VM ini (F-07).
- Rotasi token bridge — ditunda; tidak pernah bocor ke publik.
