# 04 — Desain Ruangan & Papan Kerja

## Referensi visual pemilik

Dua gambar pixel-art diberikan pemilik (2026-10-20): (1) "Agent Town Office" — kantor padat berisi workstation, area kopi, rak server, mission log board; (2) standup di depan papan kanban SPRINT (TO DO / DOING / DONE). Dipakai sebagai inspirasi **kepadatan fungsi** dan **konsep papan kanban**, bukan pergantian gaya: engine tetap 3D diorama (aturan brief §6).

## Yang sudah ada (Verified)

- 13 ruangan data-driven dari `map.json` (layout, POI, spawn) + 72 model furnitur GLB; variasi via `ROOM_STYLE` (accent per ruangan) di `src/main.js`.
- Papan 3D per ruangan (`screens.boardMaterial`): nama ruangan + angka besar + caption.
- Layar animasi per jenis ruangan (kode, grafik, dsb.) via painters `screens.js`.

## Perubahan sprint ini (Verified)

1. **Caption papan 3D = statistik tugas nyata**: untuk ruangan yang agennya punya tugas, caption menampilkan `N tugas · rata-rata X% · D selesai` (agregat dari tasks.json saat build). Ruangan tanpa tugas mempertahankan caption katalog.
2. **Panel Papan Kerja** (`src/ui/boardPanel.js`): kanban 3 kolom (Antre/Berlangsung/Selesai) dari data yang sama dengan drawer; filter ruangan; klik kartu → pilih agen & buka drawer-nya; catatan pemetaan status tampil eksplisit; state kosong per kolom ditangani ("Kosong.").
3. **Seksi Sub-agen di drawer lead** (dari org.json).

## Desain per ruangan — status & rencana (Proposed bila belum ada)

| Ruangan | Board/display saat ini | Kekayaan props | Usulan berikutnya |
|---|---|---|---|
| Lab QA | Papan statistik tugas ✓ | Meja lab, anti-slop filter | Checklist board (acceptance) — Proposed |
| Direksi | Papan statistik ✓ | Meja eksekutif, globe | Decision log — Proposed |
| Engineering | Papan statistik ✓ | Desk dual/workstation | Build/test status display — Proposed |
| Riset | Papan statistik ✓ | Rak buku, globe | Research board (sumber/temuan) — Proposed |
| Rapat | Layar agenda (animasi) | Meja rapat | Approval queue — Proposed (butuh task engine) |
| Lobby | Papan katalog 729 | Kios direktori | — cukup |
| Redaksi | Papan statistik ✓ | Desk writer/editing | Editorial board — Proposed |
| Growth | Papan statistik ✓ | Desk, tripod kamera | Campaign board — Proposed |
| Studio Kreatif | Papan statistik ✓ | Green screen, tripod | Moodboard display — Proposed |
| Arsip | Papan statistik ✓ | Kabinet arsip | — cukup |
| Spesialis | Papan statistik ✓ | Holo pod | Integration health — Proposed (butuh data nyata) |
| Kantin | — (tanpa board tugas) | Dining set, fridge | sesuai fungsi sosial |
| Gym | — | Bench press, bike | sesuai fungsi |

Catatan kejujuran: usulan "Proposed" tidak ditampilkan di UI sebagai data — hanya rencana dokumen. Menambah board display baru membutuhkan data nyata pendukung; tanpa itu akan menjadi dekorasi yang menyesatkan (dilarang brief §7.3).
