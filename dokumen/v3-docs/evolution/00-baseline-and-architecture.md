# 00 — Baseline & Arsitektur (diverifikasi 2026-10-20)

Nama resmi: **Team Kreatif Agent AI Yazid** (brief menyebut "Kantor AI KCSH"; nama resmi mengikuti instruksi pemilik).
Live: https://kantor-kcsh.vercel.app — status pada verifikasi ini: HTTP 200, `/api/health` → `{"ok":true,"backend":"gemini"}`.

## Stack terbukti

- Frontend: Vite 6.3.5 + three 0.180.0, SPA statis di Vercel (`office3d/`).
- Backend: 2 Vercel Functions (`api/chat.js`, `api/health.js`); jalur chat bridge-first → fallback Gemini direct (14 persona, `api/_personas.js`).
- Data: JSON statis di `public/data/` (staff, tasks, divisions, map, skills, org).
- Runtime di luar situs: kantor-bridge (VM :20129) → 9router; bot Telegram + AKSI → `tasks.json` → redeploy CLI. Watchdog 5 menit.

## Inventaris terbukti

| Elemen | Jumlah | Status |
|---|---|---|
| Ruangan (= divisi) | 13 | Verified |
| Lead agent (staff.json) | 14 (10 kepala divisi + 4 staf umum) | Verified |
| Sub-agent | 25 (org.json, baru) | Konfigurasi — belum terhubung runtime |
| Task (tasks.json) | 42 (3 per agen) | Data contoh paket + edit bot |
| Skill katalog | 729 | Read-only |
| Furnitur GLB | 72 | Verified memuat |

## Status fitur

| Fitur | Status |
|---|---|
| Render 3D + kamera + picking | Verified |
| Chat AI (Gemini direct) | Partial — infrastruktur ok, kuota Google 429 |
| Aktivitas karakter | Simulated (berlabel) |
| Progres tugas di UI | Verified (fix F-01, docs/audit) |
| Papan kerja kanban (panel) | Verified (baru, sprint ini) |
| Statistik tugas di papan 3D ruangan | Verified (baru, sprint ini) |
| Task engine / lifecycle | Missing |
| Database persisten | Missing (JSON statis — lihat 05) |
| Observability (trace/cost/error center) | Missing |
| Eksekusi skill dari situs | Missing |

## Catatan kualitas data (penting)

`tasks.json` bawaan berisi 42 tugas contoh dengan progres seragam 15–90% — tidak ada yang 0% atau selesai. UI menampilkannya apa adanya (Papan Kerja: 42 "Berlangsung"). Nilai-nilai ini berasal dari paket contoh; bot Telegram dapat mengubahnya (alur ACC nyata). Jangan menafsirkan progres contoh sebagai pekerjaan yang sedang benar-benar berjalan.
