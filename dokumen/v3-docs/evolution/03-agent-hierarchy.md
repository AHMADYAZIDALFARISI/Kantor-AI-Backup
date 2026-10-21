# 03 — Hierarki Agen (Implementasi Sprint Ini)

## Model

Workspace (Team Kreatif Agent AI Yazid) → 13 Divisi/Ruangan → 14 Lead Agent (staff.json) → **25 Sub-Agent (org.json, baru)** → Task (tasks.json).

## Registry: `office3d/public/data/org.json`

Schema per sub-agent (mengikuti brief §5.3):

```json
{ "id": "qa_pentest", "name": "Uji Penetrasi", "role": "Pengujian keamanan",
  "desc": "...", "capabilities": ["security-testing", "..."],
  "tools": ["kantor-bridge (MCP)", "9router"], "runtime": "not_connected" }
```

- `runtime` hanya punya label yang dirender UI dari `runtime_labels` — tidak ada klaim aktif.
- Provider/model per sub-agent: **tidak diketahui/belum dikonfigurasi** → tidak ditampilkan (sesuai aturan: jangan mengarang).

## Daftar sub-agent per lead

| Lead (divisi) | Sub-agen |
|---|---|
| Yazid — Lab QA | Uji Penetrasi · Review Kode QA · Laporan Keamanan |
| Faris — Direksi | Analis Laporan · Notulen & Keputusan |
| Mirza — Studio Kreatif | Desainer Visual · Editor Video · Copywriter Kreatif |
| Ayasi — Engineering | Frontend Developer · Backend & API · DevOps & Deploy |
| Sofia — Riset | Penemu Sumber · Fakta & Verifikasi · Sintesis Riset |
| Fiqih — Redaksi | Perencana Konten · Penulis Naskah · Review Editorial |
| Nadia — Growth | Riset Tren TikTok · Analis Kampanye |
| Rara — Lobby | Direktori & Informasi · Penyambut Tamu |
| Pak Wiryo — Arsip | Katalog & Arsip · Pos Komunikasi |
| Laras — Spesialis | Spesialis Otomasi · Integrasi API |

4 staf umum (Ridwan, Abbas, Malik, Ibed) tidak memiliki sub-agen — mereka staf pelaksana di bawah koordinasi lead ruangan terkait.

## Lifecycle (status saat ini vs target)

- Status task di UI diturunkan dari progres: `queued`(0%) / `running`(1–99%) / `completed`(done) — pemetaan terdokumentasi di panel Papan Kerja.
- Status penuh brief (planning/assigned/waiting_approval/blocked/retrying/failed/cancelled): **Not Implemented** — memerlukan task engine (roadmap Tahap 2 di docs/audit/04).
- Delegasi lead→sub-agent yang menciptakan parent/child task: **Not Implemented** — sub-agent masih konfigurasi; tidak ada runtime yang mendelegasikan apa pun. Ini disengaja: membangun delegasi palsu melanggar aturan 10 brief.
