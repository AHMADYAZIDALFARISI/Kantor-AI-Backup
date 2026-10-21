# 12 — Audit Interaksi Papan Kerja & Hierarki Agen

Metode: Playwright headless (SwiftShader) terhadap build lokal final, skenario /tmp/smoke-audit.cjs (A: desktop, B: responsif 390px, C: org.json diblokir).

## Hasil interaksi

| # | Skenario | Hasil | Bukti |
|---|----------|-------|-------|
| I1 | Klik kartu tugas membuka agen yang tepat | **PASS** | Kartu "Analisis funnel konversi" → drawer "Nadia", `selected.id = growth_head`, panel tertutup |
| I2 | Filter ruangan sesuai data | **PASS** | Filter `redaksi` → tepat 3 kartu, semua milik Fiqih (satu-satunya agen ber-ruang redaksi) |
| I3 | Konsistensi lead ↔ org.json | **PASS** | Himpunan lead org.json == himpunan kepala divisi staff.json (diverifikasi data); drawer `redaksi_head` menampilkan 3 sub-agen sesuai registry |
| I4 | ID sub-agen unik | **PASS** | 25/25 unik (cek program) |
| I5 | Chip status runtime konsisten | **PASS** | Semua sub-agen dirender dari `runtime_labels["not_connected"]` = "Belum terhubung runtime"; tidak ada UI yang menyebut sub-agen "sedang bekerja" |
| I6 | Fokus keyboard saat panel dibuka | **PASS** | `document.activeElement` = tombol Tutup (bdClose) |
| I7 | Responsif 390px | **PASS** | Grid papan menjadi 1 kolom (`grid-template-columns: 322.8px`); panel tetap terbuka & dapat ditutup |
| I8 | State kosong kolom | **PASS** | Kolom Antre/Selesai menampilkan "Kosong." (sesuai data: tidak ada tugas 0%/selesai) |
| I9 | Error aplikasi selama interaksi | **PASS** | 0 page error pada skenario A & B |
| I10 | org.json gagal dimuat (error state) | **FAIL → FIXED → PASS** | Uji awal: boot mati total (timeout 150 dtk) — bug nyata F-INT-04. Setelah perbaikan loader (file opsional → null), uji ulang: drawer terbuka, org=null, seksi sub-agen absen dengan bersih, plans utuh, 0 error |

## Bug yang ditemukan & diperbaiki

- **F-INT-04 (High, FIXED lokal): `loadData()` di `src/main.js` memakai `Promise.all` yang melempar pada kegagalan file APA PUN** — file opsional org.json yang gagal dimuat mematikan seluruh aplikasi (layar gagal muat). Perbaikan: daftar `optional` — kegagalan file opsional menghasilkan `null` (konsumen sudah menjaganya: `data.org || null`, guard di shell). File inti tetap fatal bila gagal, sebagaimana mestinya. Terverifikasi: build PASS + skenario C PASS. **Belum di-deploy** (sesuai instruksi tahap ini).

## Temuan kecil

- **F-INT-01 (Low): label ruangan "umum".** Filter papan menampilkan opsi "umum" (huruf kecil, mentah dari field staff) untuk 4 staf umum. Tidak salah, tapi tidak seindah label lain. Perbaikan sepele: petakan `umum` → "Staf Umum" di UI (tahap implementasi berikutnya).
- **F-INT-02 (Info): sinkronisasi data bersifat snapshot.** Papan membaca `store.plans` saat boot dari snapshot tasks.json hasil deploy; perubahan bot tampak setelah redeploy selesai + halaman dimuat ulang. Panel berlangganan event `plans` (centang lokal langsung memperbarui kolom — terverifikasi oleh desain store; bukan "realtime server").
- **F-INT-03 (Info): tidak ada klaim bekerja palsu.** Status agen di 3D tetap berlabel SIMULASI; titik backend hanya menyala dari event chat nyata (tidak berubah dari audit sebelumnya).

## Aksesibilitas (ringkas)

Kartu papan adalah `<button>` asli (fokusable, Enter/Space); panel `role="dialog"` + `aria-label`; select filter ber-`aria-label`; Escape & klik-luar menutup. Kekurangan yang dicatat: drawer detail belum memindahkan fokus saat terbuka (sudah ada sebelum sprint ini) — masuk daftar perbaikan umum, bukan regresi.
