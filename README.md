# Kantor-AI-Backup

Cadangan sumber proyek kantor AI "Team Kreatif Agent AI Yazid".

## Snapshot v3 (21 Oktober 2026 — terkini)

- `website-v3/` — sumber situs kantor 3D (Vite + three.js), termasuk perbaikan Sprint 1 audit.
- `backend-telegram-bot/` — bot Telegram @AyasiGembulBot (inti, operasi kantor, delegasi bertingkat).
- `bridge/` — kantor-bridge lokal (chat persona + MCP ArtCraft).
- `dokumen/` — dokumen audit, evolusi, dan visual v3.
- `asset-gen/` — pipa pembuat aset 3D lokal (TripoSR: gambar → GLB).
- `konektor-huggingface/` — helper konektor Hugging Face (InstantMesh via Space).
- `README-AUDIT.md` — manifest paket audit + peta integrasi + celah yang diketahui.

Catatan: snapshot hanya berisi berkas teks. Aset biner (GLB/PNG), `node_modules`, dan
rahasia (`.env`, token, kunci API) sengaja TIDAK disertakan.

## Snapshot v2 (20 Oktober 2026 — lama, dipertahankan sebagai riwayat)

- `office3d/` dan `kantor-bridge/` — struktur era v2 sebelum migrasi ke `website-v3/`.
