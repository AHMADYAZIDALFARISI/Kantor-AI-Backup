# Art Direction: Kantor KCSH v3

## Konsep
Diorama kantor kreatif Indonesia yang dilihat dari atas, seperti maket arsitek yang hidup. Setiap ruangan punya identitas lantai dan cat sendiri. Agen terlihat sebagai orang dengan pakaian, rambut, dan aksesori yang berbeda. Antarmuka berbentuk lembaran kertas hangat yang tidak menutupi kantor.

Satu elemen menonjol: **cutaway dinding**. Dinding yang menghadap kamera turun ke tinggi 0,42 m saat kamera berputar, sehingga isi ruangan selalu terbaca tanpa label melayang.

## Palet
| Token | Hex | Peran |
|---|---|---|
| Accent | `#5b6cff` | Seleksi, tombol utama, garis pemandu koridor |
| Coral | `#ff7a59` | Aksen Growth, sorotan sekunder |
| Ink | `#1b1f2a` | Teks utama |
| Paper | `#fbfaf7` | Permukaan panel (mode terang) |
| Night | `#1a1d26` | Permukaan panel (mode gelap) |
| Backdrop | `#dfe2e7` → `#c9ccd3` | Latar 3D, gradien vertikal |

Status: `#1f9d63` nyata/terhubung, `#c98512` memeriksa/memproses, `#d83b42` error, `#8a5cc0` label simulasi.

Identitas ruangan (lantai, cat dinding, aksen) ada di `src/scene/environment.js` (`ROOM_STYLE`). Aturan: cat dinding pastel dengan saturasi rendah, lantai membawa karakter ruangan, aksen jenuh hanya untuk signage dan papan skill.

## Tipografi
Plus Jakarta Sans (di-host sendiri). Dirancang di Jakarta, cocok untuk produk Indonesia. Bobot 500 untuk teks, 700 untuk judul, 800 untuk angka besar di papan skill. Label sentence case.

## Karakter
- Proporsi stylized semi-realistis: tinggi 1,65 sampai 1,77 m, kepala radius 0,128 m (sekitar 1/6,5 tinggi).
- Mata besar dengan highlight, alis berwarna rambut, hidung kecil, mulut garis.
- Pembeda wajib antar karakter: siluet rambut, warna dan jenis atasan, aksesori, warna kulit, tinggi dan lebar bahu.
- Tiga karakter dari foto mempertahankan ciri utama foto, bukan kemiripan wajah: Yazid (jersey maroon berbahu hitam, rambut menyamping), Faris (polo navy, celana krem, poni lurus, jam tangan), Mirza (rambut keriting, jaket denim kerah cokelat, kemeja putih, ransel).
- Satu material vertex color per karakter (1 draw call).

## Furnitur
Bentuk sederhana dengan bevel 1 sampai 3 cm, proporsi nyata (meja 74 cm, kursi duduk 50 cm, pintu 2,25 m). Kayu ek hangat, putih tulang, logam satin. Detail kecil hanya di area yang terlihat dari kamera: monitor, keyboard, mug, buku, tanaman.

## Cahaya
Neutral tone mapping (warna tidak pudar), hemisphere hangat, satu matahari dari tenggara dengan shadow PCF soft, fill dingin tanpa shadow. Emissive hanya untuk layar dan lampu status. Tanpa bloom.

## Gerak
Crossfade animasi 0,28 s. Transisi kamera 0,5 sampai 0,9 s, ease in-out kubik. Dinding cutaway bergerak dengan lerp 6/s. Mode kurangi gerakan: transisi kamera instan dan layar berhenti beranimasi.

## Yang dihindari
Label melayang untuk semua objek (hanya agen terpilih yang diberi label), neon dan bloom, karakter kloning yang hanya diganti warna, efek kaca berlebihan di UI, status palsu.
