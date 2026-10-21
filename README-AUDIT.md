# Paket Audit — Website Kantor "Team Kreatif Agent AI Yazid"

Dibuat: 21 Oktober 2026 · Status live: https://kantor-kcsh.vercel.app (build `index-DWJ--NPe.js`)
Paket ini berisi SEMUA file hasil pembangunan website kantor sampai hari ini + backend yang tersambung.
**Tidak ada .env, API key, token, atau kredensial apa pun di dalam paket ini** (sudah dipindai otomatis).

## Isi paket

| Folder | Isi |
|---|---|
| `website-v3/` | Kode sumber lengkap situs live: `src/` (Three.js: scene, behavior, state, ui, integration), `api/` (fungsi serverless chat + health), `public/data/` (tasks.json 42 tugas, org.json 14 agen + 25 sub-agen, map.json 188 furnitur, delegations.json), `public/assets/` (86 berkas GLB), `scripts/`, konfigurasi Vite/Vercel. `.env.example` disertakan (template kosong, tanpa nilai). |
| `backend-telegram-bot/` | Bot @AyasiGembulBot: `super_bot.py`, `super_agent_core.py` (chat + aksi kantor), `office_ops.py` (tulis tasks.json + redeploy), `delegation.py` (orkestrasi delegasi sub-agen bertingkat), skrip start. |
| `bridge/` | `bridge.py` — jembatan lokal (port 20129): /v1/chat ke 9router, /v1/mcp ke ArtCraft. File `.token`-nya SENGAJA tidak disertakan. |
| `dokumen/` | Seluruh dokumen kerja: audit Master Brief (01–07), evolusi (00–15), laporan visual overhaul, strategi routing model (`model-routing-opus.md`), DEPLOY_MUSE.md, arsitektur, laporan final. |

Dikecualikan secara sadar: `node_modules/`, `dist/` (hasil build, bisa dibuat ulang dari sumber), `.vercel/`, `.venv/`, log, dan seluruh berkas rahasia.

## Yang tersambung (peta integrasi)

1. **Vercel** — hosting situs + fungsi serverless `/api/chat` & `/api/health`. Deploy via REST/CLI; token tersimpan di server Gembul (`~/.config`), bukan di paket ini.
2. **Google Gemini API** — backend chat situs saat ini (rantai: gemini-3.5-flash → 3.1-flash-lite → 3.8-flash → 3.1-pro-preview). Key di env Vercel. Kuota free per model.
3. **Telegram Bot ↔ situs** — bot adalah penulis tunggal `tasks.json`/`delegations.json`; setiap ACC/tugas/delegasi dari Telegram memicu redeploy otomatis agar situs menampilkan data terbaru.
4. **9router (lokal di server)** — gateway model bot & delegasi: Claude Pro (OAuth) + Google AI Studio (API key). Routing delegasi: rencana+sintesis = Sonnet, eksekusi = Gemini Flash (fallback Haiku), Opus hanya untuk arsitektur/keamanan/gate rilis.
5. **ArtCraft MCP (lokal)** — 13 aplikasi edit (photocraft, vectorcraft, filmcraft, designcraft, soundcraft, pdfcraft, lightcraft, dll), total 794 tools terverifikasi aktif 21 Okt 2026. Terjangkau dari server/bot; dari situs menunggu tunnel.
6. **kantor-bridge (lokal)** — siap menghubungkan situs ↔ 9router + ArtCraft, TAPI belum terekspos publik (tunnel belum aktif), jadi situs memakai jalur Gemini langsung.
7. **GitHub** — repo cadangan `AHMADYAZIDALFARISI/Kantor-AI-Backup` (snapshot era v2; sumber v3 belum didorong ke sana).
8. **Katalog skill di situs** — 729 skill statis (dokumen katalog induk ada di dokumen evolusi).

## Catatan audit — yang masih kurang (per 21 Okt 2026)

1. **Tunnel/bridge belum live** → chat situs bergantung kuota gratis Gemini; saat semua ember model habis, muncul "Batas pemakaian tercapai". Solusi permanen: billing Google / key kedua / tunnel aktif.
2. **FPS perangkat nyata belum diuji** — overhaul visual terverifikasi headless (draw calls ~200, 0 error); performa GPU HP kelas bawah belum terukur.
3. **Data tugas masih contoh** — 42 tugas di tasks.json bertanda `kind:"sample"`; data operasional asli tumbuh hanya lewat bot. Penyimpanan masih berkas JSON satu-penulis; migrasi database (Postgres) terdokumentasi dengan pemicunya, belum dieksekusi.
4. **Aktivitas karakter 3D = simulasi berlabel** — gerak/jadwal agen di situs adalah simulasi deterministik; runtime nyata ada di bot Telegram (delegasi), bukan di situs.
5. **Delegasi masih teks-saja (D1)** — sub-agen belum benar-benar memanggil tools ArtCraft/file dalam run delegasi; integrasi itu tahap berikutnya.
6. **Belum ada suite tes otomatis permanen** di repo — validasi dilakukan via skrip uji ad-hoc setiap rilis.
7. **Cadangan GitHub tertinggal** — repo backup masih snapshot v2.
