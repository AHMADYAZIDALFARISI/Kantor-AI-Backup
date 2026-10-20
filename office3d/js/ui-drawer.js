// js/ui-drawer.js
const CSS = `
#gdrawer{position:fixed;top:0;right:0;width:360px;max-width:92vw;height:100%;background:rgba(16,20,28,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);color:#eef2f7;transform:translateX(105%);transition:transform .28s ease;z-index:40;display:flex;flex-direction:column;box-shadow:-8px 0 32px rgba(0,0,0,.4);font-family:Inter,system-ui,sans-serif}
#gdrawer.open{transform:none}
.gd-head{padding:18px;border-bottom:1px solid rgba(255,255,255,.08)}
.gd-body{padding:18px;overflow-y:auto;flex:1}
.gd-close{float:right;background:none;border:none;color:#9fb0c3;font-size:20px;cursor:pointer}
.gd-close:hover{color:#fff}
.gd-head h2{margin:8px 0 2px;font-size:20px}
.gd-sub{color:#9fb0c3;font-size:13px;margin:2px 0}
.gd-row{display:flex;gap:14px;align-items:flex-start}
.gd-sec{margin:0 0 18px}
.gd-sec h3{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#9fb0c3;margin:0 0 8px}
.pill{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600}
.chip{display:inline-block;padding:2px 8px;border-radius:6px;font-size:11px;background:rgba(255,255,255,.08);color:#cfd8e3;margin-top:6px}
.task{display:block;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);cursor:pointer}
.task label{display:flex;gap:8px;align-items:center;cursor:pointer}
.task.done .t-title{text-decoration:line-through;color:#7d8a99}
.t-meta{display:flex;justify-content:space-between;font-size:11px;color:#9fb0c3;margin-top:4px}
.bar{height:6px;background:rgba(255,255,255,.1);border-radius:4px;overflow:hidden;margin-top:6px}
.bar>i{display:block;height:100%;background:#4a90d9;border-radius:4px;transition:width .3s}
.avatar{width:64px;height:96px;image-rendering:pixelated;border-radius:10px;background:#222;flex-shrink:0}
.info{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:13px}
.info span:first-child{color:#9fb0c3}
.gd-empty{color:#7d8a99;font-size:13px}
#gd-chat{max-height:220px;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:4px 0}
.gd-msg{max-width:88%;padding:8px 12px;border-radius:12px;font-size:13px;line-height:1.5}
.gd-msg.u{align-self:flex-end;background:#2b5a9e;color:#fff}
.gd-msg.a{align-self:flex-start;background:rgba(255,255,255,.08);color:#e8edf3}
.gd-msg.t{opacity:.6;font-style:italic}
.gd-chatrow{display:flex;gap:8px;margin-top:8px}
.gd-chatrow input{flex:1;padding:9px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:#0e131b;color:#fff;font-size:13px}
.gd-chatrow button{padding:9px 14px;border-radius:10px;border:none;background:#2b5a9e;color:#fff;font-size:13px;cursor:pointer}
`;

const STORE_KEY = 'gembul-tasks';
const statusColors = { Idle: '#9fb0c3', Walking: '#4a90d9', Working: '#43c876', Meeting: '#f0a832', Resting: '#b48ce8' };

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function injectStyle() {
  if (document.getElementById('gdrawer-style')) return;
  const st = document.createElement('style');
  st.id = 'gdrawer-style';
  st.textContent = CSS;
  document.head.appendChild(st);
}

const imgCache = {};
function loadImg(src) {
  if (!imgCache[src]) {
    const img = new Image();
    img.src = src;
    imgCache[src] = img;
  }
  return imgCache[src];
}

export function createDrawer(opts = {}) {
  const { store, data } = opts;
  injectStyle();

  // merge persisted tasks
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (saved && typeof saved === 'object') {
      store.state.tasks = store.state.tasks || {};
      for (const id in saved) store.state.tasks[id] = saved[id];
    }
  } catch (e) { /* ignore */ }

  const el = document.createElement('aside');
  el.id = 'gdrawer';
  el.innerHTML = `<div class="gd-head"><button class="gd-close" aria-label="Tutup">✕</button><div class="gd-title"></div></div><div class="gd-body"></div>`;
  document.body.appendChild(el);
  const titleEl = el.querySelector('.gd-title');
  const bodyEl = el.querySelector('.gd-body');
  const setHead = html => { titleEl.innerHTML = html; };
  const setBody = html => { bodyEl.innerHTML = html; };
  el.querySelector('.gd-close').addEventListener('click', () => {
    if (opts.onClose) opts.onClose();
    else close();
  });

  const open = () => el.classList.add('open');
  const close = () => el.classList.remove('open');

  const persist = () => {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store.state.tasks || {})); } catch (e) { /* ignore */ }
  };

  const roomLabel = id => {
    const d = (data.divisions || []).find(d => d.id === id);
    return d ? (d.label || d.name || d.id) : (id || '-');
  };

  function drawAvatar(cv, src) {
    const ctx = cv.getContext('2d');
    const draw = img => {
      ctx.clearRect(0, 0, 64, 96);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, 32, 48, 0, 0, 64, 96);
    };
    if (!src) return;
    const img = loadImg(src);
    if (img.complete && img.naturalWidth) draw(img);
    else img.addEventListener('load', () => draw(img), { once: true });
  }

  const chatHist = {};

  function initChat(agentId, agentName) {
    const box = el.querySelector('#gd-chat');
    const inp = el.querySelector('#gd-chatin');
    const btn = el.querySelector('#gd-chatsend');
    const off = el.querySelector('#gd-chatoff');
    if (!box || !inp || !btn) return;
    const cfg = (data.bridge) || {};
    if (!cfg.url || !cfg.token) {
      if (off) off.style.display = 'block';
      const row = el.querySelector('.gd-chatrow');
      if (row) row.style.display = 'none';
      return;
    }
    if (!chatHist[agentId]) chatHist[agentId] = [];
    const hist = chatHist[agentId];
    const paint = () => {
      box.innerHTML = hist.map(m =>
        `<div class="gd-msg ${m.role === 'user' ? 'u' : 'a'}">${esc(m.content)}</div>`
      ).join('');
      box.scrollTop = box.scrollHeight;
    };
    paint();
    let busy = false;
    const send = async () => {
      const text = inp.value.trim();
      if (!text || busy) return;
      busy = true;
      inp.value = '';
      hist.push({ role: 'user', content: text });
      hist.push({ role: 'assistant', content: '…' });
      paint();
      box.lastChild && box.lastChild.classList.add('t');
      try {
        const r = await fetch(cfg.url.replace(/\/$/, '') + '/v1/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + cfg.token },
          body: JSON.stringify({ agent_id: agentId, messages: hist.filter(m => m.content !== '…') }),
        });
        const d = await r.json();
        hist.pop();
        hist.push({ role: 'assistant', content: d.reply || d.error || '(gagal)' });
      } catch (e) {
        hist.pop();
        hist.push({ role: 'assistant', content: 'Tidak bisa terhubung ke AI backend.' });
      }
      busy = false;
      paint();
    };
    btn.addEventListener('click', send);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  }

  function renderCharacter(pick) {
    const staff = (data.staff || []).find(s => s.id === pick.id) || { id: pick.id, name: pick.id };
    const ag = (store.state.agents || {})[pick.id] || {};
    const tasks = (store.state.tasks || {})[pick.id] || [];
    const status = ag.status || 'Idle';
    const pillColor = statusColors[status] || '#9fb0c3';
    const div = (data.divisions || []).find(d => d.id === staff.room);
    const roomLabel = div ? div.label : (staff.room || '-');
    setHead(`
      <canvas id="gd-avatar" width="64" height="96"></canvas>
      <h2>${esc(staff.name)}</h2>
      <div class="gd-title">${esc(staff.title || '')}</div>
      <div class="gd-room">${esc(roomLabel)} <span class="pill" style="background:${pillColor}">${esc(status)}</span></div>
    `);
    const cv = el.querySelector('#gd-avatar');
    if (cv) {
      const ctx = cv.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      const fallback = () => {
        ctx.fillStyle = (staff.palette && staff.palette[0]) || '#556';
        ctx.fillRect(16, 24, 32, 56);
      };
      if (staff.sheet) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, 64, 96);
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, 32, 48, 0, 0, 64, 96);
        };
        img.onerror = fallback;
        img.src = staff.sheet;
      } else fallback();
    }
    const cur = tasks.find(t => !t.done) || tasks[0];
    const curHtml = cur
      ? `<div class="gd-cur"><div>${esc(cur.title)}</div><div class="bar"><i style="width:${Math.max(0, Math.min(100, cur.progress || 0))}%"></i></div></div>`
      : '<div class="gd-empty">Tidak ada tugas</div>';
    const rows = tasks.map((t, i) => `
      <label class="task"><input type="checkbox" data-i="${i}"${t.done ? ' checked' : ''}> ${esc(t.title)} <span>${esc(t.eta || '-')} · ${Math.round(t.progress || 0)}%</span></label>
    `).join('');
    setBody(`
      <section><h3>Tugas saat ini</h3>${curHtml}</section>
      <section><h3>Daftar tugas</h3>${rows || '<div class="gd-empty">Kosong</div>'}</section>
      <section><h3>Chat dengan ${esc(staff.name)}</h3>
        <div id="gd-chat"></div>
        <div class="gd-chatrow"><input id="gd-chatin" placeholder="Tulis pesan…" autocomplete="off"><button id="gd-chatsend">Kirim</button></div>
        <div id="gd-chatoff" class="gd-empty" style="display:none;margin-top:6px">AI offline — hubungkan tunnel untuk mengaktifkan chat.</div>
      </section>
    `);
    initChat(pick.id, staff.name);
    el.querySelectorAll('input[data-i]').forEach(cb => {
      cb.addEventListener('change', () => {
        const t = tasks[+cb.dataset.i];
        if (!t) return;
        t.done = cb.checked;
        t.progress = cb.checked ? 100 : t.progress;
        try { localStorage.setItem('gembul-tasks', JSON.stringify(store.state.tasks)); } catch (e) {}
        store.emit();
      });
    });
  }

  function renderFurniture(pick) {
    const pretty = String(pick.name || '').replace(/_/g, ' ');
    const div = (data.divisions || []).find(d => d.id === pick.room);
    const roomLabel = div ? div.label : (pick.room || '-');
    setHead(`
      <h2>${esc(pretty)}</h2>
      <span class="chip">${esc(pick.builder || '')}</span>
    `);
    setBody(`
      <section>
        <div class="info"><b>Tipe</b><span>${esc(pick.builder || '-')}</span></div>
        <div class="info"><b>Ruangan</b><span>${esc(roomLabel)}</span></div>
        <div class="info"><b>ID</b><span>${esc(pick.id || '-')}</span></div>
        <div class="info"><b>Status</b><span>Tersedia</span></div>
      </section>
    `);
  }

  el.addEventListener('click', e => {
    if (e.target.closest('[data-act="close"]')) {
      close();
      opts.onClose && opts.onClose();
    }
  });

  try {
    const saved = JSON.parse(localStorage.getItem('gembul-tasks') || 'null');
    if (saved && store.state.tasks) {
      for (const id in saved) {
        const cur = store.state.tasks[id];
        if (!cur || !Array.isArray(saved[id])) continue;
        saved[id].forEach((s, i) => {
          if (cur[i] && s && typeof s.done === 'boolean') {
            cur[i].done = s.done;
            if (s.done) cur[i].progress = 100;
          }
        });
      }
    }
  } catch (e) {}

  function render() {
    const sel = store.state.selected;
    if (!sel) { close(); return; }
    if (sel.type === 'character') renderCharacter(sel);
    else renderFurniture(sel);
    open();
  }
  store.subscribe(render);
  render();

  return { el, render };
}