# Kantor KCSH — Gembul AI Operations Center

Backup source code + dokumentasi. Live: https://kantor-kcsh.vercel.app

## Isi

- **office3d/** — Kantor 3D ala game Startup Company (three.js r160 via CDN).
  13 ruangan, 15 builder furniture parametrik, 14 karakter dengan simulasi
  (jalan/kerja/istirahat), dashboard progres divisi, panel karakter & furniture,
  browser 729 skill/agen, chat AI per staf. Lihat `office3d/README.md`.
  Catatan: 14 sprite sheet PNG avatar (`assets/characters/sheets/`) tidak ikut
  di-push (konektor hanya mendukung file teks) — salin dari paket aset asli
  `ai-office-pixel-assets.zip`.
- **kantor-bridge/** — Backend AI (`bridge.py`, stdlib only): `POST /v1/chat`
  → 9router (persona per staf), `POST /v1/mcp/tools|call` → 614 MCP tools
  ArtCraft. Dijalankan di 127.0.0.1:20129, dipublikasikan via Cloudflare Tunnel.
  `data/bridge.json` di office3d diisi saat deploy (url + token).
- **skills/CATALOG.md** — Katalog panen 8 repo GitHub: 466 SKILL.md + 304
  definisi agen (agency-agents). Versi JSON siap web: `office3d/data/skills.json`.

## Deploy

Via Vercel REST API ke project `kantor-kcsh` (team ayasi). Token Vercel
tersimpan di `~/.config/kantor-kcsh/vercel-token` (600). Lihat
`office3d/README.md` bagian Deploy.
