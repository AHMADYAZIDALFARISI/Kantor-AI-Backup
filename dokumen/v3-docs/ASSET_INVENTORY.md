# Asset Inventory (kondisi saat ini)

## File aset di repo

| Jenis | Jumlah | Lokasi | Catatan |
|---|---|---|---|
| Model 3D (GLB/glTF) | 0 | - | Semua geometri dibuat di runtime |
| Tekstur | 0 | - | Hanya vertex color + canvas label |
| Sprite sheet avatar | 0 dari 14 | `assets/characters/sheets/` | Direferensikan `staff.json`, tidak ada di repo (B11) |
| Data JSON | 8 | `office3d/data/` | `skills.json` 265 KB terbesar |

Sumber eksternal: paket `ai-office-pixel-assets.zip` (14 sprite sheet 32x48, 78 furniture 2D, tile, peta). Tidak dipakai sebagai tekstur 3D, hanya avatar dan palet.

## Geometri runtime

| Kelompok | Pembuat | Unik | Instance | Kualitas |
|---|---|---|---|---|
| Lantai + dinding ruangan | `world3d.js addBox` | 1 BoxGeometry per bagian | 13 x 5 | Kotak polos |
| Label ruangan | Canvas sprite | 13 | 13 | Tajam, tapi selalu di atas semua objek |
| Furniture | 15 builder di `furniture-builders-a/b.js` | 15 bentuk | 144 | Low-poly datar, 1 warna utama |
| Karakter | `characters.js createFigure` | 1 bentuk | 14 | 7 primitif, 4 warna dari palet |

## Pemetaan 78 tipe ke 15 builder (sumber B6)

| Builder | Tipe yang dipetakan | Masalah |
|---|---|---|
| desk | desk_pc, desk_dual, editing_desk, typewriter_desk, workbench, exec_desk | Satu bentuk untuk 6 fungsi |
| chair | chair_office, chair_office_down, exec_chair, meeting_chair, armchair | Armchair = kursi kantor |
| table | meeting_table, reading_table, coffee_table, dining_set | Dining tanpa kursi |
| sofa | sofa, beanbag, waiting_bench | Beanbag kotak |
| shelf | bookshelf, archive_cabinets, filing_cabinet, trophy_cabinet, specimen_shelf, newspaper_rack | |
| plant | plant_monstera, plant_small, plant_tall | |
| board | whiteboard, corkboard, data_board, growth_board, comfy_node_board, skill_board, logo_wall, painting | Semua `wall:true` kecuali skill_board, jadi tidak dibangun |
| screen | tv_wall, projector_screen | Dinding, tidak dibangun |
| kitchen | kitchen_counter, fridge, vending_machine, water_dispenser, coffee_cup, bar_stool | Kulkas = counter |
| gym | treadmill, exercise_bike, dumbbell_rack, bench_press, yoga_mat, punching_bag, gym_mirror | Semua menjadi treadmill |
| tech | server_rack, printer, printer_3d, test_bench, tool_wall, holo_pod, orb_pedestal, memory_vault, shield_terminal, security_wall, anti_slop_filter | Semua menjadi rak server |
| decor | floor_lamp, wall_clock, rug, rug_round, globe, trash_bin, door, window | Karpet dan tempat sampah menjadi lampu lantai |
| studio | camera_tripod, clapperboard, green_screen, softbox_light, megaphone_stand, radio_station | Semua menjadi tripod kamera |
| reception | reception_desk, directory_kiosk | |
| mail | mail_sorter | |

## Kebutuhan aset baru (ringkas)

- 1 rig humanoid dasar + 14 varian karakter, 12 klip animasi.
- ~40 model furniture unik (78 tipe dikelompokkan menurut bentuk), varian lewat material.
- Kit arsitektur: lantai per material, dinding modular (polos, pintu, jendela), skirting, kusen, koridor.
- Konten layar prosedural (canvas/shader) untuk monitor, TV, papan skill.
- Atlas tekstur kecil (1024 px) untuk kayu, kain, logam, tanaman; KTX2.
