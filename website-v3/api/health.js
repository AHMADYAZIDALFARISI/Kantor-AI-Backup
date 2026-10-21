import { config, send } from './_lib.js';

export default async function handler(req, res) {
  const c = config();
  const backend = c.ok ? 'bridge' : (process.env.GEMINI_API_KEY ? 'gemini' : null);
  if (!backend) return send(res, 503, { ok: false, error: 'not_configured' });
  if (backend === 'bridge') {
    try {
      const r = await fetch(c.url + '/health', { signal: AbortSignal.timeout(6000) });
      const d = await r.json().catch(() => ({}));
      return send(res, r.ok && d.ok ? 200 : 502, { ok: !!(r.ok && d.ok), backend, ts: d.ts || null, error: r.ok ? undefined : 'bridge_http_' + r.status });
    } catch (e) {
      return send(res, 502, { ok: false, backend, error: 'bridge_unreachable' });
    }
  }
  // Gemini langsung: cukup cek key valid lewat daftar model (murah, tanpa kuota generate).
  try {
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY },
      signal: AbortSignal.timeout(10000),
    });
    return send(res, r.ok ? 200 : 502, { ok: r.ok, backend, error: r.ok ? undefined : 'gemini_http_' + r.status });
  } catch (e) {
    return send(res, 502, { ok: false, backend, error: 'gemini_unreachable' });
  }
}
