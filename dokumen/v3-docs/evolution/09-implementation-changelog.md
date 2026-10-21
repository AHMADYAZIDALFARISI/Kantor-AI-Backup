# 09 — Changelog Implementasi (Sprint Evolusi, 2026-10-20)

## Ditambahkan

| File | Perubahan |
|------|-----------|
| `office3d/public/data/org.json` (baru) | Registry organisasi: 10 lead → 25 sub-agen (id, nama, peran, deskripsi, kapabilitas, label tool, `runtime: "not_connected"` + label jujur) |
| `office3d/src/ui/boardPanel.js` (baru) | Panel Papan Kerja: kanban 3 kolom dari tasks.json, filter ruangan, klik kartu → buka drawer agen, catatan pemetaan status, state kosong |
| `docs/evolution/00..10` (baru) | Dokumentasi evolusi lengkap |

## Diubah

| File | Perubahan |
|------|-----------|
| `office3d/src/main.js` | Muat org.json; agregat tugas per ruangan → caption papan 3D; `ctx.org` + `ctx.openBoard`; buat board panel |
| `office3d/src/ui/shell.js` | Tombol topbar "Papan Kerja"; seksi Sub-agen di drawer lead (chip status runtime jujur) |
| `office3d/src/ui/styles.css` | Gaya panel board (.board-ov dsb.), kartu (.bcard), sub-agen (.sub/.cap/.stchip) |

## Tidak diubah (sengaja)

- tasks.json: format & isinya tidak disentuh (aturan 4 brief).
- api/*, kantor-bridge, bot Telegram: tidak ada perubahan perilaku.
- Engine/gaya visual 3D: dipertahankan.

## Status deploy

**SUDAH di-deploy** 2026-10-20 12:56 WIB atas persetujuan pemilik (termasuk perbaikan F-INT-04 + D0/D1). Terverifikasi live: build index-zzAOX3ag.js.

## Tahap validasi (2026-10-20, sesudah changelog di atas)

| File | Perubahan |
|------|-----------|
| `docs/evolution/11-data-validation-report.md` (baru) | Audit asal-usul & kualitas 42 tugas |
| `docs/evolution/12-board-hierarchy-interaction-audit.md` (baru) | Audit interaksi panel + hierarki (10 skenario) |
| `docs/evolution/13-delegation-design.md` (baru) | Desain delegasi + kontrak data + roadmap D0–D3 |
| `docs/evolution/14-room-validation.md` (baru) | Validasi ruangan 3D per ruangan |
| `office3d/src/main.js` | F-INT-04: org.json opsional di loadData (perbaikan bug boot) |

Data `tasks.json` TIDAK diubah pada tahap ini. Tidak ada deploy.

## Tahap D0–D1 (2026-10-20)

- D0: `tasks.json` + field `kind:"sample"` (aditif, nilai utuh); `office_ops._stamp()` menandai mutasi bot sebagai operasional; chip "Contoh" di situs; store meneruskan `kind`.
- D1: `delegation.py` di bot + perintah Telegram (dok 15). Uji live 1 run: failed 503 (kuota Claude) — jujur tercatat. Label runtime sub-agen tetap not_connected hingga run sukses pertama.
