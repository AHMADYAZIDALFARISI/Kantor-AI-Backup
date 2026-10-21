# Redesign Plan

## Pertahankan

- Vanilla three.js + ES module (tanpa migrasi ke React Three Fiber).
- Skema `map.json`, `staff.json`, `divisions.json`, `skills.json`, API bridge.
- Grid 64x46, A* (diganti binary heap), POI, deep-link, shortcut, browser skill.

Alasan tidak migrasi ke R3F: semua 13 modul perlu ditulis ulang, risiko regresi tinggi, dan manfaat utama (deklaratif, Drei) tidak menyelesaikan masalah terbesar proyek, yaitu kualitas aset, kebenaran data, dan keamanan token.

## Refactor

| Area | Perubahan |
|---|---|
| Build | Tambah Vite (vanilla). three dibundel lokal, versi dipin. Output statis tetap kompatibel Vercel |
| Loop | Satu loop di `scene/renderer.js`, `dt` tidak dibatasi untuk logika (fixed-step akumulator) |
| Store | Pisah `agents` (posisi/anim, tidak di-emit per frame) dari `status` (sumber + label) |
| UI | Render granular, input chat tidak pernah diganti saat emit |
| Simulasi | Hapus kenaikan progres otomatis. Scheduler ambient deterministik |
| Keamanan | `api/chat.js` proxy, token di Vercel env, `model` di-whitelist server, rate limit per pengguna di proxy |

## Bangun ulang

| Area | Pendekatan | Alasan |
|---|---|---|
| Karakter | Blender headless (`bpy`): 1 rig dasar humanoid stylized, 14 varian (rambut, pakaian, aksesori), klip animasi baked. Export GLB + SkinnedMesh | Rig dan klip dibuat sekali, dipakai ulang. Tidak bergantung layanan berbayar |
| Animasi | `AnimationMixer` + crossfade 0,25 s. Klip: idle, walk, sit_down, sit_idle, type, talk, listen, think, point, celebrate, error, stand_up | Transisi halus, tidak lagi rotasi kotak |
| Furniture | Pustaka GLB modular dari Blender, 1 model per tipe (78 tipe dikelompokkan ~40 model unik), bevel, material PBR bersama | Mengganti 15 builder generik |
| Lingkungan | Lantai berlapis + skirting, dinding tebal dengan bukaan pintu/jendela, koridor, cutaway dinding depan otomatis sesuai sudut kamera | B5, B7 |
| Kamera | Orbit terbatas (azimuth bebas, polar 30 sampai 60 derajat), zoom, reset, preset per ruangan, fokus agen, transisi tween | Syarat fase 4 |
| Cahaya | Hemisphere + 1 directional shadow (PCF soft, update saat kamera/objek statis berubah), AO baked di lantai/furniture, tone mapping AgX/ACES | B1 |
| UI | Shell baru: top bar, daftar agen yang bisa dicari, panel kontekstual, kontrol kamera, indikator koneksi backend nyata, label "simulasi" | Fase 8 |

## Urutan prioritas (dampak visual terbesar dulu)

1. Milestone B: art direction + arsitektur folder + Vite, tanpa mengubah perilaku.
2. Milestone C: lingkungan (koridor, dinding, pintu, cahaya, shadow) + kamera orbit/preset.
3. Milestone D: karakter rig + 3 karakter foto lebih dulu (Yazid, Faris, Mirza), lalu 11 sisanya. Furniture prioritas: meja kerja, kursi, monitor, sofa, meja rapat.
4. Milestone E: FSM + crossfade + duduk di kursi tanpa foot sliding.
5. Milestone F: UI shell + proxy chat + pemetaan status nyata.
6. Milestone G: kompresi, instancing, tier kualitas, ukur di GPU nyata.
7. Milestone H: regresi Playwright, dokumen, siap deploy.

## Anggaran performa (target, bukan janji)

| Tier | Draw call | Segitiga | Shadow | Pixel ratio | Target |
|---|---|---|---|---|---|
| Desktop | < 150 | < 400k | 2048, update on demand | sampai 2 | 60 fps GPU diskrit/terintegrasi modern |
| Tablet | < 120 | < 250k | 1024 | sampai 1,5 | 45 fps |
| Mobile | < 90 | < 150k | blob shadow | 1 sampai 1,25 | 30 fps |

Ukuran unduhan awal target < 6 MB (GLB meshopt + KTX2), karakter dimuat bertahap.
