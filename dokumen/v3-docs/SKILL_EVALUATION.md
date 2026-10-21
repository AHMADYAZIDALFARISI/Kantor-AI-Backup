# Skill Evaluation (Phase 2)

Semua repo hanya di-clone dan dibaca. Tidak ada skrip yang dijalankan, tidak ada yang dipasang.

| Repo | Commit diperiksa | Lisensi | Status |
|---|---|---|---|
| czlonkowski/blender-web-3d-skill | 858762f (2026-09-23) | MIT | Tersedia |
| Impertio-Studio/Three.js-Claude-Skill-Package | 6c190f0 (2026-03-30) | MIT (OpenAEC Foundation) | Tersedia |
| fletcherholt/3dmodel-skill | 857c241 (2026-06-16) | **Tidak ada file LICENSE** | Tersedia |
| Olioli4/blender2three-skills | - | - | **Tidak ditemukan** (GitHub API 404, akun tidak punya repo publik bernama itu) |
| ahujasid/mcp-for-blender | 25e1fe0 (2026-10-18) | MIT + Terms of Use | Tersedia |

## 1. blender-web-3d-skill

- Isi: 1 SKILL.md, referensi scripting Blender 5.x, pipeline ekspor, viewer Vite + three r186, skrip `optimize-glb.mjs` (gltf-transform: dedup, instance, meshopt, webp), `quality.js` (tier adaptif), `batching.js`.
- Butuh: Blender 4.x/5.x di PATH, Node 20+. Opsional KTX-Software, BlenderMCP.
- Nilai untuk proyek: **tinggi**. Pola skrip headless berversi, loop verifikasi render, daftar jebakan ekspor (flatten/palette merusak pivot dan nama material), tier kualitas adaptif.
- Catatan: viewer bertema luar angkasa (sky, planet, shader hull). Hanya `optimize-glb.mjs`, `quality.js`, `batching.js`, dan referensi yang relevan. Tidak perlu menyalin shader tema.
- Keamanan: `postinstall` menyalin decoder, tidak ada unduhan jaringan saat install selain npm. Aman setelah dibaca.

## 2. Three.js-Claude-Skill-Package

- Isi: 24 skill deterministik (core, syntax, impl, errors, agents), cakupan r160+, R3F, Drei, WebGPU, fisika, IFC, XR.
- Nilai: **sedang-tinggi** sebagai referensi. Relevan: renderer, raycaster, loaders, controls, lighting, shadows, animation (crossfade, skeletal), errors-performance, errors-rendering, model-optimizer.
- Tidak relevan: IFC viewer, XR, physics, audio, WebGPU (belum dibutuhkan).
- Instalasi: hanya file Markdown, tanpa skrip. Pasang lokal proyek di `.claude/skills/threejs/` dengan subset di atas.

## 3. 3dmodel-skill

- Isi: SKILL.md + 4 referensi (AI generation, pipeline Blender, Fusion 360, realtime web).
- Nilai: **sedang**. Metode loop render-lihat-kritik berguna. Jalur text/image-to-3D (Tripo, Meshy, Rodin) butuh API berbayar, tidak dipakai tanpa persetujuan. Fusion 360 tidak relevan.
- **Masalah lisensi**: tanpa LICENSE berarti hak cipta penuh pemilik. Boleh dibaca sebagai referensi, tidak boleh disalin ke repo proyek.

## 4. blender2three-skills

- Tidak tersedia. Tidak ada yang dipasang. Fungsinya (Blender ke three.js) sudah tertutup oleh skill nomor 1.

## 5. mcp-for-blender

- Isi: addon Blender (`addon.py`, 6.734 baris), server MCP, installer `curl | sh`.
- Fakta dari kode:
  - Server socket hanya aktif di sesi Blender GUI; mati di mode `--background`.
  - Menyediakan `execute_code` yang menjalankan Python arbitrer di dalam Blender.
  - Mengakses API eksternal (Poly Haven, Poly Pizza, Meshy) lewat `requests`.
  - Terms of Use: telemetri isi (prompt, kode, screenshot viewport, aksi operator) bersifat opt-in; catatan pemakaian anonim minimal tetap dikirim.
  - `install.sh` memasang `uv` dari internet lalu menjalankan `mcp-for-blender@latest setup`, yang mengubah konfigurasi klien MCP global.
- Nilai: rendah untuk proyek ini. Pipeline kita headless dan berbasis skrip, sedangkan MCP butuh GUI.
- Rekomendasi: **jangan dipasang**. Bila nanti dibutuhkan untuk sesi live, pasang manual dengan versi dipin, tanpa `@latest`, telemetri dimatikan, dan disetujui terpisah.

## Tumpang tindih

| Kemampuan | Skill 1 | Skill 2 | Skill 3 |
|---|---|---|---|
| Skrip Blender headless | Ya (paling lengkap, API 5.x) | - | Ya |
| Optimasi GLB | Ya (skrip siap pakai) | Ya (panduan) | Ya (panduan) |
| Animasi skeletal three.js | Sebagian | Ya | Sebagian |
| Shadow/lighting three.js | Sebagian | Ya | Sebagian |
| Generasi AI 3D | - | - | Ya (berbayar) |

## Rencana pemasangan (menunggu persetujuan)

1. Skill 1, lokal proyek: `.claude/skills/blender-web-3d/` (SKILL.md + references + skrip optimize/quality/batching).
2. Skill 2, subset 11 skill, lokal proyek: `.claude/skills/threejs/`.
3. Skill 3: tidak disalin; hanya dibaca sebagai referensi.
4. Skill 4: tidak ada.
5. Skill 5: tidak dipasang.

Tidak ada perubahan konfigurasi global Claude, tidak ada skrip installer yang dijalankan.

## Kelayakan Blender di lingkungan ini

- Blender tidak terpasang. `bpy 5.2.2` tersedia di PyPI untuk Python 3.13 (wheel Linux 383 MB). `uv` tersedia untuk memasang Python 3.13 terisolasi.
- Lingkungan: 1 CPU, 3 GB RAM, tanpa GPU. Modeling, rigging, baking animasi, dan ekspor GLB layak. Render EEVEE tidak tersedia tanpa GPU; verifikasi visual memakai Cycles CPU sampel rendah atau screenshot three.js via Playwright.
- Belum diuji. Perlu persetujuan karena dependensi besar.
