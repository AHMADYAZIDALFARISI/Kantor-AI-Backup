# 06 — Rencana Migrasi (Proposed — BELUM dijalankan)

## Ruang lingkup pemicu

Rencana ini aktif hanya bila salah satu pemicu di 05 terpenuhi. Sampai saat itu: **jangan migrasi.**

## Schema target (ringkas, relasional)

```sql
departments(id TEXT PK, label TEXT);
agents(id TEXT PK, name TEXT, department_id FK, kind TEXT /* lead|sub */, config JSONB);
agent_capabilities(agent_id FK, tag TEXT);
tasks(id UUID PK, agent_id FK, title TEXT, eta TEXT, progress INT CHECK 0..100, done BOOL,
      status TEXT /* queued|running|completed|... */, created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ);
task_events(id UUID PK, task_id FK, type TEXT, actor TEXT, payload JSONB, at TIMESTAMPTZ);
approvals(id UUID PK, task_id FK, action TEXT, state TEXT /* pending|approved|rejected */, decided_by TEXT, at TIMESTAMPTZ);
audit_logs(id UUID PK, actor TEXT, action TEXT, ref_type TEXT, ref_id TEXT, detail JSONB, at TIMESTAMPTZ);
```

## Langkah migrasi aman (wajib urut)

1. Dokumentasikan schema JSON & consumer (sudah: 00/01).
2. Backup tasks.json + snapshot repo v3.
3. Tulis mapper tasks.json → schema baru + fixture sanitasi; uji round-trip (progress & done identik).
4. Buat service layer tunggal (`api/_tasks.js`): validasi transisi status, append event.
5. Adapter baca: bot & web membaca lewat service (dual-read dari DB, JSON tetap ada).
6. Cutover tulis: bot menulis DB; web tetap snapshot build (tanpa tulis web dulu).
7. Verifikasi: jumlah & progres tugas identik; health tetap ok; ACC bot muncul di situs ≤1 menit.
8. Hapus tasks.json HANYA setelah cutover terverifikasi + persetujuan pemilik (aturan 8 brief).
9. Rollback: kembalikan tasks.json terakhir + redeploy; DB dimatikan (downtime tercatat).

## Larangan selama migrasi

- Dual-write tanpa rekonsiliasi (dilarang brief §8.4.9).
- Mengubah semua reader/writer sekaligus.
- Menyimpan secret di kolom DB (integrations menyimpan referensi env, bukan plaintext).
