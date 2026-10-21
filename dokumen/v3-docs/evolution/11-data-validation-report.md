# 11 — Laporan Validasi Data Papan Kerja

**Pertanyaan:** apakah 42 tugas (42 Berlangsung, 0 Antre, 0 Selesai) itu nyata, contoh, historis, atau campuran?

## Putusan: 100% data contoh paket — bukan data operasional, bukan historis bisnis

### Bukti asal-usul

| Pemeriksaan | Hasil |
|---|---|
| Perbandingan file v2 vs v3 | **Byte-identik** (`office3d/data/tasks.json` == `v3/office3d/public/data/tasks.json`) — data diwariskan utuh dari paket yang diberikan pemilik |
| Waktu file v3 | 2026-10-20 10:41 — saat ekstraksi ZIP paket; tidak ada penulisan operasional sesudahnya pada file v3 |
| Edit operasional nyata | Hanya pernah terjadi pada file **v2** saat uji e2e bot (2026-10-20 ~09:20, ACC → 100% → **dikembalikan** ke 55%). File v3 belum pernah diubah bot |
| Struktur | Seragam sempurna: 14 pemilik × tepat 3 tugas — pola data contoh, bukan akumulasi pekerjaan organik |

### Kualitas metadata: tidak memadai untuk operasional

- **Tanpa identitas stabil:** tidak ada `id` — tugas hanya teridentifikasi dari (agent_id, indeks array). Edit bot berbasis indeks rapuh bila urutan berubah.
- **Tanpa provenance:** tidak ada `source`, `created_at`, `updated_at` — tidak dapat dibuktikan kapan/siapa mengubah tugas.
- **ETA bebas teks:** "hari ini" (9), "2 hari" (9), "besok" (6), "rutin" (5), "3 hari" (4), "4 hari" (4), "seminggu" (3), "5 hari" (2) — bukan tanggal; tidak bisa dihitung kedaluwarsa/terlambat.
- **Progres tanpa dasar pengukuran:** semua kelipatan 5 dalam rentang 15–90 (tidak ada 0, tidak ada 100) — konsisten dengan nilai contoh yang ditulis tangan, bukan hasil pengukuran/kejadian.
- **Semua `done=false`** — tidak ada satu pun tugas selesai dalam data.

### Duplikasi

**12 dari 42 tugas adalah duplikat persis:** daftar lobby yang sama persis ("Sambut tamu & mitra", "Kelola jadwal resepsionis", "Update direktori kantor") dimiliki oleh 5 agen sekaligus — `lobby_head` + `staff_a/b/c/d`. Judul unik keseluruhan: 30 dari 42. Penjelasan yang masuk akal: paket contoh memberi staf umum tugas lobby yang sama; secara operasional ini mengaburkan kepemilikan (siapa bertanggung jawab atas tugas yang sama?).

### Rekomendasi (TIDAK dijalankan — menunggu keputusan pemilik)

1. **Pemisahan aman & kompatibel:** tambahkan field opsional `kind: "sample" | "operational"` dan `id` stabil per tugas. Backward-compatible: `loadPlans()` dan bot mengabaikan field tak dikenal; bot menulis ulang file secara utuh sehingga field ekstra bertahan. UI dapat memberi label "data contoh" per tugas sampai diganti pemilik lewat alur bot yang sudah ada.
2. **Jangan hapus/ubah nilai apa pun sekarang** — papan harus tetap menampilkan data apa adanya (sesuai instruksi pemilik tahap ini).
3. Saat pemilik mulai memakai alur ACC untuk pekerjaan nyata, tugas operasional pertama yang masuk lewat bot ditandai `kind:"operational"` + `updated_at` oleh `office_ops` — pemisahan tumbuh organik, bukan pembersihan paksa.
4. Untuk staf umum: pertimbangkan daftar tugas per-orang yang berbeda ATAU satu daftar bersama yang dirujuk (referensi, bukan salinan) — keputusan pemilik.

## Dampak ke Papan Kerja

Angka 42/0/0 **bukan bug** — papan menerjemahkan data sumber dengan setia. Yang salah adalah *kesan* yang timbul: situs publik tampak memiliki 42 pekerjaan aktif padahal nol. Label konteks (catatan "data contoh" sudah ada di drawer agen) sebaiknya diperluas ke panel Papan Kerja pada tahap implementasi berikutnya — perubahan teks kecil, bukan perubahan data.
