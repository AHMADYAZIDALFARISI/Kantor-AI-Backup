import { config, send, rateOk, clientIp, readJson } from './_lib.js';
import { PERSONAS } from './_personas.js';

const ID_RE = /^[a-z0-9_]{1,40}$/;
const LIMIT = Number(process.env.CHAT_LIMIT_PER_HOUR || 60);
const GEMINI_MODELS = (process.env.GEMINI_MODEL || 'gemini-3.5-flash,gemini-3.1-flash-lite,gemini-3.8-flash,gemini-3.1-pro-preview').split(',').map(s => s.trim()).filter(Boolean);

async function viaBridge(c, agent_id, messages) {
  const payload = { agent_id, messages };
  if (process.env.CHAT_MODEL) payload.model = process.env.CHAT_MODEL;
  const r = await fetch(c.url + '/v1/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + c.token },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(55000),
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok || !d.reply) throw Object.assign(new Error(d.error || 'bridge_http_' + r.status), { status: r.status === 429 ? 429 : 502 });
  return String(d.reply);
}

async function viaGemini(agent_id, messages) {
  const key = process.env.GEMINI_API_KEY;
  const sys = PERSONAS[agent_id] || PERSONAS.staff_a;
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  let lastErr = null;
  for (const model of GEMINI_MODELS) {
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: sys }] },
          contents,
          generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
        }),
        signal: AbortSignal.timeout(20000),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { lastErr = Object.assign(new Error('gemini_http_' + r.status), { status: r.status === 429 ? 429 : 502 }); continue; }
      const txt = d.candidates && d.candidates[0] && d.candidates[0].content &&
        (d.candidates[0].content.parts || []).map(p => p.text || '').join('').trim();
      if (txt) return txt;
      lastErr = new Error('gemini_empty');
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('gemini_unavailable');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method_not_allowed' });
  const c = config();
  const hasGemini = !!process.env.GEMINI_API_KEY;
  if (!c.ok && !hasGemini) return send(res, 503, { error: 'not_configured' });
  const allowed = process.env.ALLOWED_ORIGIN;
  if (allowed && req.headers.origin && req.headers.origin !== allowed) return send(res, 403, { error: 'origin_not_allowed' });
  if (!rateOk(clientIp(req), LIMIT)) return send(res, 429, { error: 'rate_limited' });
  let body;
  try { body = await readJson(req); } catch (e) { return send(res, 400, { error: 'bad_json' }); }
  const agent_id = String(body.agent_id || '');
  if (!ID_RE.test(agent_id)) return send(res, 400, { error: 'bad_agent_id' });
  const messages = (Array.isArray(body.messages) ? body.messages : []).slice(-12)
    .filter(m => m && (m.role === 'user' || m.role === 'assistant'))
    .map(m => ({ role: m.role, content: String(m.content || '').slice(0, 2000) }));
  if (!messages.length || messages[messages.length - 1].role !== 'user') return send(res, 400, { error: 'bad_messages' });
  if (!c.ok && !PERSONAS[agent_id]) return send(res, 400, { error: 'unknown_agent' });
  try {
    if (c.ok) { try { return send(res, 200, { reply: await viaBridge(c, agent_id, messages) }); } catch (e) { if (!hasGemini) throw e; } }
    return send(res, 200, { reply: await viaGemini(agent_id, messages) });
  } catch (e) {
    return send(res, e.status || 504, { error: e.message || 'upstream_error' });
  }
}
