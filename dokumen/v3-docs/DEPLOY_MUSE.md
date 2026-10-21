# Deploy Kantor KCSH v3 ke Vercel (instruksi untuk Muse.ai)

Dokumen ini ditujukan untuk agen yang menjalankan deploy. Ikuti urutannya. Jangan lewati langkah verifikasi.

## 0. Yang dibutuhkan

| Item | Keterangan |
|---|---|
| Node.js 20+ dan npm | Untuk build |
| Vercel CLI | `npm i -g vercel@latest` atau `npx vercel` |
| Token Vercel bercakupan team `ayasi` | Sama seperti deploy sebelumnya |
| URL tunnel kantor-bridge | Contoh `https://xxxx.trycloudflare.com` (tanpa garis miring di akhir) |
| Token kantor-bridge | Isi `~/workspace/kantor-bridge/.token` |

## 1. Ambil kode

Pilih salah satu.

**A. Dari git bundle** (`kantor-ai-v3.bundle`):
```bash
git clone https://github.com/AHMADYAZIDALFARISI/Kantor-AI-Backup.git kantor-kcsh-v3
cd kantor-kcsh-v3
git fetch /path/ke/kantor-ai-v3.bundle feat/3d-hd-rebuild:feat/3d-hd-rebuild
git checkout feat/3d-hd-rebuild
```

**B. Dari zip** (`kantor-ai-v3-source.zip`): ekstrak, lalu masuk ke folder hasil ekstrak.

Branch `main` di repo backup tidak diubah. Jangan force-push ke `main`.

## 2. Build lokal (wajib lulus sebelum deploy)
```bash
cd office3d
npm ci
npm run build
```
Hasil yang benar: folder `office3d/dist/` berisi `index.html`, `assets/`, `data/`. Jika `npm ci` gagal di paket `sharp`, jalankan `npm ci --omit=optional`. Paket itu hanya dipakai skrip kompresi aset, bukan oleh situs.

## 3. Hubungkan ke project Vercel
Root directory project harus `office3d` (folder yang berisi `package.json`, `vercel.json`, `api/`).
```bash
cd office3d
vercel link --scope ayasi --project kantor-kcsh --yes --token "$VERCEL_TOKEN"
```
Jika project lama dideploy sebagai file statis lewat REST API, pastikan di Settings > Build & Deployment: Framework = Vite, Build Command = `npm run build`, Output Directory = `dist`, Root Directory = `office3d` (atau kosong bila deploy dijalankan dari dalam folder `office3d`).

## 4. Isi environment variable (server only)
```bash
vercel env add BRIDGE_URL production --token "$VERCEL_TOKEN"     # https://...tunnel..., tanpa / di akhir
vercel env add BRIDGE_TOKEN production --token "$VERCEL_TOKEN"   # isi .token kantor-bridge
# opsional
vercel env add CHAT_MODEL production --token "$VERCEL_TOKEN"            # contoh: cc/claude-haiku-4-5-20251001
vercel env add CHAT_LIMIT_PER_HOUR production --token "$VERCEL_TOKEN"   # default 20 per IP per jam
vercel env add ALLOWED_ORIGIN production --token "$VERCEL_TOKEN"        # https://kantor-kcsh.vercel.app
```
**Jangan** membuat atau mengisi `data/bridge.json`. File itu sudah dihapus karena dulu membocorkan token ke publik. Token sekarang hanya dibaca oleh fungsi `api/chat.js` dan `api/health.js` di server.

## 5. Deploy
```bash
vercel deploy --prod --yes --token "$VERCEL_TOKEN"
```

## 6. Verifikasi setelah deploy (semua harus benar)
```bash
SITE=https://kantor-kcsh.vercel.app
curl -s $SITE/api/health                 # {"ok":true,...}  (503 not_configured = env belum terisi)
curl -s -o /dev/null -w "%{http_code}\n" $SITE/data/bridge.json   # harus 404
curl -s -X POST $SITE/api/chat -H 'Content-Type: application/json' \
  -d '{"agent_id":"qa_head","messages":[{"role":"user","content":"halo"}]}'   # {"reply":"..."}
```
Lalu buka situs di browser:
1. Layar memuat lalu tampil kantor 3D, tanpa pesan error.
2. Chip kanan atas bertuliskan "AI terhubung" (titik hijau).
3. Klik satu karakter, kirim pesan chat. Karakter berjalan ke meja dan mengetik, lalu balasan muncul.

## 7. Wajib setelah deploy pertama: rotasi token bridge
Token lama pernah tersedia publik lewat `data/bridge.json` di versi sebelumnya. Buat token baru di mesin bridge, lalu perbarui env:
```bash
python3 -c "import secrets;print(secrets.token_urlsafe(32))" > ~/workspace/kantor-bridge/.token
chmod 600 ~/workspace/kantor-bridge/.token
# restart kantor-bridge, lalu:
vercel env rm BRIDGE_TOKEN production --yes --token "$VERCEL_TOKEN"
vercel env add BRIDGE_TOKEN production --token "$VERCEL_TOKEN"
vercel deploy --prod --yes --token "$VERCEL_TOKEN"
```

## 8. Rollback
```bash
vercel ls kantor-kcsh --token "$VERCEL_TOKEN"            # cari deployment sebelumnya
vercel promote <url-deployment-lama> --token "$VERCEL_TOKEN"
```

## Catatan teknis
- Rate limit di proxy dihitung per IP pengunjung, tapi per instance serverless (best effort). Rate limit bawaan `bridge.py` melihat semua request sebagai 127.0.0.1 karena lewat tunnel, jadi limit itu berlaku global.
- Model AI dipilih server (`CHAT_MODEL`). Field `model` dari klien diabaikan proxy.
- Ukuran deploy sekitar 4 MB. Aset 3D terkompresi meshopt.
