# 13 — Desain Teknis Delegasi Sub-Agent (Proposed — belum diimplementasikan)

## Prinsip

Delegasi harus berjalan di tempat runtime nyata sudah hidup, memakai jalur tulis yang sudah terbukti, dan tidak menciptakan penulis kedua. Tidak ada task engine besar; satu modul orchestrator kecil di VM.

## Pilihan arsitektur: Orchestrator di VM (di dalam proses bot)

| Opsi | Penilaian |
|---|---|
| **A. Modul di proses bot Telegram (VM)** ✅ DIPILIH | Runtime persisten, akses 9router/bridge lokal, penulis tasks.json yang sama (tidak ada konflik tulis), jalur ACC Telegram sudah ada untuk approval |
| B. Vercel Function sebagai orchestrator | Stateless, batas 60 dtk, tanpa akses bridge (tunnel mustahil) — tidak layak untuk delegasi multi-langkah |
| C. Worker terpisah di VM | Proses + supervisor baru; manfaat tidak sebanding untuk skala saat ini; dapat diekstrak dari A nanti |

## Alur delegasi (Fase D1 — cakupan minimal aman)

```
Pemilik (Telegram): "delegasikan <instruksi> ke <lead>"
  → bot: buat Run (idempotency key = hash(chat_id+message_id))
  → Lead (panggilan LLM via 9router, persona staff.json): pecah instruksi jadi usulan subtask
  → Validasi server-side terhadap org.json:
      sub_agent harus milik lead tsb; capability yang diminta harus ada di profil sub-agent;
      tool di luar allowlist → subtask ditolak / run menunggu approval
  → Subtask dieksekusi berurutan (D1: HANYA generasi teks — tanpa tool tulis/eksternal)
      setiap subtask = 1 panggilan LLM dengan persona sub-agent
  → Lead memvalidasi & mensintesis hasil (panggilan LLM kedua)
  → Hasil disimpan; bot membalas ringkasan ke pemilik
  → Progres parent di tasks.json diperbarui LEWAT jalur AKSI yang ada (penulis tunggal terjaga)
  → Redeploy ter-batch (maks 1×/run selesai atau 1×/menit) untuk mempublikasikan status ke situs
```

## Kontrak data

### Run & Subtask — file baru `delegations.json` (di repo, diterbitkan seperti tasks.json)

```jsonc
{
  "runs": [{
    "id": "run_<ulid>",
    "parent": { "agent_id": "qa_head", "task_ref": "qa_head:audit-keamanan-endpoint-api" },
    "instruction": "…",
    "status": "running",               // state machine di bawah
    "idempotency_key": "tg:7981272264:12345",
    "created_at": "…", "updated_at": "…",
    "subtasks": [{
      "id": "sub_<ulid>", "sub_agent_id": "qa_pentest",
      "capability": "security-testing", "instruction": "…",
      "status": "completed", "attempts": 1,
      "result": { "summary": "…", "artifacts": [] },
      "error": null, "started_at": "…", "ended_at": "…"
    }],
    "synthesis": { "summary": "…" }
  }]
}
```

### Identitas tugas parent (perbaikan skema tasks.json, aditif)

`id` stabil = `"<agent_id>:<slug(judul)>"` diturunkan, bukan disimpan (judul tidak pernah diubah bot — tidak ada aksi rename). Bila kelak judul bisa diubah, simpan `id` eksplisit. Field aditif lain yang disarankan saat implementasi: `kind`, `source`, `updated_at` (lihat dok 11) — semua diabaikan aman oleh pembaca lama.

### State machine (run & subtask)

```
queued → planning → assigned → running → completed
                              ↘ blocked → running (setelah blocker lepas)
                              ↘ retrying → running (attempts < 3)
                              ↘ failed (terminal) | cancelled (terminal, dari status non-terminal mana pun)
running → waiting_approval → running (ACC pemilik) | cancelled (ditolak)
```

Transisi di luar tabel ditolak oleh orchestrator (validasi satu tempat).

## Handoff, retry, timeout, cancellation, validasi hasil

- **Handoff:** output subtask = `{summary, artifacts[]}` tervalidasi JSON-schema ringan (panjang maks, tipe) sebelum diteruskan; sintesis lead menerima hanya output valid.
- **Retry:** maks 2 retry (total 3 attempt), backoff 5s→20s, HANYA untuk error provider (429/5xx/timeout). Error validasi/kapabilitas: langsung `failed` (retry tidak membantu).
- **Timeout:** 90 dtk per panggilan LLM subtask; 240 dtk per run — lewat itu subtask `failed` dengan error `timeout`.
- **Cancellation:** perintah bot "batalkan run <id>" → status `cancelled`; panggilan yang sedang terbang dibiarkan selesai tetapi hasilnya dibuang (provider tidak mendukung cancel kooperatif — dinyatakan apa adanya).
- **Validasi hasil:** lead memeriksa kelengkapan terhadap instruksi (panggilan LLM penilai terpisah, keluaran wajib JSON `{ok, notes}`); gagal 1× → subtask diulang dengan catatan; gagal 2× → run `blocked` menunggu pemilik.

## Tool & approval

- D1: **tanpa tool tulis/eksternal** — sub-agent hanya menghasilkan teks. Allowlist di org.json ditegakkan server-side (orchestrator menolak capability/tool di luar daftar).
- Fase berikutnya: tool baca (MCP ArtCraft read-only via bridge) → tetap tanpa approval; tool tulis/eksternal apa pun → `waiting_approval` + ACC pemilik di Telegram (memakai pola persetujuan yang sudah dikenal pemilik).

## Sinkronisasi VM → website

- D1 memakai kanal yang sudah terbukti: file `delegations.json` di repo → redeploy ter-batch → situs memuatnya saat boot (sama seperti tasks.json). Latensi jujur: detik–menit, bukan realtime.
- Situs menampilkan riwayat run per agen (drawer) dengan label waktu `updated_at` — tidak mengaku realtime.
- Kanal realtime (SSE/WebSocket/polling API) ditunda: membutuhkan tunnel/serverless bridge yang saat ini mustahil (F-07 audit).

## Anti-duplikasi & konflik tulis

- Satu penulis untuk kedua file: proses bot (tasks.json via office_ops yang ada; delegations.json via orchestrator dalam proses yang sama, dikunci `asyncio.Lock`).
- Idempotency key dari message Telegram mencegah run ganda akibat redelivery.
- Transisi status divalidasi terhadap state machine; event lama tidak dapat menimpa status lebih baru karena penulisan serial dalam satu proses.

## Kapan tasks.json tidak lagi memadai (pemicu migrasi — mengacu dok 05/06)

1. Situs harus MEMULAI delegasi (butuh jalur tulis web → penulis kedua).
2. Riwayat run/subtask perlu dicari/difilter server-side (> beberapa ratus run).
3. >1 proses runtime menulis bersamaan.
4. Approval multi-orang / audit trail formal dibutuhkan.
Saat pemicu pertama terpenuhi: jalankan 06-migration-plan (Postgres) untuk tabel tasks/runs/events; org.json tetap file konfigurasi.

## Roadmap implementasi (setelah persetujuan)

| Tahap | Isi | Ukuran |
|---|---|---|
| D0 | Skema aditif tasks.json (kind/source/updated_at via bot) + label "data contoh" di Papan Kerja | S |
| D1 | Orchestrator modul di bot: run/subtask teks-saja, validasi org.json, simpan delegations.json, tampilkan di drawer situs | M |
| D2 | Tool baca MCP untuk sub-agent tertentu + approval gate untuk tool tulis | M |
| D3 | Inisiasi dari situs (butuh kanal tulis web — kemungkinan bersamaan migrasi DB) | L |
