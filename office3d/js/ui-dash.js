export function createDashboard(opts) {
  const { store, data, figs, rooms, camera, controls, fitCameraToRoom, interaction, furniturePickMeshes } = opts;
  const pickMeshes = furniturePickMeshes || [];

  const style = document.createElement('style');
  style.textContent = `#gdash{position:fixed;top:14px;left:14px;z-index:30;width:300px;max-height:70vh;overflow-y:auto;background:rgba(16,20,28,0.88);backdrop-filter:blur(10px);border-radius:14px;color:#eef2f7;font-family:Inter,system-ui,sans-serif;box-shadow:0 8px 28px rgba(0,0,0,.35)}
#gdash.hidden{display:none}
.dcard{display:flex;gap:10px;align-items:center;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.06);cursor:pointer}
.dcard:hover{background:rgba(255,255,255,.05)}
.dhead{padding:12px;font-weight:700;display:flex;justify-content:space-between;align-items:center}
.dtitle{font-size:14px}
.dsub{font-size:11px;color:#9fb0c3}
#gsearch{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:30;width:320px;padding:9px 14px;border-radius:20px;border:1px solid rgba(255,255,255,.15);background:rgba(16,20,28,0.88);color:#fff;font-size:14px;display:none}
#gsearch.show{display:block}
#gsearch::placeholder{color:#8fa0b5}
#gdashbtn{position:fixed;bottom:14px;left:14px;z-index:30;padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:rgba(16,20,28,0.88);color:#eef2f7;font-family:Inter,system-ui,sans-serif;font-size:12px;cursor:pointer}\n@media (max-width:640px){#gdash{width:min(300px,80vw);top:10px;left:10px}#gsearch{width:min(320px,80vw)}}`;
  document.head.appendChild(style);

  const dash = document.createElement('div');
  dash.id = 'gdash';
  dash.innerHTML = `<div class="dhead"><span>Progres Divisi</span><span class="dsub">1-9 · Tab · / · F · D</span></div><div class="dcards"></div>`;
  document.body.appendChild(dash);
  const cards = dash.querySelector('.dcards');

  const btn = document.createElement('button');
  btn.id = 'gdashbtn';
  btn.textContent = 'Divisi (D)';
  btn.onclick = () => dash.classList.toggle('hidden');
  document.body.appendChild(btn);

  const search = document.createElement('input');
  search.id = 'gsearch';
  search.placeholder = 'Cari staf atau perabot... (Enter)';
  document.body.appendChild(search);

  const divisions = data.divisions || [];

  function focusRoom(id) {
    const r = rooms[id];
    if (r) fitCameraToRoom(camera, controls, r.center, r.rect[2], r.rect[3]);
  }

  function render() {
    const st = store.state;
    cards.innerHTML = divisions.map((d) => {
      const staffIn = data.staff.filter((s) => s.room === d.id);
      const tasks = staffIn.flatMap((s) => (st.tasks || {})[s.id] || []);
      const prog = tasks.length ? Math.round(tasks.reduce((a, t) => a + (t.progress || 0), 0) / tasks.length) : 0;
      const active = staffIn.filter((s) => ((st.agents || {})[s.id] || {}).status !== 'Idle').length;
      return `<div class="dcard" data-id="${d.id}">
<svg width="40" height="40" viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="4"/><circle cx="20" cy="20" r="16" fill="none" stroke="#4a90d9" stroke-width="4" stroke-linecap="round" stroke-dasharray="${prog * 1.005} 100.5" transform="rotate(-90 20 20)"/></svg>
<div><div class="dtitle"><b>${prog}%</b> ${d.label}</div><div class="dsub">${staffIn.length} orang · ${active} aktif</div></div></div>`;
    }).join('');
  }
  cards.addEventListener('click', (e) => {
    const c = e.target.closest('.dcard');
    if (c) focusRoom(c.dataset.id);
  });

  function findMatches(q) {
    const f = figs.filter((fg) => {
      const p = fg.group.userData.pick || {};
      const s = fg.staff || fg.data || {};
      const name = (fg.name || s.name || p.name || '').toLowerCase();
      const title = (fg.title || s.title || '').toLowerCase();
      return name.includes(q) || title.includes(q);
    }).slice(0, 5).map((fg) => fg.group.userData.pick);
    const m = pickMeshes.filter((pm) => {
      const p = pm.userData ? pm.userData.pick : pm.pick;
      return p && (p.name || '').toLowerCase().includes(q);
    }).slice(0, 5).map((pm) => (pm.userData ? pm.userData.pick : pm.pick));
    return [...f, ...m].filter(Boolean);
  }
  let matches = [];
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    matches = q ? findMatches(q) : [];
  });
  search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (matches[0]) interaction.select(matches[0]);
      search.classList.remove('show');
      search.blur();
    } else if (e.key === 'Escape') {
      search.classList.remove('show');
      search.blur();
    }
  });

  let tabIdx = -1;
  window.addEventListener('keydown', (e) => {
    const tag = e.target && e.target.tagName;
    if ((tag === 'INPUT' || tag === 'TEXTAREA') && e.key !== 'Escape') return;
    if (e.key === '/') {
      e.preventDefault();
      search.classList.add('show');
      search.focus();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      if (figs.length) {
        tabIdx = (tabIdx + 1) % figs.length;
        const fg = figs[tabIdx];
        if (fg && fg.group) interaction.select(fg.group.userData.pick);
      }
      return;
    }
    const k = e.key.toLowerCase();
    if (k === 'd') { dash.classList.toggle('hidden'); return; }
    if (k === 'f') {
      const sel = interaction.getSelected();
      if (sel && sel.type === 'character') {
        const fg = figs.find(f => f.id === sel.id);
        if (fg) fitCameraToRoom(camera, controls, fg.group.position, 6, 6);
      }
      return;
    }
    if (k >= '1' && k <= '9') {
      const d = divisions[+k - 1];
      if (d) focusRoom(d.id);
      return;
    }
    if (e.key === 'Escape') interaction.deselect();
  });

  function syncHash() {
    const sel = store.state.selected;
    try { location.hash = sel ? (sel.type === 'character' ? 'char=' : 'furn=') + sel.id : ''; } catch (e) {}
  }
  store.subscribe(syncHash);

  try {
    const h = location.hash.replace('#', '');
    if (h.startsWith('char=')) {
      const fg = figs.find(f => f.id === h.slice(5));
      if (fg && fg.group) interaction.select(fg.group.userData.pick);
    } else if (h.startsWith('room=')) {
      focusRoom(h.slice(5));
    }
  } catch (e) {}

  store.subscribe(render);
  render();

  try { if (window.innerWidth < 640) dash.classList.add('hidden'); } catch (e) {}

  return { el: dash, render };
}