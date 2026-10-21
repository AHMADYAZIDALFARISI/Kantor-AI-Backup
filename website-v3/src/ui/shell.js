import { esc, fmtClock } from '../core/util.js';
import { ROOM_STYLE } from '../scene/environment.js';

const ICON = {
  search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  people: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14.6c2.6-.3 4.8 1.2 5.5 4.4"/></svg>',
  gear: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  rotL: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg>',
  rotR: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg>',
  plus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>',
  home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/></svg>',
  book: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/></svg>',
};
const BACKEND_TEXT = {
  checking: ['Memeriksa AI…', 'warn'], online: ['AI terhubung', 'ok'], offline: ['AI offline', 'err'],
  not_configured: ['AI belum dikonfigurasi', 'warn'], unavailable: ['AI tidak tersedia', 'err'],
};
const BSTATE = { thinking: 'Memproses chat', replied: 'Membalas', error: 'Gagal' };

export function createShell(ctx) {
  const { store, data, bridge, roomSkills } = ctx;
  const staff = data.staff || [];
  const staffById = Object.fromEntries(staff.map(s => [s.id, s]));
  const rooms = data.map.rooms;
  const roomName = id => rooms.find(r => r.id === id)?.name || (id === 'umum' ? 'Semua ruangan' : id);
  const color = s => (s.palette && s.palette[2]) || '#5b6cff';
  const initials = n => n.split(/\s+/).filter(w => /^[\p{L}]/u.test(w)).map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const root = document.getElementById('ui');
  root.innerHTML = `
  <div class="topbar" role="banner">
    <div class="brand"><div class="brand-mark" aria-hidden="true">TK</div><div><b>Team Kreatif Agent AI Yazid</b><span>AI Operations Office</span></div></div>
    <div class="search" role="search">
      ${ICON.search}
      <input id="q" type="search" placeholder="Cari agen atau ruangan  ( / )" aria-label="Cari agen atau ruangan" autocomplete="off">
      <div class="search-results" id="qres" role="listbox"></div>
    </div>
    <div class="spacer"></div>
    <button class="iconbtn mobile-only" id="btnAgents" aria-label="Daftar agen">${ICON.people}</button>
    <span class="chip" id="backendChip" title=""><span class="dot"></span><span class="label">Memeriksa AI…</span></span>
    <span class="chip clock" title="Waktu Indonesia Barat"><span class="muted">WIB</span> <span id="clock">--:--:--</span></span>
    <button class="chip" id="btnSkills">${ICON.book}<span class="label">Skill</span></button>
    <button class="chip" id="btnBoard"><span class="label">Papan Kerja</span></button>
    <button class="iconbtn" id="btnSettings" aria-label="Pengaturan" aria-expanded="false">${ICON.gear}</button>
  </div>
  <nav class="agents" id="agents" aria-label="Daftar agen">
    <header><h2>Agen</h2><button class="btn" id="hideAgents" style="padding:4px 8px;font-size:12px">Sembunyikan</button></header>
    <p class="legend">Aktivitas di kantor adalah rutinitas simulasi. Titik di avatar hanya menyala untuk kejadian nyata dari backend chat.</p>
    <div class="list" id="agentList"></div>
  </nav>
  <aside class="detail" id="detail" aria-label="Detail" aria-hidden="true"></aside>
  <div class="cam" role="toolbar" aria-label="Kontrol kamera">
    <button id="camShowAgents" aria-label="Tampilkan daftar agen" title="Daftar agen" style="display:none">${ICON.people}</button>
    <button id="camRotL" aria-label="Putar kiri (Q)" title="Putar kiri (Q)">${ICON.rotL}</button>
    <button id="camRotR" aria-label="Putar kanan (E)" title="Putar kanan (E)">${ICON.rotR}</button>
    <span class="sep"></span>
    <button id="camOut" aria-label="Perkecil" title="Perkecil">${ICON.minus}</button>
    <button id="camIn" aria-label="Perbesar" title="Perbesar">${ICON.plus}</button>
    <span class="sep"></span>
    <button id="camReset" aria-label="Reset kamera (R)" title="Reset kamera (R)">${ICON.home}</button>
    <select id="camPreset" aria-label="Pilih tampilan ruangan"><option value="">Tampilan…</option>${rooms.map(r => `<option value="${r.id}">${esc(r.name)}</option>`).join('')}</select>
  </div>
  <div class="popover" id="settings" role="dialog" aria-label="Pengaturan">
    <h3>Pengaturan tampilan</h3>
    <label>Kualitas grafis <select id="setQuality"><option value="auto">Otomatis</option><option value="high">Tinggi</option><option value="medium">Sedang</option><option value="low">Rendah</option></select></label>
    <label>Kurangi gerakan <input type="checkbox" id="setMotion"></label>
    <label>Label nama agen terpilih <input type="checkbox" id="setLabels"></label>
    <div class="fps" id="perf"></div>
  </div>
  <div class="nametag" id="nametag"></div>
  <div class="tooltip" id="tooltip"></div>
  <div class="toast" id="toast" role="status"></div>`;

  const $ = id => document.getElementById(id);
  const agentsEl = $('agents'), detail = $('detail');

  // ---------- daftar agen
  const groups = [['Kepala ruangan', staff.filter(s => s.room !== 'umum')], ['Staf', staff.filter(s => s.room === 'umum')]];
  $('agentList').innerHTML = groups.map(([t, list]) => `<div class="group-title">${t}</div>` + list.map(s => `
    <button class="arow" data-id="${s.id}" aria-current="false">
      <span class="avatar" style="background:${color(s)}">${initials(s.name)}<i class="badge" hidden></i></span>
      <span class="meta"><b>${esc(s.name)}</b><span class="act">${esc(roomName(s.room))}</span></span>
    </button>`).join('')).join('');
  $('agentList').addEventListener('click', e => {
    const b = e.target.closest('.arow');
    if (b) { ctx.selectAgent(b.dataset.id, true); if (innerWidth <= 680) agentsEl.classList.remove('open-mobile'); }
  });
  function patchRow(id) {
    const row = $('agentList').querySelector(`[data-id="${id}"]`);
    const a = store.state.agents[id];
    if (!row || !a) return;
    row.querySelector('.act').textContent = a.activity;
    const badge = row.querySelector('.badge');
    badge.hidden = !a.backendState;
    badge.className = 'badge ' + (a.backendState || '');
    badge.title = a.backendState ? BSTATE[a.backendState] : '';
  }
  store.on('agent', id => { patchRow(id); if (store.state.selected?.type === 'agent' && store.state.selected.id === id) patchStatus(); });
  $('hideAgents').onclick = () => { agentsEl.classList.add('collapsed'); $('camShowAgents').style.display = ''; };
  $('camShowAgents').onclick = () => { agentsEl.classList.remove('collapsed'); $('camShowAgents').style.display = 'none'; };
  $('btnAgents').onclick = () => agentsEl.classList.toggle('open-mobile');

  // ---------- status backend
  function paintBackend() {
    const b = store.state.backend;
    const [txt, cls] = BACKEND_TEXT[b.status] || BACKEND_TEXT.offline;
    const chip = $('backendChip');
    chip.querySelector('.dot').className = 'dot ' + cls;
    chip.querySelector('.label').textContent = txt;
    chip.title = b.detail || txt;
    if (store.state.selected?.type === 'agent') patchChatAvailability();
  }
  store.on('backend', paintBackend);
  paintBackend();

  // ---------- panel detail
  const chats = {};
  function openDetail(html) {
    detail.innerHTML = `<button class="close" aria-label="Tutup (Esc)">×</button>` + html;
    detail.classList.add('open');
    detail.setAttribute('aria-hidden', 'false');
    detail.querySelector('.close').onclick = () => ctx.clearSelection();
  }
  function closeDetail() { detail.classList.remove('open'); detail.setAttribute('aria-hidden', 'true'); }

  function renderAgent(id) {
    const s = staffById[id];
    if (!s) return;
    const plans = store.state.plans[id] || [];
    openDetail(`
      <div class="head">
        <div class="portrait"><img alt="" src="${ctx.portrait(id)}"></div>
        <div><h2>${esc(s.name)}</h2><div class="sub">${esc(s.title)}</div><div class="room">${esc(roomName(s.room))}</div></div>
      </div>
      <div class="body">
        <div class="sec" id="statusSec"></div>
        <div class="sec"><div class="actions">
          <button class="btn primary" id="actFocus">Fokus kamera</button>
          <button class="btn" id="actFollow">Ikuti</button>
          ${s.room !== 'umum' ? `<button class="btn" id="actRoom">Lihat ruangan</button>` : ''}
        </div></div>
        <div class="sec">
          <h3>Chat dengan ${esc(s.name)}</h3>
          <div class="chatlog" id="chatlog" aria-live="polite"></div>
          <div class="chatrow"><input id="chatIn" placeholder="Tulis pesan…" autocomplete="off" aria-label="Pesan untuk ${esc(s.name)}"><button class="btn primary" id="chatSend">Kirim</button></div>
          <p class="note" id="chatNote"></p>
        </div>
        ${(ctx.org && ctx.org.leads && ctx.org.leads[id]) ? `<div class="sec subs">
          <h3>Sub-agen (${ctx.org.leads[id].length})</h3>
          ${ctx.org.leads[id].map(u => `<div class="sub"><div class="sub-head"><b>${esc(u.name)}</b><span class="stchip">${esc((ctx.org.runtime_labels && ctx.org.runtime_labels[u.runtime]) || u.runtime)}</span></div><div class="sub-role">${esc(u.role)}</div><p class="sub-desc">${esc(u.desc)}</p><div class="caps">${(u.capabilities || []).map(c => `<i class="cap">${esc(c)}</i>`).join('')}</div></div>`).join('')}
          <p class="note">Sub-agen adalah konfigurasi organisasi; status runtime ditampilkan apa adanya.</p>
        </div>` : ''}
        ${(() => { const runs = (ctx.delegations || []).filter(r => r.lead_id === id).slice(-3).reverse(); return runs.length ? `<div class="sec deleg">
          <h3>Riwayat delegasi</h3>
          ${runs.map(r => `<div class="run"><div class="run-head"><b>${esc(r.status)}</b><small>${esc((r.updated_at || '').replace('T', ' ').slice(0, 16))}</small></div><p>${esc((r.instruction || '').slice(0, 140))}</p>${r.synthesis ? `<p class="syn">${esc(r.synthesis.summary.slice(0, 220))}</p>` : ''}${r.error ? `<p class="err">${esc(r.error.slice(0, 160))}</p>` : ''}</div>`).join('')}
          <p class="note">Delegasi dijalankan pemilik lewat Telegram; status di atas adalah catatan eksekusi nyata, bukan simulasi.</p>
        </div>` : ''; })()}
        <div class="sec plans">
          <h3>Rencana kerja</h3>
          ${plans.length ? plans.map((t, i) => `<label><input type="checkbox" data-i="${i}" ${t.done ? 'checked' : ''}><span class="${t.done ? 'done' : ''}">${esc(t.title)}<small>Target: ${esc(t.eta || '-')} &middot; Progres: ${t.progress || 0}%</small><i class="pbar" aria-hidden="true"><b style="width:${t.progress || 0}%"></b></i></span></label>`).join('') : '<p class="note">Belum ada rencana.</p>'}
          <p class="note">Data contoh dari tasks.json. Status selesai hanya berubah lewat centang manual dan tersimpan di browser ini.</p>
        </div>
      </div>`);
    patchStatus();
    detail.querySelector('#actFocus').onclick = () => ctx.focusAgent(id, false);
    detail.querySelector('#actFollow').onclick = () => ctx.focusAgent(id, true);
    detail.querySelector('#actRoom')?.addEventListener('click', () => ctx.selectRoom(s.room, true));
    detail.querySelectorAll('.plans input').forEach(cb => cb.addEventListener('change', () => {
      store.setPlanDone(id, +cb.dataset.i, cb.checked);
      cb.nextElementSibling.classList.toggle('done', cb.checked);
    }));
    const log = detail.querySelector('#chatlog');
    const inp = detail.querySelector('#chatIn'), send = detail.querySelector('#chatSend');
    const hist = chats[id] ||= [];
    const paint = () => {
      log.innerHTML = hist.map(m => `<div class="msg ${m.role === 'user' ? 'u' : m.role === 'error' ? 'e' : 'a'} ${m.pending ? 'pending' : ''}">${esc(m.content)}</div>`).join('');
      log.scrollTop = log.scrollHeight;
    };
    paint();
    let busy = false;
    async function doSend() {
      const text = inp.value.trim();
      if (!text || busy) return;
      busy = true; send.disabled = true; inp.value = '';
      hist.push({ role: 'user', content: text });
      const pending = { role: 'assistant', content: 'Sedang mengetik…', pending: true };
      hist.push(pending); paint();
      const msgs = hist.filter(m => !m.pending && (m.role === 'user' || m.role === 'assistant')).slice(-12).map(m => ({ role: m.role, content: m.content }));
      const r = await bridge.chat(id, msgs);
      hist.splice(hist.indexOf(pending), 1);
      hist.push(r.ok ? { role: 'assistant', content: r.reply } : { role: 'error', content: r.code === 503 ? 'AI belum dikonfigurasi di server.' : (r.code === 429 ? 'Batas pemakaian tercapai. Coba lagi nanti.' : r.error) });
      busy = false; send.disabled = false;
      if (store.state.selected?.id === id) paint();
    }
    send.onclick = doSend;
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') doSend(); });
    patchChatAvailability();
  }
  function patchChatAvailability() {
    const note = detail.querySelector('#chatNote');
    if (!note) return;
    const st = store.state.backend.status;
    const online = st === 'online';
    note.textContent = online ? 'Pesan dikirim ke backend nyata lewat proxy /api/chat.' :
      st === 'checking' ? 'Memeriksa koneksi backend…' :
      'Backend tidak terhubung (' + (BACKEND_TEXT[st]?.[0] || st) + '). Pesan tetap bisa dicoba; hasilnya akan menampilkan error yang sebenarnya.';
  }
  function patchStatus() {
    const sel = store.state.selected;
    const sec = detail.querySelector('#statusSec');
    if (!sec || sel?.type !== 'agent') return;
    const a = store.state.agents[sel.id];
    const b = store.state.backend.status;
    sec.innerHTML = `<h3>Status</h3>
      <div class="status-row"><span class="dot ${a.backendState === 'error' ? 'err' : a.backendState ? 'ok' : (b === 'online' ? 'ok' : 'warn')}"></span>
        <span>AI backend: <b>${a.backendState ? BSTATE[a.backendState] : (BACKEND_TEXT[b]?.[0] || b)}</b></span><span class="tag real">NYATA</span></div>
      <div class="status-row"><span class="dot"></span><span>Di kantor: ${esc(a.activity)}</span><span class="tag sim">SIMULASI</span></div>
      <p class="note">Status nyata hanya berasal dari health check dan chat. Backend belum menyediakan status tugas agen.</p>`;
  }

  function renderRoom(id) {
    const r = rooms.find(x => x.id === id);
    if (!r) return;
    const st = ROOM_STYLE[id] || {};
    const head = staff.find(s => s.room === id);
    const list = roomSkills.byRoom[id];
    const isLobby = id === 'lobby';
    openDetail(`
      <div class="head">
        <div class="portrait" style="background:${st.accent || '#5b6cff'};display:grid;place-items:center;color:#fff;font-weight:800;font-size:22px">${initials(r.name)}</div>
        <div><h2>${esc(r.name)}</h2><div class="sub">${esc(r.category || '')}</div><div class="room">${head ? 'Kepala: ' + esc(head.name) : 'Fasilitas bersama'}</div></div>
      </div>
      <div class="body">
        <div class="sec"><div class="actions"><button class="btn primary" id="rmFocus">Fokus ke ruangan</button>${head ? `<button class="btn" id="rmHead">Pilih ${esc(head.name)}</button>` : ''}</div></div>
        ${list || isLobby ? `<div class="sec"><h3>Skill di ruangan ini</h3>
          <div class="big-num">${isLobby ? roomSkills.total : list.length}</div>
          <p class="note">${isLobby ? 'Total katalog. Lobby adalah pintu ke pencarian global.' : 'Estimasi dari aturan kata kunci di data/room-categories.json, bukan label resmi repo sumber.'}</p>
          <div class="actions" style="margin-top:10px"><button class="btn" id="rmBrowse">${isLobby ? 'Buka pencarian skill' : 'Lihat semua di browser skill'}</button></div>
          ${!isLobby ? `<div class="skill-list" style="margin-top:8px">${list.slice(0, 40).map(s => `<div class="it"><b>${esc(s.name)}</b><span>${esc(s.desc || '')}</span></div>`).join('')}</div>${list.length > 40 ? `<p class="note">+${list.length - 40} lainnya</p>` : ''}` : ''}
        </div>` : ''}
      </div>`);
    detail.querySelector('#rmFocus').onclick = () => ctx.focusRoom(id);
    detail.querySelector('#rmHead')?.addEventListener('click', () => ctx.selectAgent(head.id, true));
    detail.querySelector('#rmBrowse')?.addEventListener('click', () => ctx.openSkills(isLobby ? '' : id));
  }

  function renderFurniture(sel) {
    openDetail(`<div class="head"><div><h2>${esc(sel.name.replace(/_/g, ' '))}</h2><div class="sub">Model: ${esc(sel.model)}</div><div class="room">${esc(roomName(sel.room))}</div></div></div>
      <div class="body"><div class="sec"><p class="note">Objek dekoratif. Tidak terhubung ke data backend.</p></div></div>`);
  }

  store.on('select', sel => {
    $('agentList').querySelectorAll('.arow').forEach(r => r.setAttribute('aria-current', String(sel?.type === 'agent' && r.dataset.id === sel.id)));
    if (!sel) return closeDetail();
    if (sel.type === 'agent') renderAgent(sel.id);
    else if (sel.type === 'room') renderRoom(sel.id);
    else renderFurniture(sel);
  });

  // ---------- pencarian
  const q = $('q'), qres = $('qres');
  let results = [], active = 0;
  function search() {
    const t = q.value.trim().toLowerCase();
    if (!t) { qres.classList.remove('open'); results = []; return; }
    results = [
      ...staff.filter(s => (s.name + ' ' + s.title).toLowerCase().includes(t)).map(s => ({ type: 'agent', id: s.id, label: s.name, sub: s.title })),
      ...rooms.filter(r => r.name.toLowerCase().includes(t)).map(r => ({ type: 'room', id: r.id, label: r.name, sub: 'Ruangan' })),
    ].slice(0, 8);
    active = 0;
    qres.innerHTML = results.length ? results.map((r, i) => `<button role="option" class="${i === 0 ? 'active' : ''}" data-i="${i}">${esc(r.label)}<small>${esc(r.sub)}</small></button>`).join('') : '<button disabled>Tidak ada hasil</button>';
    qres.classList.add('open');
  }
  function pick(i) {
    const r = results[i];
    if (!r) return;
    q.value = ''; qres.classList.remove('open'); q.blur();
    r.type === 'agent' ? ctx.selectAgent(r.id, true) : ctx.selectRoom(r.id, true);
  }
  q.addEventListener('input', search);
  q.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % Math.max(1, results.length);
      qres.querySelectorAll('button').forEach((b, i) => b.classList.toggle('active', i === active));
    } else if (e.key === 'Enter') pick(active);
    else if (e.key === 'Escape') { q.value = ''; search(); q.blur(); }
  });
  qres.addEventListener('mousedown', e => { const b = e.target.closest('[data-i]'); if (b) { e.preventDefault(); pick(+b.dataset.i); } });
  q.addEventListener('blur', () => setTimeout(() => qres.classList.remove('open'), 150));

  // ---------- kamera & pengaturan
  $('camRotL').onclick = () => ctx.cam.rotateBy(-45);
  $('camRotR').onclick = () => ctx.cam.rotateBy(45);
  $('camIn').onclick = () => ctx.cam.zoomBy(0.75);
  $('camOut').onclick = () => ctx.cam.zoomBy(1.33);
  $('camReset').onclick = () => ctx.cam.reset();
  $('camPreset').onchange = e => { if (e.target.value) ctx.selectRoom(e.target.value, true); e.target.value = ''; };
  const pop = $('settings');
  $('btnSettings').onclick = () => { const o = pop.classList.toggle('open'); $('btnSettings').setAttribute('aria-expanded', String(o)); };
  $('setQuality').value = store.state.settings.quality;
  $('setMotion').checked = store.state.settings.reducedMotion;
  $('setLabels').checked = store.state.settings.labels;
  $('setQuality').onchange = e => store.setSetting('quality', e.target.value);
  $('setMotion').onchange = e => store.setSetting('reducedMotion', e.target.checked);
  $('setLabels').onchange = e => store.setSetting('labels', e.target.checked);
  $('btnSkills').onclick = () => ctx.openSkills('');
  $('btnBoard').onclick = () => ctx.openBoard && ctx.openBoard();

  function setClock() { $('clock').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date()); }
  setClock();
  function setPerf(txt) { $('perf').textContent = txt; }
  let toastT;
  function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200); }

  return { setClock, setPerf, toast, nametag: $('nametag'), tooltip: $('tooltip'), searchInput: q, closeDetail };
}
