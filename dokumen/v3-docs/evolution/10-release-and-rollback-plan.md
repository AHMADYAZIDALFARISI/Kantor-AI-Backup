# 10 — Rencana Rilis & Rollback

## Rilis (butuh persetujuan pemilik)

1. `cd office3d && npm run build` (terakhir PASS 3.09s).
2. `npx vercel@latest deploy --prod --yes --token <dari file rahasia>` (token tidak dicetak).
3. Verifikasi pasca-rilis: situs 200; `/api/health` ok; `data/org.json` 200; JS hash cocok dengan build lokal; uji cepat Papan Kerja & drawer sub-agen di browser.

## Rollback

- Cara resmi: `vercel redeploy <deployment-sebelumnya>` atau deploy ulang dari salinan repo sebelum sprint (perubahan sprint ini murni aditif: 2 file baru + patch 3 file; membatalkan = hapus org.json/boardPanel.js + revert patch, lalu deploy).
- Tidak ada migrasi data pada rilis ini → rollback tidak menyentuh tasks.json.
- Situs tidak pernah dalam keadaan setengah-rilis: Vercel atomic deployment.

## Release checklist

- [x] Build lokal PASS
- [x] Uji headless fitur baru PASS (08)
- [x] Tidak ada secret di file baru (org.json publik by design, isi non-sensitif)
- [x] Dokumentasi sinkron dengan implementasi
- [x] Persetujuan pemilik untuk deploy (2026-10-20 12:56 WIB: "deploy semua ke live sekarang")
- [x] Verifikasi pasca-deploy: situs 200, build index-zzAOX3ag.js cocok, health ok, org.json 200, delegations.json (run failed nyata) & tasks.json kind=sample 42/42 live
