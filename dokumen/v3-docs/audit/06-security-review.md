# 06 — Tinjauan Keamanan

## Ringkasan

Postur: **wajar untuk situs showcase publik dengan chat AI**; tidak ditemukan kebocoran secret. Temuan terbesar (F-02) sudah diperbaiki. Tidak ada autentikasi pengguna by design — permukaan sensitif dijaga via rate limit + validasi.

## Temuan

### S-01 · Rate limiter bisa di-flush — MEDIUM — FIXED
`api/_lib.js`: `hits.clear()` pada 5000 IP memungkinkan reset semua limit. → pruning kedaluwarsa saja (lihat 02/F-02).

### S-02 · Endpoint /api/chat publik tanpa auth — INFO (by design)
Mitigasi berlapis: rate limit 20/jam/IP (best effort per instance), regex `agent_id`, cap 64 KB JSON, pesan ≤2000 char, 12 pesan terakhir, model dipilih server (jalur serverless mengabaikan field `model` klien). Penyalahgunaan maksimal = membakar kuota Gemini pemilik.

### S-03 · Bridge menerima `model` dari klien — LOW — OPEN
`kantor-bridge/bridge.py`: `model = str(b.get("model",""))[:60]` tanpa allowlist. Paparan terbatas: bearer token wajib. Rekomendasi: allowlist (roadmap 2.6). Error 502 membocorkan teks exception ≤200 char — batasi ke kode error saja.

### S-04 · Secret management — PASS (verified)
- Token/key hanya di env server Vercel & file 600 di VM (`~/.config/kantor-kcsh/`, `kantor-bridge/.token`); tidak pernah di repo/kode/chat.
- Bundle publik bersih: grep pola key di `dist/` → nihil (05/T12).
- `.env*` ter-gitignore; `.env.local` hanya berisi token OIDC CLI lokal.
- Kunci API 9router di sqlite 0600, dibaca server-side saja.

### S-05 · Bot Telegram: gate otorisasi ada — PASS
`super_agent_core.py`: `allowed_user_ids` + peran UNAUTHORIZED ditolak. Namun: tidak ada approval gate untuk AKSI berisiko (mutasi tasks.json + redeploy langsung jalan) — untuk satu pemilik berizin risikonya diterima; direkomendasikan approval inbox (roadmap 2.4).

### S-06 · Prompt injection — INFO
Persona server + konten pengguna digabung tanpa sanitasi khusus (praktik standar). Mitigasi: cap panjang pesan; tidak ada eksekusi tool dari jalur chat situs. Jalur MCP (ArtCraft) hanya via bridge bertoken dengan allowlist app.

### S-07 · SSRF / path traversal — tidak ditemukan
URL upstream: `BRIDGE_URL` dari env (di-strip trailing slash), endpoint Gemini hardcoded. Tidak ada baca file dari input pengguna.

### S-08 · Dependensi
`npm ci` dari lockfile; three 0.180.0, vite 6.3.5. Tidak ada audit kerentanan otomatis di repo (disarankan: `npm audit` berkala — tidak dijalankan di sini agar tidak mengubah lockfile tanpa persetujuan).

## Risiko residual

1. Kuota LLM habis = chat mati total (R1) — mitigasi: status jujur + monitor kuota (roadmap 3.4).
2. Tanpa auth, endpoint chat terekspos ke publik — diterima untuk showcase; bila disalahgunakan, turunkan `CHAT_LIMIT_PER_HOUR` atau tambah CAPTCHA/allowlist origin ketat.
3. VM ephemeral — token file & sqlite harus survive restart (watchdog + file persisten di home; terverifikasi pulih).
