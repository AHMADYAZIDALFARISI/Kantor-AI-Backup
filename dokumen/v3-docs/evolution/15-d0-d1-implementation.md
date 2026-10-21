# 15 — Implementasi D0–D1 (2026-10-20)

## D0 — Label data (SELESAI, LIVE 2026-10-20 12:56 WIB)

| Perubahan | File |
|---|---|
| 42 tugas dibubuhi `kind: "sample"` (aditif; nilai judul/progres/eta/done diverifikasi 100% sama) | `public/data/tasks.json` |
| `office_ops._stamp()`: tugas yang dibuat/diubah via bot mendapat `kind: "operational"` + `updated_at` (ISO) | `~/workspace/telegram-bot/office_ops.py` |
| Chip "Contoh" pada kartu tugas contoh (panel Papan Kerja) + drawer agen; catatan label diperluas | `src/ui/{boardPanel,shell,styles}.js/css`, `src/state/store.js` (field kind diteruskan) |

Tidak ada nilai data yang diubah — hanya metadata label. Pembaca lama mengabaikan field baru dengan aman.

## D1 — Orchestrator delegasi (SELESAI; bot aktif di VM, tampilan situs LIVE)

| Komponen | Status |
|---|---|
| `~/workspace/telegram-bot/delegation.py` (baru): orchestrator, state machine TRANSITIONS, retry 2× backoff khusus error provider, idempotency key, tulis atomik `delegations.json` | Verified via 7/7 unit test (happy path, idempotensi, penolakan sub-agen tak dikenal, penolakan kapabilitas salah, retry→sukses dengan attempts=3, semua-gagal→run failed, lead tak dikenal) |
| Perintah Telegram `delegasikan ke <lead>: <instruksi>` dengan gate pemilik yang sama dengan inti bot | Terpasang di `super_bot.py`; bot di-restart dan berjalan (watchdog) |
| Uji live satu run (`qa_head`) via jalur produksi | **FAILED secara anggun**: `9router HTTP 503` — kuota Claude Pro habis (reset 15:10 WIB). Run tercatat lengkap di `delegations.json` (status failed + error). Pipeline terbukti; yang mati adalah provider eksternal |
| Tampilan situs: seksi "Riwayat delegasi" di drawer lead (status, instruksi, sintesis/error, catatan kejujuran) | Verified headless: menampilkan run nyata di atas (failed + error) |

## Yang disengaja belum dilakukan

- Label runtime sub-agen tetap `"not_connected"` ("Belum terhubung runtime") — wiring delegasi memang ada, tetapi belum ada eksekusi sub-agen yang berhasil. Setelah run pertama berstatus `completed`, label dapat diganti menjadi `"delegation"` ("Aktif via delegasi Telegram").
- Tidak ada fallback provider otomatis (mis. Gemini bila Claude 503) — opsi dicatat untuk D1.1, tidak diimplementasikan agar D1 tetap minimal dan jujur soal batasan.
- Tidak ada auto-update progres parent dari run — pemilik mengubahnya lewat alur ACC yang sudah ada (tidak menambah penulis baru).
- `delegations.json` diterbitkan ke situs lewat redeploy ter-batch — saat ini hanya setelah run; belum ada pemicu redeploy otomatis pasca-run (tahap ini: run manual → pemilik memicu publikasi dengan meminta redeploy atau menjalankannya langsung dari jawaban bot).

## Test

| # | Test | Hasil |
|---|---|---|
| D1-T1..T7 | Unit orchestrator (7 kasus) | **PASS** |
| D1-T8 | Uji live run delegasi via 9router | **FAIL (anggun, tercatat)** — provider 503; bukan bug kode |
| D1-T9 | Build + headless: chip Contoh 42/42, delegasi drawer (failed+error), plans 3/3 | **PASS** (0 page error) |
| D1-T10 | Restart bot & berjalan | **PASS** (watchdog, PID baru) |

## Risiko residual

- Eksekusi nyata sub-agen bergantung kuota provider — desain sudah tahan gagal (graceful), tetapi delegasi penuh baru bisa dibuktikan setelah kuota pulih (~15:10 WIB).
- `delegations.json` tumbuh tanpa batas — tambahkan retensi (mis. 100 run terakhir) sebelum pola delegasi dipakai rutin.
