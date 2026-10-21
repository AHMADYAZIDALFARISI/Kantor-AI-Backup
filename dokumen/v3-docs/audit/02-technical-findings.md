# 02 — Temuan Teknis

Legenda status: Verified (terbukti berfungsi) · Partial (sebagian) · Simulated (UI/simulasi) · Missing (belum ada) · Unverified (tidak dapat diverifikasi).

## F-01 · Progres & status tugas dari tasks.json diabaikan situs — HIGH — **FIXED**
- **Area:** State management / sinkronisasi data
- **Status:** Fixed (sebelumnya Partial → data hilang diam-diam)
- **Bukti:** `office3d/src/state/store.js` `loadPlans()` memetakan hanya `{title, eta, done:false}` — field `progress` (mis. 55%) dan `done` dari `public/data/tasks.json` dibuang. `grep "progress" office3d/src/` hanya menemukan boot progress bar; `office3d/src/ui/shell.js` (drawer rencana) hanya merender judul + eta + checkbox.
- **Dampak:** Bot Telegram (AKSI approve/progress) memperbarui tasks.json + redeploy, tetapi situs tidak pernah menampilkan perubahan tersebut — alur kerja utama pemilik rusak diam-diam.
- **Risiko:** Keputusan operasional berdasarkan tampilan situs yang kedaluwarsa.
- **Perbaikan:** `loadPlans()` memakai `progress` (clamp 0–100) dan `done` (dari JSON atau progress ≥ 100); centang localStorage hanya berlaku bila JSON belum selesai; UI drawer menampilkan "Progres: N%" + bar. `docs/audit/07-change-log.md`.
- **Kriteria penerimaan:** ✅ build PASS; ✅ uji headless: `plans.qa_head[0].progress === 55`, `[2].progress === 80`, 14 agen, canvas render, 0 error.

## F-02 · Rate limiter dapat di-flush total oleh penyerang — MEDIUM — **FIXED**
- **Area:** API / keamanan
- **Status:** Fixed
- **Bukti:** `office3d/api/_lib.js` `rateOk()`: `if (hits.size > 5000) hits.clear();` — membanjiri dengan >5000 IP berbeda menghapus semua limit yang sedang berjalan.
- **Dampak:** Bypass rate limit chat (20/jam/IP) dengan usaha sedang.
- **Perbaikan:** pruning hanya entri kedaluwarsa per window; validasi logika: 2 request lolos, ke-3 ditolak pada limit 2.
- **Kriteria penerimaan:** ✅ probe Node: `rateOk('1.1.1.1',2)` → true, true, false.

## F-03 · agent_id tak dikenal di jalur Gemini diam-diam memakai persona staff_a — LOW — **FIXED**
- **Area:** API / validasi input
- **Status:** Fixed
- **Bukti:** `office3d/api/chat.js` `viaGemini()` memakai `PERSONAS[agent_id] || PERSONAS.staff_a`; bridge (`kantor-bridge/bridge.py`) punya generic fallback by-design, tetapi jalur serverless kini mengembalikan `400 unknown_agent` bila bridge tidak dikonfigurasi.
- **Dampak:** Chat bisa dijawab dengan persona yang salah tanpa sinyal error.
- **Kriteria penerimaan:** ✅ `node --check` 4 file api lolos.

## F-04 · Teks detail 'not_configured' kedaluwarsa — LOW — **FIXED**
- **Area:** UX/kejujuran status
- **Status:** Fixed
- **Bukti:** `office3d/src/integration/bridge.js` menampilkan "BRIDGE_URL / BRIDGE_TOKEN belum diisi di server" padahal jalur Gemini juga ada.
- **Perbaikan:** teks menjadi "Backend AI belum dikonfigurasi di server".

## F-05 · Aktivitas karakter 3D adalah simulasi terjadwal, bukan event runtime — MEDIUM — OPEN (by design)
- **Area:** 3D / agent runtime
- **Status:** Simulated (dengan overlay Partial untuk event chat nyata)
- **Bukti:** `office3d/src/behavior/agents.js` `phase(simMinutes)` + RNG deterministik per agen memilih POI; `store.js` memberi label `source: 'ambient'` vs `'backend'`; UI legend + README menyatakan "rutinitas simulasi". Event chat nyata (`bridge.js` emit `chat_start/chat_reply/chat_error`) hanya menghidupkan titik avatar.
- **Dampak:** Visual "bekerja" tidak mencerminkan pekerjaan nyata — sesuai aturan brief §3 harus dinyatakan.
- **Rekomendasi:** mesin event runtime (task lifecycle) yang memancarkan status agen nyata; kriteria: karakter 'working' hanya bila ada task berstatus running (roadmap Tahap 2).

## F-06 · Tidak ada task lifecycle engine — MEDIUM — OPEN
- **Area:** Workflow automation
- **Status:** Missing
- **Bukti:** tidak ada state queued/planning/assigned/running/waiting_approval/blocked/retrying di repo; site hanya `{title, eta, progress, done}`; "orchestrator" yang ada hanyalah bot Telegram + AKSI JSON (`office_ops.py`: list/approve/add/set_progress) tanpa validasi transisi status.
- **Rekomendasi:** task engine minimal dengan transisi valid + persistensi (roadmap Tahap 2).

## F-07 · Tunnel VM→publik mustahil — HIGH — OPEN (kendala infrastruktur)
- **Area:** Arsitektur / DevOps
- **Status:** Verified kendala
- **Bukti:** VM hanya egress via proxy; ngrok free menolak proxy (fitur berbayar), cloudflared tidak mendukung proxy, localtunnel macet — diuji 2026-10-20.
- **Dampak:** `kantor-bridge` (chat + 614 tool MCP ArtCraft) tidak terjangkau publik; chat publik = Gemini direct (kuota 429 hari ini); skill browser tidak dapat mengeksekusi tool.
- **Rekomendasi:** opsi (a) hosting bridge di serverless, (b) pertahankan Gemini sebagai jalur publik + bridge untuk Telegram/internal (status quo), (c) VPS — ditolak pemilik (roadmap L).

## F-08 · Kuota Gemini key baru dibatasi Google (429) — MEDIUM — OPEN (eksternal)
- **Area:** Provider LLM
- **Status:** Unverified-penuh (infrastruktur benar, kuota eksternal)
- **Bukti:** `POST /api/chat` → `429 gemini_http_429`; `/api/health` → `{"ok":true,"backend":"gemini"}`; uji langsung model 3.8-flash timeout, 3.1-pro-preview 429.
- **Dampak:** chat situs mati sampai Google melonggarkan; tidak ada yang perlu diubah di kode — pulih otomatis.

## F-09 · Katalog 729 skill read-only — MEDIUM — OPEN
- **Area:** Integrasi tool
- **Status:** Partial
- **Bukti:** `public/data/skills.json` + `src/ui/skillsBrowser.js` hanya membaca; klasifikasi ruang berbasis aturan dengan label jujur "estimasi aturan"; eksekusi hanya via bridge MCP (lokal).
- **Rekomendasi:** eksekusi skill bertahap setelah tunnel/serverless bridge (roadmap L).

## F-10 · .env.example kini tersedia — LOW — **FIXED**
- **Bukti:** `office3d/.env.example` berisi 7 nama variabel + komentar, tanpa nilai. `.env*` ter-gitignore; file OIDC CLI lokal tidak ikut repo.

## F-11 · Double-polling bot Telegram — INFO — **FIXED**
- **Area:** Operasional
- **Bukti:** dua proses `super_bot.py` berjalan bersamaan (race restart); proses lama dimatikan, tersisa satu. Di luar repo v3 tetapi dicatat karena memengaruhi runtime kantor.

## F-12 · Bridge menerima field `model` dari klien tanpa allowlist — LOW — OPEN
- **Area:** API/keamanan
- **Bukti:** `kantor-bridge/bridge.py` do_POST `/v1/chat`: `model = str(b.get("model",""))[:60]`. Jalur serverless mengabaikan model klien (server memilih). Bridge butuh bearer token sehingga paparan terbatas.
- **Rekomendasi:** allowlist model di bridge.

## F-13 · Rate limit per-instance (best effort) — LOW — OPEN (by design)
- **Area:** API
- **Bukti:** komentar di `api/_lib.js` + `docs/DEPLOY_MUSE.md`; `x-forwarded-for` dipercaya (di Vercel diisi edge — aman).
- **Dampak:** limit longgar pada skala; cukup untuk situs showcase.

## F-14 · Katalog UI: nama "KC" → "TK" — INFO — Verified
- Rebrand ke Team Kreatif Agent AI Yazid live (title, brand, boot screen, package name). URL tetap kantor-kcsh.vercel.app — keputusan pemilik.

## F-15 · Tidak ada lint/typecheck/unit test — INFO — OPEN
- **Bukti:** `package.json` scripts hanya dev/build/preview/assets/test:e2e. `tools/e2e.py` butuh `playwright` Python yang tidak terpasang di env ini → BLOCKED (`ModuleNotFoundError`). Kebutuhan minimum: `pip install playwright` + `playwright install chromium`.
- **Yang jalan sebagai pengganti:** uji render headless via Node playwright-core (lihat 05-test-report).
