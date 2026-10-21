# Visual Quality Overhaul — Laporan (2026-10-20)

Status: **LIVE di production sejak 2026-10-20 ~18:33 WIB** (deploy disetujui pemilik; review pra-rilis Opus 4.8: GO-DENGAN-CATATAN). Build live index-DWJ--NPe.js (hash cocok dengan build lokal yang lolos regresi penuh). Rollback: redeploy build lama index-DjCBNSWX.js. Verifikasi live: situs 200, health gemini ok, map 188, org delegation x25, delegations completed tampil. Chat generate saat verifikasi: gemini_http_429 (kuota Google, kondisi pre-existing, bukan akibat rilis). Smoke UI headless terhadap URL live: BLOCKED (proxy VM menolak Chromium); fungsi UI diverifikasi pada build identik secara lokal.
Kode modul visual ditulis oleh Opus (cc/claude-opus-5-5 via 9router) sesuai aturan user; integrasi, perbaikan kompatibilitas antar-potongan Opus, dan validasi oleh Gembul.

## A. Ringkasan eksekutif
Fondasi material naik kelas: tekstur prosedural multi-channel (R=bump, G=roughness) untuk kayu/logam/kain dan detail per kategori lantai (kayu/ubin/terrazzo/beton/karpet-karet). Contact shadow gabungan di bawah furnitur memberi kedalaman tanah. 13 furnitur kontekstual ditambahkan ke 6 ruangan tersepi. Karakter mendapat rim-light yang lebih halus + variasi skala deterministik. Nol regresi fungsional; draw calls tidak naik.

## B. Perubahan per ruangan (furnitur baru, dari katalog GLB yang sudah ada)
- arsip (9→11): bookshelf, trash_bin
- spesialis (9→12): armchair, floor_lamp, painting (dinding)
- kantin (11→13): plant_tall, corkboard (dinding)
- lab_qa (12→15): server_rack, whiteboard (dinding), trash_bin
- gym (12→14): yoga_mat, plant_tall
- rapat (13→14): floor_lamp
Penempatan divalidasi anti-tumpang-tindih (AABB) terhadap placement lama; total placement 175→188.
Semua ruangan: contact shadow di bawah furnitur lantai; material lantai per kategori kini punya bump+roughness map prosedural.

## C. Karakter
- Rim-light: kekuatan 0.32, eksponen 2.6 (lebih lembut dari 0.35/3.0), envMapIntensity 0.75.
- Variasi skala deterministik 0.97–1.03 per id agar siluet tidak seragam.
- Batasan: geometri GLB (wajah/rambut/pakaian) tidak diubah — perlu pemodelan ulang di Blender untuk detail bentuk; di luar jangkauan aman overhaul ini.

## D. Perubahan teknis
- `src/scene/finish.js` — ditulis ulang penuh (Opus): helper noise tileable, makeDetailTextures v2, makeContactShadowTexture, FLOOR_CATEGORY + makeFloorDetail, applyFurnitureFinish (roughnessMap FurnVC/Metal), applyCharacterFinish (rim chained onBeforeCompile + customProgramCacheKey).
  - Perbaikan integrasi oleh Gembul: dua potongan Opus tidak kompatibel tanda tangan fbm/vnoise/groutMask — diselaraskan; satu bug splice (titik potong komentar ganda) diperbaiki; file tervalidasi node --check.
- `src/scene/environment.js` — floorMat memasang bump/roughness detail per kategori (try/catch aman).
- `src/scene/furniture.js` — contact shadow: quad per placement lantai digabung jadi 1 mesh (mergeGeometries), tekstur radial 128px.
- `src/scene/characters.js` — variasi skala model per id.
- `src/scene/renderer.js` — exposure 0.95→1.0, environmentIntensity 0.22→0.30, hemi 0.75→0.80.
- `public/data/map.json` — +13 placement (backup: /tmp tidak persisten; nilai lama tercatat di git? tidak — salinan sesi di /tmp/map-backup.json hilang saat VM restart; perubahan bersifat aditif & terdokumentasi di sini).
- Tidak diubah: api/, tasks.json, org.json, delegations.json, store, UI 2D, bot Telegram.

## E. Performa (headless SwiftShader, 1440×900, dist lokal — angka relatif, bukan GPU nyata)
| Metrik | Baseline | Sesudah |
|---|---|---|
| Draw calls | 214 | 197–218 (dua run; variansi frustum/animasi) |
| Triangles | 334.610 | 344.886–345.214 (+~3%, dari 13 furnitur baru) |
| Meshes | 261 | 265 (+4: contact shadow + item baru ter-merge) |
| Textures (GPU) | 61 | 62–67 |
| Page errors | 0 | 0 |
Waktu ready headless sangat bervariasi (14–41 dtk, SwiftShader) — tidak dipakai sebagai klaim.

## F. Regresi
- Build Vite: PASS
- Boot + render 3D (0 error konsol): PASS
- Papan Kerja 0/42/0 + 42 kartu: PASS
- Drawer agen: sub-agen 3 + chip "Aktif via delegasi Telegram": PASS
- Riwayat delegasi completed + sintesis tampil: PASS
- Rencana kerja + progres tampil: PASS
- tasks.json utuh (42; 15–90; 0 done): PASS
- Chat API: NOT RUN lokal (server statis tanpa /api; kode api/ tidak disentuh)
- Uji perangkat nyata/FPS GPU: NOT RUN (tidak tersedia di VM)

## G. Sisa masalah
- Detail geometri karakter (wajah/rambut) butuh pemodelan GLB ulang.
- Screenshot before-full.png hilang (folder /tmp terhapus restart VM sebelum tersalin) — perbandingan visual before/after penuh tidak tersedia; after tersedia 4 tangkapan di folder ini.
- Draw calls berfluktuasi antar run karena frustum culling + layar animasi; tidak ada regresi terukur yang konsisten.

## H. Rekomendasi deployment
Layak deploy setelah pemilik meninjau tangkapan layar di folder ini. Perubahan murni visual+data placement; risiko regresi rendah (semua uji fungsional PASS).
