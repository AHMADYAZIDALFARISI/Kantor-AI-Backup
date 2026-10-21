# 05 — Database Decision Record

**Status: KEPUTUSAN — pertahankan tasks.json untuk sekarang; migrasi ke managed PostgreSQL sebagai langkah terjadwal, bukan sekarang.**

## Bukti (brief §8.1)

1. **tasks.json di deployment:** berada di repo → dibundel sebagai aset statis Vercel; filesystem runtime Vercel **ephemeral & read-only** untuk fungsi — file TIDAK bisa ditulis dari situs.
2. **Penulis:** tunggal — bot Telegram di VM (file lokal VM persisten di home). Tidak ada multi-writer hari ini.
3. **Concurrency/lost update:** tidak terjadi pada pola saat ini (satu penulis, pembaca snapshot). Risiko muncul hanya bila web ikut menulis.
4. **Berbagi data bot↔web:** via redeploy (file → build → CDN). Latensi ±20 dtk, dapat diterima untuk showcase/operasional ringan.
5. **Kebutuhan relasional:** mulai muncul (history tugas, event log, approval, sub-agent tasks) — tetapi belum ada fitur yang membutuhkannya *hari ini*.
6. **Biaya/overhead:** Postgres managed (Neon/Supabase free tier) layak saat dibutuhkan; menambahkannya sekarang = operasional baru tanpa pengguna.

## Keputusan & alasan

- **Sekarang:** JSON + single-writer + kontrak terdokumentasi (01-current-data-flow). Sesuai brief §8.2: "JSON dapat menjadi solusi sementara dengan batasan terdokumentasi" untuk aplikasi kecil single-writer.
- **Pemicu migrasi (salah satu cukup):** (a) web perlu menulis tugas; (b) perlu history/event/approval persisten; (c) sub-agent runtime nyata mulai mengeksekusi task; (d) >1 penulis.
- **Target saat pemicu terpenuhi:** managed PostgreSQL (Neon free tier — tanpa kartu, sesuai preferensi pemilik) dengan schema di 06; SQLite ditolak (deployment serverless multi-instance + file tak persisten); Redis/vector: tidak ada use case.

## Batasan yang diterima secara sadar

- Tidak ada query/filter server-side; board melakukan proyeksi di klien (42 item — aman).
- Tidak ada audit trail perubahan tugas selain riwayat chat Telegram + git-less deploy (deploy tidak menyimpan versi data lama — backup manual diperlukan sebelum edit besar via bot).
