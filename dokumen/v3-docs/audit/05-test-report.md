# 05 — Laporan Pengujian

**Tanggal:** 2026-10-20 · **Lingkungan:** VM Linux, Node 24, Chromium headless (SwiftShader), curl live.

## Hasil

| # | Test | Perintah/metode | Hasil | Bukti |
|---|------|-----------------|-------|-------|
| T1 | Build produksi | `cd office3d && npm run build` | **PASS** | `✓ built in 3.13–3.50s`, dist 3.9 MB (index.html, assets/, data/) |
| T2 | Sintaks fungsi API | `node --check api/{chat,health,_lib,_personas}.js` | **PASS** | semua exit 0 |
| T3 | Logika rate limiter (F-02) | probe Node: `rateOk('1.1.1.1', 2)` ×3 | **PASS** | true, true, false |
| T4 | Render headless build lokal (setara subset e2e) | Node playwright-core + SwiftShader, muat `dist/` | **PASS** | canvas=1, `window.__office` siap, 14 agen, 0 error konsol aplikasi |
| T5 | Integrasi progres tugas (F-01) | evaluasi DOM/state di T4 | **PASS** | `plans.qa_head[0].progress=55`, `[2].progress=80` (sebelum fix: field hilang) |
| T6 | Jam WIB real-time | evaluasi `#clock` di T4 (build sebelumnya) | **PASS** | label "WIB", nilai bergerak per detik (HH:MM:SS Asia/Jakarta) |
| T7 | Rebrand ter-render | evaluasi title + brand di T4 | **PASS** | "Team Kreatif Agent AI Yazid" di `<title>` & header |
| T8 | e2e bawaan repo | `npm run test:e2e` (`python3 ../tools/e2e.py`) | **BLOCKED** | `ModuleNotFoundError: No module named 'playwright'` — butuh `pip install playwright` + `playwright install chromium` (persetujuan instalasi belum diberikan) |
| T9 | Situs live | `curl -o /dev/null -w %{http_code}` | **PASS** | HTTP 200 |
| T10 | Health live | `curl /api/health` | **PASS** | `{"ok":true,"backend":"gemini"}` |
| T11 | Chat live | `POST /api/chat {agent_id:"qa_head"}` | **BLOCKED (eksternal)** | `429 gemini_http_429` — kuota Google untuk key baru; infrastruktur terbukti terhubung (health PASS) |
| T12 | Kebocoran secret di bundle | grep pola key/token di `dist/` | **PASS** | tidak ada token/key; cocok hanya nama skill ("task-coordination", "risk-assessment") |
| T13 | `/data/bridge.json` publik | `curl` | **PASS** | HTTP 404 (token tidak lagi bisa bocor dari file statis) |
| T14 | Bridge lokal | `curl 127.0.0.1:20129/health` | **PASS** | `{"ok": true}` |
| T15 | Bot Telegram tunggal | `pgrep -f super_bot.py` | **PASS** | 1 proses (setelah F-11) |

## Skenario brief §11 yang BELUM dijalankan

- Agent gagal & retry terbatas: **NOT RUN** (tidak ada task engine — F-06).
- Approval menahan tindakan eksternal: **NOT RUN** (belum ada approval gate — roadmap 2.4).
- Tool tidak diizinkan ditolak: **NOT RUN** di situs; di bridge berlaku allowlist app MCP (**PASS sebagian**, terbukti dari kode `_authed` + `ALLOWED_APPS`, belum diuji live dari luar).
- Restart tidak merusak status task: **PASS sebagian** — tasks.json persisten di repo; state localStorage per-browser; runtime diawasi watchdog (terbukti pulih dari restart VM berulang).
- Kamera/pemilihan karakter 3D: **PASS** (T4; kontrol kamera ada di scene/camera.js — tidak diuji otomatis interaksi penuh).

## Catatan kejujuran

Tidak ada test yang diklaim PASS tanpa dijalankan. Angka performa (FPS) dari SwiftShader tidak mewakili perangkat nyata — pengukuran GPU nyata masih diperlukan (roadmap 4.2).
