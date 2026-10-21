# 14 — Validasi Ruangan 3D & Papan per Ruangan

Basis: `public/data/map.json` (175 penempatan furnitur, 61 POI, 10 skill_boards) + katalog model GLB.

## Kepadatan & konteks per ruangan

| Ruangan | Furnitur | POI | Papan 3D | Konteks kerja khas | Nilai |
|---|---|---|---|---|---|
| Engineering | 19 | 5 | ✓ | server_rack, printer_3d, tool_wall, workbench, desk_dual | Sangat baik |
| Riset | 14 | 6 | ✓ | bookshelf, reading_table, globe, data_board | Baik |
| Redaksi | 14 | 6 | ✓ | typewriter_desk, newspaper_rack, corkboard | Baik |
| Direksi | 13 | 5 | ✓ | exec_desk, sofa, trophy_cabinet | Baik |
| Rapat | 13 | 6 | ✗ (tv_wall animasi generik) | meeting_table, whiteboard | Baik sebagai ruang rapat |
| Growth | 13 | 5 | ✓ | growth_board, projector_screen, trophy_cabinet | Baik |
| Studio | 13 | 3 | ✓ | green_screen, editing_desk, softbox, clapperboard | Baik (POI sedikit) |
| Lab QA | 12 | 4 | ✓ | security_wall, shield_terminal, test_bench, anti_slop_filter | Baik |
| Gym | 12 | 4 | — (tanpa tugas, wajar) | bench_press, treadmill, gym_mirror | Sesuai fungsi |
| Kantin | 11 | 5 | — (tanpa tugas, wajar) | kitchen_counter, fridge, vending_machine | Sesuai fungsi |
| Lobby | 15 | 6 | ✓ | directory kiosk, dsb. | Baik |
| **Arsip** | **9** | 3 | ✓ | archive_cabinets, memory_vault, mail_sorter, radio_station | Cukup (tipis tapi khas) |
| **Spesialis** | **9** | **3** | ✓ | holo_pod, orb_pedestal, specimen_shelf | **Paling tipis & paling generik** |

## Temuan

1. **Tidak ada ruangan kosong.** Kekhawatiran "ruangan polos generik" tidak terbukti pada data aktual — setiap ruangan punya props khas pekerjaannya.
2. **Spesialis** adalah pengecualian relatif: 9 item, hanya ±3 props fungsional khas, dan hanya 3 POI (aktivitas karakter paling sedikit). Usulan fungsional (bukan dekorasi): workstation integrasi (meja + terminal kedua), papan pipeline otomasi — keduanya terkait peran divisi (otomasi & integrasi API per org.json).
3. **Rapat tanpa papan statistik** — konsisten karena tidak ada agen/tugas yang ber-ruang rapat; tv_wall menampilkan animasi generik. Bila approval queue (desain dok 13) lahir, papan rapat adalah tempat alaminya.
4. **Kantin/Gym tanpa papan** — benar secara desain: tidak ada tugas di sana; menambah papan tugas akan menyesatkan.
5. **Keterbacaan papan 3D:** canvas 512×320; caption baru (statistik tugas) muat satu baris pada font 26px untuk nilai saat ini (maks ±35 karakter terukur dari format "N tugas · rata-rata X% · D selesai"). Bila jumlah tugas per ruangan tumbuh >99, format perlu dipadatkan — catat sebagai batas desain.
6. **POI sedikit di Studio/Arsip/Spesialis (3):** karakter lebih jarang beraktivitas spesifik di sana — selaras dengan temuan audit bahwa aktivitas adalah simulasi; tidak ada perbaikan data yang jujur selain menambah titik aktivitas bermakna saat props fungsional ditambah.

## Rekomendasi prioritas (tahap implementasi berikutnya, butuh persetujuan)

1. Spesialis: +1 workstation integrasi & perluas POI (S).
2. Caption papan: padatkan format untuk skala besar (S, bersama D0).
3. Rapat: tunda papan baru sampai approval queue nyata ada (jangan buat papan dekoratif).
