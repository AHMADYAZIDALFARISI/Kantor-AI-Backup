# Kantor KCSH — 3D Office (v2)

Rebuild total kantor-kcsh ala game **Startup Company**: geometri 3D asli
(low-poly prosedural), bukan billboard pixel. Arsitektur oleh Claude Opus 5.5
via 9router; implementasi mengikuti keputusan arsitektur tersebut.

## Struktur

- `index.html` — shell + importmap (three r160 via unpkg CDN)
- `index-test.html` — versi uji lokal (three via `vendor-test/`, JANGAN di-deploy)
- `js/main.js` — bootstrap
- `js/data.js` — load JSON (map, staff, tasks, divisions, builders)
- `js/world3d.js` — renderer, kamera isometric orthographic, lampu + shadow,
  13 ruangan (lantai + dinding cutaway), label ruangan
- `js/furniture.js` + `furniture-builders-a/b.js` — 15 builder parametrik
  (desk, chair, table, sofa, shelf, plant, board, screen, kitchen, gym, tech,
  decor, studio, reception, mail) → 144 penempatan dari map.json
- `js/characters.js` — 14 figur low-poly + animasi prosedural
  (idle/walk/work/talk/rest)
- `js/simulation.js` — store pub/sub, A* pathfinding di grid 64×46,
  state machine agen (idle → walk → work/talk/rest via 61 POI),
  progres tugas menick tiap tick
- `js/interaction.js` — raycast picking (klik < 6px), hover highlight,
  selection ring
- `js/ui-drawer.js` — panel kanan: karakter (avatar, jabatan, status,
  tugas + checkbox tersimpan di localStorage) & furniture
- `js/ui-dash.js` — dashboard progres 13 divisi (ring SVG), search (/),
  keyboard (Tab/D/F/1-9/Esc), deep-link hash (#char= / #room=)
- `js/ui-skills.js` — browser 729 skill & agen hasil panen (446 skill + 283
  definisi agen): overlay searchable + filter jenis/kategori, tombol "Skills (S)"
- `data/` — staff.json, tasks.json, divisions.json, map.json,
  furniture-builders.json, room-palette.json, skills.json (729 item)
- `assets/characters/sheets/` — sprite sheet untuk avatar panel

## Uji lokal

```
cd ~/workspace/kantor-kcsh/office3d
python3 -m http.server 8902
# buka http://127.0.0.1:8902/index-test.html
```

## Deploy

Deploy `index.html` + `js/` + `data/` + `assets/` ke Vercel (project
kantor-kcsh, team ayasi). JANGAN sertakan `vendor-test/` dan
`index-test.html`. Butuh token Vercel bercakupan team (satu pakai).
**Saat deploy, suntik `data/bridge.json`**: `url` = public https tunnel ke
kantor-bridge, `token` = isi `~/workspace/kantor-bridge/.token`.
Tanpa itu, chat AI tampil "offline" (simulasi tetap jalan).

## Backend AI (kantor-bridge)

`~/workspace/kantor-bridge/bridge.py` — HTTP API ber-auth (127.0.0.1:20129,
token di `.token`), disupervisi via `supervise-agents.sh`:
- `POST /v1/chat` {agent_id, messages, model?} → 9router (default
  `cc/claude-haiku-4-5-20251001`), persona per staf dari staff.json.
  Rate limit 30/jam/IP, max_tokens 600.
- `POST /v1/mcp/tools` {app} → daftar tools ArtCraft (cache 1 jam).
- `POST /v1/mcp/call` {app, name, arguments} → eksekusi tool ArtCraft.
  Rate limit 10/jam/IP.
Dipublikasikan via cloudflared tunnel (butuh token tunnel dari user).
Panel karakter punya seksi "Chat dengan {nama}" → panggil bridge.

## Catatan arsitektur (Opus 5.5)

`docs/` di repo induk menyimpan 18 keputusan arsitektur. Poin penting:
pixel aset hanya dipakai sebagai sumber warna & avatar, bukan tekstur 3D;
1 tile = 1 unit; koordinat map dalam pixel (/16 = tile).
