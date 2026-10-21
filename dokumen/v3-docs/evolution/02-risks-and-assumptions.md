# 02 — Risiko & Asumsi

## Risiko terbesar (per brief §18.3)

| # | Risiko | Penjelasan | Mitigasi terpilih |
|---|--------|-----------|-------------------|
| R1 | **Persistence rapuh untuk multi-agent** | tasks.json statis: multi-writer mustahil; "history" tugas tidak ada; audit trail nihil | Tetap single-writer via bot untuk sekarang; rencana migrasi DB bertahap (dok 05/06) — JANGAN dual-write tanpa strategi konsistensi |
| R2 | **Kuota provider tunggal** | Chat publik bergantung 1 key Gemini (429 hari ini); bot bergantung kuota Claude Pro (100% hari ini) | Fallback berlapis sudah ada; monitor kuota = roadmap |
| R3 | **Tunnel mustahil dari VM** | Proxy-only egress memblokir ngrok/cloudflared/localtunnel | Bridge tetap internal (Telegram); publik via serverless |
| R4 | **Data contoh menyerupai data produksi** | 42 tugas progres 15–90% tampak seperti pekerjaan aktif padahal contoh paket | Didokumentasikan di 00; bot dapat mengganti dengan data nyata |
| R5 | **Sub-agen tanpa runtime disalahartikan aktif** | Registry bisa dibaca sebagai "agen yang bekerja" | Chip status eksplisit "Belum terhubung runtime" + catatan di org.json & dokumen ini |
| R6 | **VM ephemeral** | Proses runtime (bridge/bot/9router) mati saat restart | Watchdog + systemd auto-restore (terverifikasi berulang) |

## Asumsi yang dinyatakan eksplisit

1. tasks.json adalah data contoh yang boleh diganti pemilik lewat bot — bukan arsip historis yang wajib dipertahankan byte-per-byte. (Migrasi tetap wajib backup; lihat 06.)
2. Satu pemilik/pengguna berwenang (bot gate: allowed_user_ids) — belum perlu multi-user auth.
3. Vercel tetap platform deploy; filesystem runtime Vercel bersifat ephemeral (fakta platform, bukan asumsi).
4. Budget: tanpa layanan berbayar baru tanpa persetujuan (sesuai preferensi pemilik).
5. Gaya visual 3D diorama dipertahankan; gambar referensi pixel-art dari pemilik dipakai sebagai inspirasi kepadatan ruangan & konsep papan kanban, bukan perintah mengganti engine/gaya.
