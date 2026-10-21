# Strategi Routing Model Bertingkat

Prinsip inti: **Lindungi kolam Claude Pro** (Opus/Sonnet/Haiku berbagi kuota — jangan sampai habis). Alihkan volume tinggi & tugas deterministik ke **Gemini gratis**. Simpan Opus hanya untuk keputusan yang mahal bila salah.

## 1. Matriks Penugasan

| Jenis Pekerjaan | Model Utama | Cadangan | Alasan |
|---|---|---|---|
| 1. Bot Telegram operasional | Gemini Flash-Lite | Haiku 4.5 | Parsing niat→JSON sederhana butuh cepat & murah, bukan kepintaran. |
| 2a. Lead buat rencana | Sonnet 5 | Opus (eskalasi) | Pemecahan subtugas butuh penalaran menengah yang terstruktur. |
| 2b. Sub-agen eksekusi teks | Gemini 3.5 Flash | Haiku 4.5 | Riset/draft/review ringkas = volume tinggi, Gemini gratis menyerap beban. |
| 2c. Lead sintesis | Sonnet 5 | Opus (jika konflik hasil) | Menggabungkan hasil butuh koherensi, jarang butuh Opus. |
| 3. Kode fitur/arsitektur baru | **Opus** | Sonnet 5 | Desain salah = biaya refactor besar; kepintaran puncak sepadan. |
| 3. Review pra-rilis & debug sulit | **Opus** | Sonnet 5 | Bug halus & implikasi keamanan mahal bila lolos. |
| 3. Kode rutin/boilerplate/CRUD | Sonnet 5 | Haiku 4.5 | Pola umum, Sonnet sudah lebih dari cukup. |
| 4. Persona web publik | Gemini 3.5 Flash | Flash-Lite / Haiku | Volume tinggi + jawaban pendek = wajib model gratis/murah. |
| 5. Konten (riset, caption, naskah) | Gemini 3.5 Flash | Haiku 4.5 | Kreatif ringan bervolume, Gemini gratis ideal. |
| 5. Ekstraksi/klasifikasi terstruktur | Flash-Lite | Haiku 4.5 | Tugas pola-tetap, model kecil akurat & hemat. |
| 5. Ringkasan dokumen panjang | Gemini 3.5 Flash (konteks besar) | Sonnet 5 | Flash murah untuk token masuk banyak. |
| 6. Watchdog/monitor terjadwal | Kode deterministik dulu | Flash-Lite (jika perlu LLM) | Mayoritas tak butuh LLM sama sekali. |

## 2. Aturan Eskalasi (sinyal konkret)

**Naik kelas ke Sonnet:**
- Output model kecil gagal validasi skema/JSON **2× berturut**.
- Panjang konteks > ambang (mis. banyak file saling-terkait).
- Confidence rendah terdeteksi (model minta klarifikasi / jawab "tidak yakin").

**Naik kelas ke Opus:**
- Tugas menyentuh **arsitektur, keamanan, migrasi data, atau uang**.
- Sonnet gagal/merevisi solusinya sendiri 2×.
- Bug tak terpecahkan setelah 1 siklus Sonnet.

**WAJIB tetap di model kecil (larang eskalasi):**
- Parsing niat Telegram, status tugas, caption, klasifikasi label tetap, ping watchdog — eskalasi di sini hanya membuang kuota tanpa menaikkan kualitas.

## 3. Aturan Hemat Token Lintas Model

1. **Konteks minimal per peran** — sub-agen hanya menerima subtugasnya, bukan seluruh percakapan lead.
2. **Batas output eksplisit** (`max_tokens`) per peran: parsing pendek, draft sedang, hanya audit yang panjang.
3. **System prompt ramping + cache** — persona & instruksi tetap di-cache, jangan kirim ulang penuh tiap giliran.
4. **Ringkas-lalu-oper** — dokumen panjang diringkas Gemini dulu, baru ringkasannya (bukan dokumen mentah) masuk ke Sonnet/Opus.
5. **Gate deterministik dulu** — untuk tugas 6, cek aturan/regex sebelum memanggil LLM apa pun.
6. **Output terstruktur (JSON/skema)** — kurangi token penjelasan bertele-tele dan memudahkan validasi.
7. **Pemanasan gratis** — jalankan draft/retry awal di Gemini; baru finalisasi di Claude bila lolos gate.

## 4. Opus: Pertahankan vs Boros

**TIDAK boleh diturunkan dari Opus:** desain arsitektur baru, review keamanan pra-rilis, debugging kompleks lintas modul, keputusan migrasi data. Alasan: kesalahan di sini berbiaya perbaikan jauh lebih besar daripada selisih kuota.

**Boros bila memakai Opus:** chat persona web, bot Telegram, caption/parafrase, klasifikasi, ringkasan rutin, sintesis hasil sederhana — kepintaran puncaknya tak terpakai sambil menguras kolam bersama.

## Tabel Ringkas

| Tier | Model | Peran |
|---|---|---|
| Hemat/Gratis | Gemini Flash-Lite / 3.5 Flash | Volume: bot, persona, konten, ekstraksi, sub-agen |
| Cadangan murah | Haiku 4.5 | Fallback cepat saat Gemini fluktuatif |
| Seimbang | Sonnet 5 | Lead plan/sintesis, kode rutin, eskalasi pertama |
| Mahal/puncak | Opus | Arsitektur, keamanan, audit, debug sulit — **hanya ini** |