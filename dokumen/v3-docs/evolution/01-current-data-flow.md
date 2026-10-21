# 01 — Alur Data Saat Ini

## Alur tugas

```
PRODUCER (satu-satunya penulis global):
  Telegram (@AyasiGembulBot) → office_ops.py (AKSI: list/approve/add/set_progress)
    → tulis public/data/tasks.json di VM → Vercel CLI deploy → situs live baru

CONSUMER:
  Browser → fetch data/tasks.json (statis, snapshot saat deploy)
    → store.loadPlans(): {title, eta, progress, done}
    → drawer agen (daftar + bar progres), Papan Kerja (kanban turunan), papan 3D ruangan (agregat)
  Pengunjung dapat mencentang "done" → HANYA localStorage (perangkat sendiri, tidak kembali ke repo)
```

Karakteristik: single-writer (bot), read-mostly, tanpa concurrency conflict karena penulisan terpusat; "sinkronisasi" = redeploy (±20 detik). Tidak ada API tulis dari web.

## Alur chat

```
Drawer UI → POST /api/chat {agent_id, messages}
  → (a) BRIDGE_URL ada: kantor-bridge /v1/chat (bearer) → 9router → Claude/Gemini  [saat ini tidak aktif: tunnel mustahil]
  → (b) fallback: Gemini direct, persona dari api/_personas.js                     [aktif; kuota 429]
Health: GET /api/health tiap 30 dtk → chip status jujur.
```

## Alur organisasi

```
public/data/org.json (baru) → main.js muat bersama data lain → ctx.org
  → drawer lead menampilkan sub-agen + kapabilitas + chip runtime ("Belum terhubung runtime")
Sub-agen TIDAK memiliki jalur eksekusi — tidak ada event yang dipancarkan atas nama mereka.
```

## Alur 3D

```
map.json (rooms, pois, agents spawn) + staff.json → scene (environment/furniture/characters)
behavior/agents.js: jadwal ambient deterministik (simMinutes) → pose/animasi; label source 'ambient'
Event chat nyata → source 'backend' → titik avatar. Dua dunia tidak tercampur (by design, berlabel).
```

## Event model target (Proposed, belum diimplementasikan)

Sesuai brief §9: Telegram/UI/Scheduler → Validated API → Task Service → Persistent Store → Domain Events → Board UI + 3D. Sprint ini baru menyiapkan registry (org) dan proyeksi baca (board); task service & event log belum ada — lihat 06-migration-plan.
