# 04 — Roadmap

Estimasi relatif: S (kecil) / M (sedang) / L (besar). Bukan estimasi waktu.

## Tahap 1 — Critical foundations ✅ SELESAI (2026-10-20)

- [x] F-01: sinkron progres/status tugas tasks.json → UI (S)
- [x] F-02: rate limiter anti-flush (S)
- [x] F-03: validasi agent_id di jalur Gemini (S)
- [x] F-04: teks status not_configured akurat (S)
- [x] F-10: .env.example (S)
- [x] Rebrand → Team Kreatif Agent AI Yazid (S)
- [x] Jam real-time WIB (S)
- [x] Tekstur prosedural + shader rim-light (M)

## Tahap 2 — Agent runtime & workflow (berikutnya)

| # | Item | Ukuran | Dependensi |
|---|------|--------|------------|
| 2.1 | Task engine minimal: state queued/assigned/running/blocked/completed/failed + transisi valid + persistensi JSON | M | — |
| 2.2 | Endpoint tulis tugas ber-otorisasi (drawer situs ↔ tasks.json sinkron dua arah) | M | 2.1 |
| 2.3 | Event runtime → status karakter 3D nyata ('working' hanya saat task running) | M | 2.1 |
| 2.4 | Approval gate untuk AKSI bot berisiko (redeploy/progres massal) | S | — |
| 2.5 | Retry/backoff terstruktur + idempotency key di jalur chat | S | — |
| 2.6 | Allowlist model di kantor-bridge (F-12) | S | — |

## Tahap 3 — Observability

| # | Item | Ukuran | Dependensi |
|---|------|--------|------------|
| 3.1 | Riwayat tugas + timeline eksekusi (siapa/apa/kapan/hasil) | M | 2.1 |
| 3.2 | Error center: kategori, konteks aman, retry | M | 2.5 |
| 3.3 | Usage/cost dari data provider nyata (OAuth usage endpoint) | S | — |
| 3.4 | Monitor kuota Gemini berkala + notifikasi Telegram saat pulih | S | — |

## Tahap 4 — UX & 3D

| # | Item | Ukuran | Dependensi |
|---|------|--------|------------|
| 4.1 | Sinkron label SIMULASI ↔ event nyata diperluas (ruangan sibuk saat task berjalan) | M | 2.3 |
| 4.2 | Ukur FPS/draw-call di perangkat nyata (bukan SwiftShader) | S | — |
| 4.3 | Aksesibilitas: fokus keyboard drawer, kontras chip status | S | — |

## Tahap 5 — Integrasi lanjutan

| # | Item | Ukuran | Dependensi |
|---|------|--------|------------|
| 5.1 | Bridge di serverless / tunnel alternatif (selesaikan F-07) | L | keputusan infra |
| 5.2 | Eksekusi skill dari browser via MCP (F-09) | L | 5.1 |
| 5.3 | Workflow builder visual — HANYA setelah engine 2.1 berjalan | L | 2.1 |
| 5.4 | Scheduler konten + reminder video mentah Telegram (lihat audit operasional) | M | bot handler media |

## Risiko roadmap

- Kuota provider (Claude/Gemini) adalah variabel eksternal — desain harus tahan gagal (sudah dimulai: fallback + status jujur).
- VM ephemeral: semua state runtime harus survive restart (watchdog ada; task engine baru wajib persist ke disk/repo).
- Jangan bangun workflow builder sebelum 2.1 (aturan brief §6).
