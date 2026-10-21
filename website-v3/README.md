# Kantor KCSH 3D (v3)

Kantor 3D interaktif: 13 ruangan, 14 agen dengan karakter ber-rig dan 14 klip animasi, 72 model furnitur, chat ke backend AI lewat proxy server.

## Jalankan
```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # hasil di dist/
```
Tanpa server Vercel, `/api/*` tidak ada. Situs tetap jalan dan chip status menampilkan "AI tidak tersedia".

## Struktur
```
index.html, vite.config.js, vercel.json
api/            chat.js, health.js, _lib.js   (Vercel Functions, token di env server)
public/data/    map.json, staff.json, tasks.json, divisions.json, skills.json, room-categories.json
public/assets/  characters/*.glb (+rig_clips.glb), furniture/*.glb, manifest.json
scripts/        optimize-assets.mjs
src/
  integration/  bridge.js           lapisan 1: panggilan /api, event nyata
  state/        store.js, skills.js lapisan 2: state, rencana manual, klasifikasi skill
  behavior/     nav.js, agents.js   lapisan 3: A*, reservasi tile, FSM, jadwal ambient
  scene/        renderer, camera, environment, furniture, characters, screens   lapisan 4
  ui/           shell.js, skillsBrowser.js, styles.css                          lapisan 5
  main.js       bootstrap, loop tunggal, picking, keyboard, deep link
```

## Kontrol
Seret: putar. Klik kanan / dua jari: geser. Scroll / cubit: zoom. Klik agen: detail. Klik lantai ruangan: info ruangan (klik ganda: fokus).
Keyboard: `/` cari, `Q` `E` putar 45 derajat, `R` reset, `F` ikuti agen terpilih, `S` browser skill, `1`-`9` ruangan, `Tab` agen berikutnya, `Esc` tutup.
Deep link: `#char=qa_head`, `#room=lab_qa`.

## Sumber status
| Tampilan | Sumber |
|---|---|
| Chip "AI terhubung/offline" | `GET /api/health` tiap 30 detik (nyata) |
| Titik di avatar, "AI backend: Memproses/Membalas/Gagal" | Kejadian chat nyata |
| "Di kantor: ..." | Rutinitas simulasi, diberi label SIMULASI |
| Rencana kerja | Data contoh `tasks.json`, centang manual di browser |
| Angka di papan skill ruangan | `skills.json` + aturan `room-categories.json` (estimasi) |

Dokumen lain: `../docs/`.
