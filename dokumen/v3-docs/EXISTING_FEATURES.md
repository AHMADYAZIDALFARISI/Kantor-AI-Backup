# Existing Features

Status: **OK** berjalan, **RUSAK** ada bug terverifikasi, **SIMULASI** tampil tapi tidak berasal dari backend, **TIDAK DIUJI** butuh infrastruktur pengguna.

| Fitur | File | Status | Catatan |
|---|---|---|---|
| Load data JSON paralel + fallback | `data.js` | OK | 7 file |
| `sampleRoomColors()` | `data.js` | Tidak dipakai | Kode mati, aman dihapus |
| Kamera isometrik orthographic, pan, zoom 0,5 sampai 3 | `world3d.js` | OK | Rotasi dimatikan |
| Fokus kamera ke ruangan | `world3d.js fitCameraToRoom` | OK | Tanpa transisi halus |
| 13 ruangan: lantai + 2 dinding cutaway + 2 sill | `world3d.js` | OK | Tanpa koridor (B7) |
| Label ruangan sprite | `world3d.js` | OK | Selalu tampil, menumpuk |
| Shadow matahari | `world3d.js` | RUSAK | B1 |
| 144 furniture prosedural, 15 builder | `furniture*.js` | Sebagian | B5, B6 |
| 14 figur low-poly | `characters.js` | OK | Primitif, tanpa wajah |
| Animasi prosedural idle/walk/work/talk/rest | `characters.js` | OK | Rotasi lengan/kaki saja |
| A* pathfinding grid 64x46 | `simulation.js` | OK | |
| State machine agen via 61 POI | `simulation.js` | SIMULASI | Tujuan acak |
| Progres tugas otomatis | `simulation.js` | SIMULASI | D1, data palsu tampil nyata |
| Store pub/sub | `simulation.js` | OK | Emit tiap 2 s memicu re-render penuh |
| Raycast picking, hover, cincin seleksi | `interaction.js` | OK | |
| Drawer karakter: avatar, status, tugas, checkbox | `ui-drawer.js` | Sebagian | Status SIMULASI, checkbox tersimpan di localStorage |
| Drawer furniture | `ui-drawer.js` | OK | "Status: Tersedia" statis |
| Chat per staf ke bridge | `ui-drawer.js`, `bridge.py` | RUSAK + TIDAK DIUJI | B2; backend butuh tunnel pengguna |
| Dashboard progres 13 divisi | `ui-dash.js` | SIMULASI | Angka dari D1 |
| Pencarian staf/furniture `/` | `ui-dash.js` | OK | |
| Shortcut Tab, D, F, 1-9, Esc | `ui-dash.js` | OK | |
| Deep-link `#char=`, `#room=`, `#furn=` | `ui-dash.js` | OK | `#furn=` ditulis tapi tidak dibaca |
| Browser 729 skill/agen | `ui-skills.js` | OK | Maks 120 hasil tampil |
| Bridge `/health` | `bridge.py` | TIDAK DIUJI | |
| Bridge `/v1/chat` ke 9router | `bridge.py` | TIDAK DIUJI | Persona per staf dari `staff.json` |
| Bridge `/v1/mcp/tools`, `/v1/mcp/call` | `bridge.py` | TIDAK DIUJI | Tidak dipakai UI saat ini |

## Kontrak yang wajib dipertahankan

- Skema `data/map.json`: `rooms[].rect_tiles`, `furniture[]{name,x,y,w,h,room,wall,z}`, `pois[]{room,x,y,anim,tag,who}`, `agents[]{id,room,spawn,role}`, `collision[]` (string `.`/`#`). 1 tile = 16 px = 1 unit dunia.
- `data/staff.json`: `id`, `name`, `title`, `room`, `palette`, `sheet`. `bridge.py` membaca file ini untuk persona.
- `data/divisions.json`: `id`, `label`, `rect`. Dibaca `bridge.py`.
- API bridge: `POST /v1/chat {agent_id, messages, model?} -> {reply}`, header `Authorization: Bearer`.
- `data/skills.json`: `{name, repo, cat, desc, path, kind}`.
- `window.__office` dipakai untuk debug/otomasi.
- localStorage key `gembul-tasks`.
