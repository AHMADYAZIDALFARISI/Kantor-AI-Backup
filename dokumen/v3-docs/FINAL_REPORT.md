# Final Report: Kantor KCSH v3 (3D HD Rebuild)

Branch: `feat/3d-hd-rebuild`, dari `c4e63a3` (`main` tidak diubah, backup tetap bisa dipulihkan).

## 1. Ringkasan
Kantor 3D dibangun ulang dengan aset buatan Blender (14 karakter ber-rig, 14 klip animasi, 72 model furnitur), arsitektur 5 lapisan, proxy API yang menyimpan token di server, dan pemisahan tegas antara status nyata dan simulasi. Uji otomatis: 35/35 lulus (bagian 6).

## 2. Perubahan arsitektur
| Sebelum (v2) | Sesudah (v3) |
|---|---|
| three r160 dari unpkg lewat importmap, tanpa build | three 0.180.0 dibundel Vite, font di-host sendiri |
| Token bridge disuntik ke `data/bridge.json` (publik) | `api/chat.js` + `api/health.js` (Vercel Functions), token di env server |
| `simulation.js` mencampur status visual dan progres tugas | `integration/` → `state/` → `behavior/` → `scene/` → `ui/` |
| 2 loop requestAnimationFrame | 1 loop, update frekuensi tinggi di luar store |
| UI menulis ulang innerHTML tiap 2 detik | Patch granular per elemen |
| Kamera orthographic, rotasi dimatikan | Perspective 30 derajat, orbit terbatas, preset, fokus, ikuti, reset |

Kontrak yang dipertahankan: skema `map.json`, `staff.json`, `divisions.json`, `skills.json`, API `kantor-bridge` (tidak diubah), deep link `#char=` dan `#room=`, shortcut keyboard, localStorage `gembul-tasks`, `window.__office`.

## 3. Perbaikan visual utama
- Karakter: dari 7 primitif tanpa wajah menjadi tubuh menyatu dengan wajah, rambut berbentuk (12 gaya), pakaian berlapis, aksesori. Tiga karakter foto mempertahankan ciri pakaian dan rambut.
- Furnitur: 15 builder generik menjadi 72 model khusus. Gym kini punya treadmill, sepeda, rak dumbbell, bench press, samsak, matras. Item dinding (whiteboard, TV, papan) kini dibangun.
- Lingkungan: koridor, dinding tebal dengan skirting dan cap, kusen pintu, jendela kaca, alas diorama, tekstur lantai per ruangan, rambu nama di lantai.
- Cutaway dinding otomatis mengikuti arah kamera.
- Shadow bekerja (dulu tidak pernah dirender), neutral tone mapping, lampu status emissive, layar monitor beranimasi.

## 4. Animasi dan perilaku
- Klip: idle, walk, sit, type, talk, listen, crossed, think, point, wave, celebrate, error, rest, phone. Crossfade 0,28 s.
- Gerak: A* binary heap, akselerasi dan perlambatan, rotasi halus ke arah tujuan, timeScale langkah mengikuti kecepatan.
- Duduk: 41 kursi terdeteksi dari furnitur. Agen duduk tepat di kursi dengan arah hadap benar, satu kursi satu agen.
- Antar-agen: reservasi tile, menunggu lalu mencari jalur alternatif.
- Jadwal ambient deterministik (seed per agen): kerja, kopi 10.00, makan 12.00, rapat kepala 13.00, gym 17.00, istirahat malam.

## 5. Pemetaan status backend ke visual
| Kejadian nyata | Visual | Label UI |
|---|---|---|
| `/api/health` ok | Chip hijau "AI terhubung" | NYATA |
| `/api/health` 503 not_configured | Chip "AI belum dikonfigurasi" | NYATA |
| `/api/health` gagal / tidak ada | Chip "AI offline" / "AI tidak tersedia" | NYATA |
| Chat dikirim ke agen X | X berjalan ke mejanya dan mengetik, titik kuning | NYATA |
| Chat dibalas | X berdiri, animasi talk, titik hijau | NYATA |
| Chat gagal | X animasi error, titik merah, pesan error asli | NYATA |
| Tidak ada kejadian | Rutinitas ambient | SIMULASI |

Progres tugas otomatis dihapus. Rencana kerja hanya berubah lewat centang manual. Angka papan skill berasal dari `skills.json` dengan aturan `room-categories.json`, diberi label estimasi.

## 6. Hasil uji (benar-benar dijalankan)
Lingkungan uji: Linux, 1 CPU, 3 GB RAM, tanpa GPU, Chromium + SwiftShader (WebGL software), tier kualitas "low". `/api/*` disimulasikan lewat route interception Playwright.

- `tools/e2e.py`: **35/35 lulus** pada run terakhir (`docs/screenshots/results.json`, screenshot 01 sampai 05). Satu kegagalan di run sebelumnya ternyata bug di skrip uji (Playwright memanggil fungsi unsubscribe yang dikembalikan `evaluate`), bukan bug aplikasi. Urutan event yang benar sudah diverifikasi terpisah: `thinking/backend/walking` lalu `replied/backend`.
- Proxy API diuji dengan Node + bridge tiruan: 503 tanpa env, health ok, chat ok dengan model dari server (model dari klien diabaikan), GET ditolak 405, `agent_id` buruk 400, token salah 502, rate limit per IP (200, 200, 429, 429 untuk limit 2).
- `npm run build` sukses (Vite 6.3.5).

## 7. Performa (terukur, bukan janji)
| Metrik | v2 baseline | v3 |
|---|---|---|
| Draw call (desktop 1280x800) | 396 | 228 |
| Draw call furnitur | 288 | 44 |
| Segitiga | 32k | sekitar 336k |
| Ukuran GLB | 0 | 2,2 MB (dari 8,0 MB sebelum meshopt) |
| Total `dist/` | - | sekitar 3,9 MB |
| Bundle JS (gzip) | CDN | 50 KB app + 182 KB three |
| Boot sampai siap (lokal, SwiftShader) | 0,5 s | 5,6 s |

FPS di lingkungan uji tidak bermakna (render perangkat lunak 1 CPU). **FPS di GPU nyata belum diukur.** Panel Pengaturan menampilkan fps, draw call, dan segitiga secara langsung; ukur di perangkat target setelah deploy. Kualitas otomatis menurunkan tier bila rata-rata di bawah 32 fps selama 4 detik.

Kenaikan segitiga berasal dari karakter (sekitar 170k untuk 14 karakter). Bila mobile kelas bawah tersendat, langkah berikut adalah LOD karakter (decimate 50%) untuk jarak jauh.

## 8. Keterbatasan yang diketahui
1. FPS GPU nyata belum diukur (lihat bagian 7).
2. Rambut berupa cangkang padat, belum ada helaian. Tangan berbentuk sarung (stylized), belum ada jari terpisah.
3. Tidak ada IK kaki. Foot sliding kecil mungkin terlihat saat agen melambat sebelum berhenti.
4. Wajah tanpa blendshape ekspresi. Ekspresi disampaikan lewat postur dan gerak kepala.
5. Satu tekstur layar dibagi rata untuk semua monitor dalam satu model (monitor ganda berbagi satu gambar).
6. Rate limit proxy bersifat per instance serverless.
7. Klasifikasi skill per ruangan adalah heuristik kata kunci.
8. Situs live lama belum diverifikasi dari lingkungan ini. Rotasi token bridge wajib setelah deploy (lihat DEPLOY_MUSE.md bagian 7).
9. Skill eksternal (blender-web-3d, Three.js package) dievaluasi dan dipakai sebagai referensi metode. Tidak ada skill yang dipasang ke konfigurasi Claude pengguna karena pekerjaan ini berjalan di sandbox chat, bukan di Claude Code lokal.

## 9. Deploy
Lihat `docs/DEPLOY_MUSE.md`.

## 10. Langkah berikutnya yang disarankan
1. Ukur FPS di laptop dan ponsel target, sesuaikan ambang tier.
2. LOD karakter dan shadow karakter terpisah dari shadow statis (bake shadow furnitur).
3. Endpoint status tugas di `kantor-bridge` (misalnya `/v1/agents/status`) supaya aktivitas kantor bisa berasal dari data nyata, bukan simulasi.
4. Tekstur layar per monitor dan helaian rambut kartu (hair cards) untuk close-up.
