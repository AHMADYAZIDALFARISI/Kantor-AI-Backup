// Lapisan integrasi: semua panggilan ke backend lewat proxy same-origin /api/*.
// Token tidak pernah ada di klien. Event yang dipancarkan hanya kejadian nyata.
export function createBridge(store) {
  const HEALTH_MS = 30000;

  async function health() {
    let status = 'offline', detail = '';
    try {
      const r = await fetch('api/health', { cache: 'no-store' });
      const ct = r.headers.get('content-type') || '';
      if (!ct.includes('json')) { status = 'unavailable'; detail = 'Endpoint /api tidak tersedia di server ini'; }
      else {
        const d = await r.json();
        if (r.status === 503 && d.error === 'not_configured') { status = 'not_configured'; detail = 'Backend AI belum dikonfigurasi di server'; }
        else if (r.ok && d.ok) status = 'online';
        else { status = 'offline'; detail = d.error || ('HTTP ' + r.status); }
      }
    } catch (e) { status = 'unavailable'; detail = 'Tidak bisa menghubungi /api'; }
    store.state.backend = { status, detail, checkedAt: Date.now() };
    store.emit('backend', store.state.backend);
    return status;
  }

  async function chat(agentId, messages) {
    store.emit('agent-event', { agentId, type: 'chat_start' });
    try {
      const r = await fetch('api/chat', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, messages }),
      });
      let d = {};
      try { d = await r.json(); } catch (e) { /* bukan JSON */ }
      if (!r.ok || !d.reply) {
        const err = d.error || ('HTTP ' + r.status);
        store.emit('agent-event', { agentId, type: 'chat_error', error: err, code: r.status });
        return { ok: false, error: err, code: r.status };
      }
      store.emit('agent-event', { agentId, type: 'chat_reply' });
      return { ok: true, reply: d.reply };
    } catch (e) {
      store.emit('agent-event', { agentId, type: 'chat_error', error: 'jaringan' });
      return { ok: false, error: 'Tidak bisa terhubung ke AI backend.' };
    }
  }

  health();
  const timer = setInterval(() => { if (!document.hidden) health(); }, HEALTH_MS);
  return { chat, health, dispose: () => clearInterval(timer) };
}
