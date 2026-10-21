# 08 — Laporan Pengujian (Sprint Evolusi, 2026-10-20)

## Hasil

| # | Test | Hasil | Bukti |
|---|------|-------|-------|
| E1 | Verifikasi baseline live: situs 200; health | **PASS** | curl: 200; `{"ok":true,"backend":"gemini"}` |
| E2 | Build produksi setelah perubahan | **PASS** | `vite build` 3.09s, exit 0 |
| E3 | Render headless build baru (SwiftShader) | **PASS** | `window.__office` siap; 0 error konsol aplikasi |
| E4 | org.json termuat & lengkap | **PASS** | 10 lead, 25 sub-agen terhitung dari state aplikasi |
| E5 | Panel Papan Kerja membuka & data cocok | **PASS** | Kolom: Antre 0 · Berlangsung 42 · Selesai 0 — cocok dengan distribusi tasks.json (42 tugas, progres 15–90%, done=false semua; diverifikasi terpisah via Python) |
| E6 | Seksi Sub-agen di drawer lead | **PASS** | qa_head: 3 sub-agen; chip "Belum terhubung runtime"; pertama "Uji Penetrasi" |
| E7 | Agregat papan 3D (kode) | **PASS sebagian** | Perhitungan diuji dari data: mis. lab_qa = 3 tugas; caption dirender ke canvas — inspeksi visual tekstur di GPU nyata NOT RUN |
| E8 | e2e bawaan repo (tools/e2e.py) | **BLOCKED** | python-playwright belum terpasang (sama seperti audit) |
| E9 | Chat generate live | **BLOCKED (eksternal)** | 429 kuota Gemini (tidak berubah) |
| E10 | Test agent/workflow brief §13 (delegasi, retry, approval runtime) | **NOT RUN** | Fitur runtime belum ada — tidak diklaim |
| E11 | Test database brief §13 | **NOT RUN** | Migrasi belum dijalankan (keputusan 05) |

## Kejujuran cakupan

- E5 memverifikasi konsistensi tampilan dengan file sumber, bukan "kebenaran pekerjaan" — progres tasks.json adalah data contoh (lihat 00).
- Performa GPU nyata: belum diukur (SwiftShader tidak mewakili perangkat).
