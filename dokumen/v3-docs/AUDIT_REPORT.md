# Audit Report: Kantor KCSH 3D (Milestone A)

Tanggal audit: 2026-10-20
Commit asal: `c4e63a338e62504a447c2c433d74150acf6dd562` (branch `main`, repo `Kantor-AI-Backup`)
Branch kerja: `feat/3d-hd-rebuild` (dibuat dari commit di atas, belum ada perubahan kode)

## 1. Metode

1. Clone repo, baca seluruh 13 file JS, 8 file JSON, `bridge.py`, README.
2. Jalankan lokal: `python3 -m http.server`, three r160 dari npm (unpkg tidak terjangkau dari sandbox), sprite sheet avatar dari paket aset asli.
3. Playwright + Chromium (WebGL SwiftShader, tanpa GPU). Ambil screenshot desktop 1440x900 dan mobile 390x844, ukur boot, draw call, FPS, error konsol.
4. Uji perilaku spesifik lewat `window.__office` (input chat, progres tugas, shadow map).

Batasan: situs live `kantor-kcsh.vercel.app` tidak bisa diambil dari lingkungan ini (domain di luar allowlist). Semua temuan berasal dari kode repo, bukan dari build live. Perbedaan repo vs live belum terverifikasi.

## 2. Baseline terukur

| Metrik | Desktop 1440x900 | Mobile 390x844 |
|---|---|---|
| Boot sampai `window.__office` siap | 0,48 s (lokal) | 0,48 s |
| Draw call per frame | 396 | 211 |
| Segitiga per frame | 32.224 | 15.226 |
| Geometri di GPU | 295 | 162 |
| Tekstur | 13 | 8 |
| FPS (SwiftShader, CPU 1 core) | 2,3 | 6,0 |
| Error konsol aplikasi | 0 | 0 |
| Request gagal | 0 (setelah importmap uji diperbaiki) | 0 |

FPS SwiftShader tidak mewakili perangkat nyata. Angka ini hanya pembanding relatif sebelum/sesudah di lingkungan yang sama. Pengukuran di GPU nyata wajib dilakukan di Milestone G.

Screenshot: `docs/baseline/base_desktop.png`, `base_drawer.png`, `base_mobile.png`.

## 3. Yang berfungsi (terverifikasi)

- Boot, load 7 JSON paralel dengan fallback per file.
- Kamera orthographic isometrik, pan + zoom (rotasi dimatikan).
- 13 ruangan, 144 furniture prosedural, 14 figur.
- A* pathfinding di grid 64x46, state machine idle/walk/work/talk/rest via 61 POI.
- Raycast picking dengan ambang drag 6 px, hover highlight, cincin seleksi.
- Drawer karakter dan furniture, dashboard divisi, pencarian `/`, shortcut Tab/D/F/1-9/Esc, deep-link `#char=` dan `#room=`.
- Browser 729 skill/agen dengan filter jenis dan kategori.
- Chat per staf ke `kantor-bridge` (hanya jalan bila `bridge.json` berisi url + token).

## 4. Bug terverifikasi

| # | Bug | Bukti | Dampak |
|---|---|---|---|
| B1 | Shadow tidak pernah dirender | `shadowMap.autoUpdate=false`, `needsUpdate` tidak pernah di-set, `sun.shadow.map` = null saat runtime | Semua `castShadow` sia-sia, adegan datar |
| B2 | Input chat terhapus tiap 2 detik | Isi `#gd-chatin` = "" setelah 2,5 s; `store.emit()` tiap 2 s memicu `renderCharacter()` yang menulis ulang innerHTML | Chat praktis tidak bisa dipakai |
| B3 | Dua loop `requestAnimationFrame` | `world3d.js animate()` dan `main.js tick()` | Render dan simulasi tidak sinkron, kerja ganda |
| B4 | Media query dashboard rusak | String CSS berisi `\\n@media` literal | Layout mobile dashboard tidak diterapkan |
| B5 | Furniture dinding tidak dibangun | `furniture.js` melewati `p.wall === true` | Jendela, pintu, TV, whiteboard, papan skill dinding hilang |
| B6 | 78 tipe furniture dipetakan ke 15 builder | `furniture-builders.json` | Gym berisi 7 objek identik (treadmill), lampu menggantikan jendela/pintu/jam |
| B7 | Koridor tidak ada | `world3d.js` hanya membangun `rooms` | Ruangan melayang terpisah, karakter berjalan di "kekosongan" |
| B8 | Simulasi melambat di FPS rendah | `dt` dibatasi 0,05 s | Progres dan gerak tergantung FPS |
| B9 | Mobile: kantor tidak terbingkai | Screenshot mobile | Sebagian besar kantor di luar layar saat load |
| B10 | `index-test.html` dan `vendor-test/` disebut README tapi tidak ada di repo | Struktur repo | Uji lokal tidak bisa direproduksi dari backup |
| B11 | 14 sprite sheet avatar tidak ada di repo | README mengakui | Avatar drawer jatuh ke kotak warna |

## 5. Masalah kebenaran data (prioritas tertinggi)

- **D1 Progres tugas palsu.** `simulation.js` menaikkan `progress` +0,35/detik dan menandai `done` sendiri. Isi `tasks.json` adalah data contoh statis. Dashboard menampilkan "63% Ruang Direksi" seolah nyata. Ini melanggar syarat "fake activity tidak boleh tampil sebagai nyata".
- **D2 Status agen palsu.** Status Working/Meeting/Resting berasal dari POI acak, bukan dari backend.
- **D3 Tidak ada sumber status nyata.** `bridge.py` hanya punya `/health`, `/v1/chat`, `/v1/mcp/tools`, `/v1/mcp/call`. Tidak ada endpoint registry agen, status tugas, event, atau riwayat eksekusi. Satu-satunya aktivitas nyata yang bisa divisualkan: chat yang sedang diproses, hasil `/health`, dan panggilan MCP yang benar-benar dieksekusi.

## 6. Masalah keamanan

- **S1 Token bridge bocor ke publik.** README deploy: token disuntik ke `data/bridge.json`, file statis yang bisa diunduh siapa pun. Token yang sama membuka `/v1/mcp/call` (614 tool ArtCraft) dan `/v1/chat` (biaya 9router).
- **S2 Rate limit tidak efektif di balik tunnel.** Semua request lewat cloudflared tampak dari `127.0.0.1`, jadi limit 30/jam berlaku global, bukan per pengguna. Satu pihak bisa menghabiskan kuota semua orang.
- **S3 Klien bisa memilih `model`.** `/v1/chat` menerima `model` bebas dari body.
- **S4 CORS `*`** pada endpoint ber-token.
- Belum terverifikasi: apakah build live saat ini memuat token asli di `bridge.json`.

## 7. Kelemahan visual

- Karakter: 7 primitif (kotak + kapsul + bola), tanpa wajah, tanpa tangan, tanpa rambut berbentuk, tinggi ~1,2 unit. Tidak terbaca pada zoom default.
- Material: `flatShading` + vertex color tunggal, tanpa roughness/normal map, tanpa environment lighting.
- Tidak ada AO, tidak ada shadow (B1), tidak ada kontak benda dengan lantai.
- Dinding cutaway hanya 2 sisi setinggi 2,5 unit, tanpa ketebalan detail, tanpa pintu dan jendela.
- Label sprite `depthTest:false` di semua ruangan, menumpuk saat zoom out.
- Dashboard kiri menutup ~22% viewport desktop.

## 8. Bottleneck performa

- 396 draw call untuk adegan statis kecil. Setiap furniture = 1 mesh dengan 2 material (2 call), dinding 4 box per ruangan, label 13 sprite.
- Material dibuat ulang per furniture (`makeMaterials()` per mesh) dan per figur.
- Pathfinding A* memakai array linear (`splice`), cukup untuk 14 agen, tidak skalabel.
- Tidak ada adaptive pixel ratio, tidak ada pause saat tab tersembunyi selain bawaan browser.

## 9. Ketergantungan dan batasan teknis

- Tanpa `package.json`, tanpa build. three r160 dari unpkg via importmap (runtime CDN dependency).
- Deploy: Vercel REST API dengan token di mesin lokal pengguna. Tidak ada `vercel.json` di repo.
- Backend: `bridge.py` (stdlib) bergantung pada path lokal `~/workspace/...`, 9router SQLite, venv Muse-Skill-Hub, ArtCraft MCP client. Tidak bisa dijalankan di lingkungan audit.
- Lingkungan audit: 1 CPU, 3 GB RAM, tanpa GPU, tanpa Blender terpasang. `bpy 5.2.2` tersedia di PyPI (Python 3.13, wheel 383 MB), `uv` tersedia.

## 10. Risiko terhadap fungsi yang ada

| Risiko | Mitigasi |
|---|---|
| Ganti stack ke React Three Fiber memecah 13 modul sekaligus | Pertahankan vanilla three + ES module, tambah Vite hanya untuk bundling |
| Mengganti `map.json` mematahkan pathfinding, POI, picking | Pertahankan skema; tambah field, jangan ubah yang ada |
| Memperbaiki S1 butuh komponen server baru | Vercel Function sebagai proxy; perlu persetujuan |
| Menghapus simulasi palsu membuat kantor terlihat sepi | Pisahkan "aktivitas ambient (simulasi)" dari "status backend", beri label jelas |
| Aset GLB besar memperlambat mobile | Meshopt + KTX2, tier kualitas per perangkat |
