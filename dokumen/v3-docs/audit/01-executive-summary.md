# 01 — Ringkasan Eksekutif

**Tanggal audit:** 2026-10-20 · **Target:** repo Kantor v3 (`~/workspace/kantor-kcsh/v3/`), live di https://kantor-kcsh.vercel.app
**Catatan nama:** di dalam berkas brief tertulis "Kantor AI KCSH"; nama resmi yang benar adalah **Team Kreatif Agent AI Yazid** (sesuai instruksi pemilik) — dokumen ini memakai nama resmi.

## Kondisi aktual (berdasarkan bukti)

Aplikasi ini adalah **kantor 3D interaktif (Vite + three r160) dengan backend serverless minimal**, bukan AI Operations Workspace penuh. Arsitektur nyata:

- **Frontend:** SPA statis; kantor 3D (13 ruangan, 14 karakter rig, ~72 model furnitur GLB), drawer agen/ruangan, dashboard divisi, browser 729 skill, pencarian, deep-link. Jam atas = waktu real-time WIB; nama resmi tampil di title/brand/boot screen.
- **Backend:** dua Vercel Function — `api/health.js` dan `api/chat.js`. Jalur chat: (1) proxy ke kantor-bridge di VM bila `BRIDGE_URL/BRIDGE_TOKEN` diisi; (2) cadangan: Gemini langsung dengan 14 persona agen. Tidak ada database, tidak ada queue, tidak ada task engine server-side.
- **Runtime AI yang nyata:** ada di luar situs — `kantor-bridge` (VM, bearer token) → 9router → Claude/Gemini; bot Telegram + protokol AKSI mengubah `public/data/tasks.json` lalu redeploy otomatis. Situs membaca `tasks.json` sebagai data statis.
- **"Agen" di 3D:** aktivitas karakter adalah **simulasi terjadwal deterministik** (label SIMULASI di UI + README). Kejadian chat nyata memberi overlay (titik avatar menyala, karakter berjalan ke meja).

## Kekuatan (terverifikasi)

1. Render 3D stabil: build produksi PASS, 0 error konsol aplikasi, adaptive quality (turun tier bila FPS < 32).
2. Kejujuran status: setiap status agen membawa `source`: 'backend' vs 'ambient'; tidak ada klaim AI palsu di UI.
3. Keamanan dasar API rapi: secret hanya di env server, tidak ada bocor di bundle, rate limit, validasi input.
4. Fondasi Tahap 1 sudah diperbaiki dan tervalidasi (lihat `07-change-log.md`).

## Kelemahan utama

1. **Tidak ada task lifecycle engine** — status tugas (queued/running/blocked/…) tidak ada; progres tugas di situs sempat diabaikan total (F-01, diperbaiki).
2. **Tunnel VM→publik mustahil** (tembok proxy) → bridge tidak bisa dijangkau publik; chat publik bergantung pada kuota Gemini yang saat ini 429.
3. **Tidak ada observability**: tanpa trace eksekusi, error center, usage/cost, audit log, approval inbox.
4. **Katalog skill 729 hanya read-only** — tidak bisa dieksekusi dari situs.

## Risiko tertinggi

| # | Risiko | Level |
|---|--------|-------|
| R1 | Chat publik mati penuh bila kuota Gemini habis (terjadi hari ini, 429) | High |
| R2 | Bot Telegram mengeksekusi mutasi + redeploy tanpa approval gate (satu user berizin — risiko terkendali tapi nyata) | Medium |
| R3 | Edit tugas di drawer situs (localStorage) menyimpang dari tasks.json global (bot) — diperbaiki sebagian | Medium |
| R4 | Dependensi pada kuota Claude Pro (bot) — habis 100% hari ini, reset 15:10 WIB | Medium |

## Rekomendasi prioritas

1. **Rute chat tahan gagal:** fallback berurutan bridge → Gemini → pesan status jujur (sudah ada); tambah monitor kuota berkala.
2. **Task engine minimal:** status tugas eksplisit + endpoint tulis ber-otorisasi agar drawer situs dan bot sinkron (roadmap Tahap 2).
3. **Observability dasar:** riwayat tugas + error center sebelum menambah fitur AI baru (roadmap Tahap 3).
4. Keputusan pemilik: ganti URL ke nama baru atau tidak; jadwal reminder video mentah; cron riset konten.
