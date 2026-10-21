// Utilitas bersama untuk proxy kantor-bridge. Token hanya dibaca dari env server.
export function config() {
  const url = (process.env.BRIDGE_URL || '').replace(/\/+$/, '');
  const token = process.env.BRIDGE_TOKEN || '';
  return { url, token, ok: !!(url && token) };
}

// Rate limit per IP (best effort, per instance serverless). Lihat docs/DEPLOY_MUSE.md.
const hits = new Map();
export function rateOk(ip, limit, windowMs = 3600_000) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < windowMs);
  if (arr.length >= limit) { hits.set(ip, arr); return false; }
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      const f = v.filter(t => now - t < windowMs);
      if (f.length) hits.set(k, f); else hits.delete(k);
    }
  }
  return true;
}

export function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  return (Array.isArray(xf) ? xf[0] : (xf || '')).split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
}

export function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(obj));
}

export async function readJson(req, max = 64_000) {
  if (req.body && typeof req.body === 'object') return req.body;
  let raw = '';
  for await (const chunk of req) { raw += chunk; if (raw.length > max) throw new Error('payload_too_large'); }
  return raw ? JSON.parse(raw) : {};
}
