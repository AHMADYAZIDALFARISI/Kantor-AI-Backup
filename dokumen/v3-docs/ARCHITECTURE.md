# Architecture

## Saat ini (commit c4e63a3)

```
Browser (Vercel static)                       Mesin pengguna
┌──────────────────────────────────┐          ┌─────────────────────────────┐
│ index.html + importmap (unpkg)   │          │ kantor-bridge (127.0.0.1)   │
│  main.js                         │  HTTPS   │  /v1/chat ──> 9router       │
│   data.js ── data/*.json         │ ───────> │  /v1/mcp/* ─> ArtCraft MCP  │
│   world3d.js (renderer+loop #1)  │ cloudflared                            │
│   furniture*.js                  │  Bearer token dari data/bridge.json    │
│   characters.js                  │          └─────────────────────────────┘
│   simulation.js (store, A*, sim) │
│   interaction.js                 │
│   ui-drawer / ui-dash / ui-skills│
│  main.tick() (loop #2)           │
└──────────────────────────────────┘
```

Masalah struktural:
- Lapisan data, simulasi, dan status tercampur di `simulation.js`. Store menyimpan status visual dan status "tugas" dalam objek yang sama.
- Render loop di `world3d.js`, update di `main.js`.
- UI membaca store lalu menulis ulang DOM penuh tiap emit.
- Kredensial backend dikirim ke klien.

## Target (diusulkan, menunggu persetujuan)

```
src/
  integration/   Lapisan 1: bridgeClient.js (via /api proxy), healthMonitor.js
  state/         Lapisan 2: store.js (agents, tasks, selection, ui), selectors
                 sumber: 'backend' | 'ambient'  <- wajib di setiap status
  behavior/      Lapisan 3: navGrid.js (A* + binary heap), agentFSM.js,
                 scheduler.js (deterministik, seed per agen), stateMap.js
  scene/         Lapisan 4: renderer.js (1 loop), cameraRig.js, environment.js,
                 furnitureLib.js (GLB + instancing), characterRig.js
                 (SkinnedMesh + AnimationMixer + crossfade), quality.js
  ui/            Lapisan 5: shell, agentList, agentPanel, cameraPresets,
                 skillsBrowser; render granular, bukan innerHTML penuh
api/
  chat.js        Vercel Function: proxy ke tunnel, token di env server
public/assets/   characters/*.glb, furniture/*.glb, environment/*.glb, textures/*.ktx2
tools/blender/   skrip headless pembuat aset (versi terkontrol)
```

Aturan:
1. Scene tidak pernah menjadi sumber kebenaran status AI.
2. Setiap status yang tampil membawa label sumber. Status `ambient` diberi tanda "simulasi" di UI.
3. Satu render loop. Update frekuensi tinggi (gerak, mixer) di loop, bukan di store.
4. Token hanya di server (`api/`), tidak pernah di `public/` atau bundle.

## Pemetaan status backend ke visual (draf)

Backend saat ini hanya menyediakan kejadian chat dan health. Tabel ini hanya memakai kejadian yang benar-benar ada.

| Kejadian nyata | State visual | Sumber |
|---|---|---|
| `/health` gagal | Semua agen `offline` (desaturasi, ikon awan) | backend |
| Chat dikirim ke agen X, menunggu `/v1/chat` | X `walking_to_desk` lalu `working` (mengetik) | backend |
| `/v1/chat` sukses | X `talking` 3 detik, lalu kembali | backend |
| `/v1/chat` gagal / 429 / 502 | X `error` (gestur bingung, badge merah) | backend |
| `/v1/mcp/call` berjalan / selesai / gagal | `working` / `task_completed` / `error` | backend (bila UI memakainya) |
| Tidak ada kejadian | Rutinitas ambient: duduk, rapat, pantry | ambient, berlabel simulasi |

Progres tugas di `tasks.json` dipertahankan sebagai **data rencana** yang dapat dicentang pengguna, tanpa kenaikan otomatis.
