// Store pub/sub per topik. Data frekuensi tinggi (posisi, animasi) TIDAK lewat sini.
// Setiap status agen membawa `source`: 'backend' (kejadian nyata) atau 'ambient' (simulasi).
export function createStore(data) {
  const state = {
    selected: null,               // {type:'agent'|'room'|'furniture', id}
    backend: { status: 'checking', detail: '', checkedAt: 0 },
    agents: {},                   // id -> {activity, mode, source, backendState, backendAt, room}
    plans: loadPlans(data.tasks || {}),
    simMinutes: 8 * 60,
    settings: loadSettings(),
  };
  for (const s of data.staff || []) {
    state.agents[s.id] = { activity: 'Bersiap', mode: 'idle', source: 'ambient', backendState: null, backendAt: 0, room: s.room };
  }
  const subs = new Map();
  function on(topic, fn) {
    if (!subs.has(topic)) subs.set(topic, new Set());
    subs.get(topic).add(fn);
    return () => subs.get(topic).delete(fn);
  }
  function emit(topic, payload) {
    (subs.get(topic) || []).forEach(fn => fn(payload, state));
  }
  function setAgent(id, patch) {
    const a = state.agents[id];
    if (!a) return;
    let changed = false;
    for (const k in patch) if (a[k] !== patch[k]) { a[k] = patch[k]; changed = true; }
    if (changed) emit('agent', id);
  }
  function select(sel) { state.selected = sel; emit('select', sel); }
  function setPlanDone(agentId, idx, done) {
    const list = state.plans[agentId];
    if (!list || !list[idx]) return;
    list[idx].done = done;
    savePlans(state.plans);
    emit('plans', agentId);
  }
  function setSetting(k, v) { state.settings[k] = v; saveSettings(state.settings); emit('settings', k); }
  return { state, on, emit, setAgent, select, setPlanDone, setSetting };
}

const PLAN_KEY = 'gembul-tasks';
function loadPlans(tasks) {
  // Rencana statis dari tasks.json. Tidak ada progres otomatis: status selesai hanya dari centang pengguna.
  const plans = {};
  for (const id in tasks) plans[id] = tasks[id].map(t => {
    const p = Math.max(0, Math.min(100, Number(t.progress) || 0));
    return { title: t.title, eta: t.eta, progress: p, done: !!(t.done || p >= 100), kind: t.kind || 'sample' };
  });
  try {
    const saved = JSON.parse(localStorage.getItem(PLAN_KEY) || 'null');
    if (saved) for (const id in saved) (saved[id] || []).forEach((s, i) => {
      if (plans[id] && plans[id][i] && typeof s?.done === 'boolean' && !plans[id][i].done) plans[id][i].done = s.done;
    });
  } catch (e) { /* storage tidak tersedia */ }
  return plans;
}
function savePlans(p) { try { localStorage.setItem(PLAN_KEY, JSON.stringify(p)); } catch (e) { /* abaikan */ } }

const SET_KEY = 'kcsh-settings';
function loadSettings() {
  const def = {
    quality: 'auto', labels: true,
    reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false,
  };
  try { return Object.assign(def, JSON.parse(localStorage.getItem(SET_KEY) || '{}')); } catch (e) { return def; }
}
function saveSettings(s) { try { localStorage.setItem(SET_KEY, JSON.stringify(s)); } catch (e) { /* abaikan */ } }
