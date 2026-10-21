# Asset Pipeline

## Ringkas
```
tools/blender/characters.py  ─┐
tools/blender/character_specs.json
tools/blender/furniture.py    ─┼─> office3d/public/assets/{characters,furniture}/*.glb (mentah)
                                │
office3d/scripts/optimize-assets.mjs ──> dedup, weld, quantize, meshopt (EXT_meshopt_compression)
```
Satu perintah: `tools/blender/run.sh all` (memasang Blender sebagai modul Python `bpy 5.2.2` di `.venv-blender` lewat `uv`, sekali saja).

Semua aset dibuat oleh skrip dalam repo ini. Tidak ada asset pack pihak ketiga, tidak ada layanan text-to-3D. Lisensi aset mengikuti repo.

## Konvensi
| Hal | Aturan |
|---|---|
| Skala | 1 unit = 1 meter = 1 tile map.json (16 px) |
| Sumbu | Blender: Z atas, depan objek -Y. Di three.js menjadi Y atas, depan +Z |
| Origin | Furnitur: tengah tapak di lantai. Item dinding: punggung di y=0 Blender |
| Penamaan file | `snake_case.glb`, sama dengan kunci di `manifest.json` |
| Material furnitur | `FurnVC`, `Metal`, `Glass`, `Screen`, `GlowCyan/Green/Warm/Purple/Red`. Nama adalah kontrak dengan `src/scene/furniture.js` |
| Warna | Vertex color atribut `Col` (corner domain), tanpa tekstur, tanpa UV |
| Layar | Material `Screen` mendapat UV planar dan tekstur canvas di runtime |

## Karakter
- Rig 18 tulang: root, hips, spine, chest, neck, head, upperarm/forearm/hand, thigh/shin/foot (L/R).
- Tubuh dari Skin modifier + Subdivision level 2, kepala dan aksesori dari primitif, rambut dari cangkang bola yang dipotong mengikuti garis rambut per azimut.
- Bobot skin: dihitung dari jarak ke segmen tulang (2 tulang terdekat), aksesori kepala 100% ke `head`.
- Klip animasi dibuat sekali di `rig_clips.glb` dan dipakai semua karakter (nama tulang identik). Runtime hanya memakai track rotasi + translasi `hips`.
- Variasi tinggi lewat skala objek armature, bukan posisi sendi, supaya klip tetap pas.

### Menambah karakter
1. Tambah entri di `tools/blender/character_specs.json` (id, skin, hair, hair_color, top{t,c,c2,c3}, sleeve, pants, shoes, acc, height, build, shoulder, female).
2. `tools/blender/run.sh characters`.
3. Tambah entri di `office3d/public/data/staff.json` dan `agents` di `map.json` (spawn).

Gaya rambut: fringe, neat, sideswept, spiky, ponytail, bob, long, buzz, gray, curly, afro, hijab. Atasan: polo, jersey, denim, blazer, hoodie, cardigan, sweater, vest, labcoat, tshirt. Aksesori: glasses, glasses_round, headset, watch, backpack, mustache, earrings.

### Menambah klip
Tulis fungsi pose ber-dekorator `@clip("nama", panjang_frame)` di `characters.py`. Rotasi memakai `pose_rot(rig, tulang, [(sumbu, derajat), ...])` dengan sumbu ruang armature relatif orientasi rest.

## Furnitur
Tambah fungsi `@model("nama")` di `furniture.py` memakai kit `box`, `cyl`, `sph`, `torus`, `legs4`, `monitor`, `keyboard`, `mug`, `books`, `leaf_cluster`. Petakan tipe map ke model di `MAP_TYPES`. Arah default, kursi (`SEATS`), dan jenis layar (`SCREEN_KIND`) diatur di `src/scene/furniture.js`.

## Kompresi
`npm run assets:optimize` di `office3d`. Hasil terukur: 8.037 KB menjadi 2.199 KB untuk 86 GLB. Runtime memakai `MeshoptDecoder` dari three. Geometri furnitur di-dekuantisasi ke Float32 sebelum digabung per material.

## Anggaran
| Jenis | Segitiga | Catatan |
|---|---|---|
| Karakter | 10k sampai 17k | Mirza tertinggi (rambut keriting + ransel) |
| Furnitur | 36 sampai 3,5k | Rak buku 3k setelah bevel buku dimatikan |
| Total adegan | sekitar 336k | Diukur di tier low, 1280x800 |
