# 07 — Tinjauan Keamanan (Evolusi)

Melengkapi `docs/audit/06-security-review.md`; fokus pada perubahan sprint ini.

## Perubahan sprint ini — dampak keamanan

| Perubahan | Dampak |
|---|---|
| `org.json` (publik) | Hanya data organisasi non-sensitif (nama peran, kapabilitas, allowlist tool berupa LABEL teks). Tidak ada kredensial/endpoint internal/token. Aman dipublikasikan. |
| Panel Papan Kerja | Membaca `store.state.plans` yang sudah ada di klien; tidak ada endpoint baru; tidak ada tulis server. Risiko baru: nihil. |
| Sub-agen di drawer | Render dari org.json dengan `esc()` di semua field. |
| Caption papan 3D | Agregat numerik dari tasks.json; tanpa data pribadi. |

## Tetap berlaku dari audit

- Secret hanya env server / file 600; bundle bersih (terverifikasi grep).
- /api/chat: rate limit (sudah diperkuat anti-flush), validasi agent_id, cap payload.
- Bot: allowed_user_ids gate; belum ada approval gate untuk AKSI berisiko → roadmap (paling relevan saat DB/task engine masuk: approval wajib untuk write eksternal).

## Rekomendasi untuk fase runtime nyata

1. Sub-agent boleh menerima task hanya sesuai `capabilities` + `tools` di org.json (allowlist ditegakkan server-side, bukan UI).
2. Tool call dari agent LLM tidak boleh membawa hak tulis DB langsung — lewat task service + approval (lihat 06).
3. Prompt injection: konten tasks/dokumen diperlakukan sebagai data, bukan instruksi (aturan sudah berlaku di sistem ini).
