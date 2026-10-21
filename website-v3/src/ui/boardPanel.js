import { esc } from '../core/util.js';

// Panel Papan Kerja: kanban 3 kolom dari data tasks.json yang sebenarnya.
// Status diturunkan dari progres (didokumentasikan, bukan dikarang):
// 0% = Antre, 1-99% = Berlangsung, selesai/100% = Selesai.
const STATUS = [
  ['backlog', 'Antre'],
  ['doing', 'Berlangsung'],
  ['done', 'Selesai'],
];
function statusOf(t) {
  if (t.done || (t.progress || 0) >= 100) return 'done';
  if ((t.progress || 0) > 0) return 'doing';
  return 'backlog';
}

export function createBoardPanel(data, store, { pick } = {}) {
  const staffById = Object.fromEntries((data.staff || []).map(s => [s.id, s]));
  const roomName = id => data.map.rooms.find(r => r.id === id)?.name || id;
  const rooms = [...new Set((data.staff || []).map(s => s.room))].sort((a, b) => roomName(a).localeCompare(roomName(b)));
  const ov = document.createElement('div');
  ov.className = 'board-ov';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-label', 'Papan kerja');
  ov.innerHTML = `<div class="board-box">
    <div class="board-head">
      <b>Papan Kerja</b>
      <select id="bdRoom" aria-label="Filter ruangan"><option value="">Semua ruangan</option>${rooms.map(id => `<option value="${esc(id)}">${esc(roomName(id))}</option>`).join('')}</select>
      <button class="btn" id="bdClose">Tutup</button>
    </div>
    <p class="board-note">Data dari tasks.json. Status kolom diturunkan dari progres: 0% = Antre, 1\u201399% = Berlangsung, 100%/selesai = Selesai. Sebagian besar tugas saat ini masih data contoh paket; tugas operasional masuk lewat bot Telegram.</p>
    <div class="board-cols" id="bdCols"></div>
  </div>`;
  document.body.appendChild(ov);
  const $ = id => ov.querySelector('#' + id);
  function render() {
    const rm = $('bdRoom').value;
    const items = [];
    for (const [aid, list] of Object.entries(store.state.plans || {})) {
      const s = staffById[aid];
      if (!s || (rm && s.room !== rm)) continue;
      (list || []).forEach((t, i) => items.push({ aid, i, t, name: s.name, room: s.room }));
    }
    const bySt = Object.fromEntries(STATUS.map(([k]) => [k, []]));
    for (const it of items) bySt[statusOf(it.t)].push(it);
    $('bdCols').innerHTML = STATUS.map(([k, label]) => `
      <div class="bcol"><h4>${label} <span class="cnt">${bySt[k].length}</span></h4>
      <div class="bcards">${bySt[k].length ? bySt[k].map(it => `
        <button class="bcard" data-aid="${esc(it.aid)}" data-i="${it.i}">
          <b>${esc(it.t.title)}</b>
          <small>${esc(it.name)} \u00B7 ${esc(roomName(it.room))}</small>
          <i class="pbar" aria-hidden="true"><b style="width:${it.t.progress || 0}%"></b></i>
          <small class="eta">Progres ${it.t.progress || 0}% \u00B7 Target ${esc(it.t.eta || '-')}</small>
        </button>`).join('') : '<p class="empty">Kosong.</p>'}
      </div></div>`).join('');
    ov.querySelectorAll('.bcard').forEach(b => b.addEventListener('click', () => {
      close(); pick && pick(b.dataset.aid);
    }));
  }
  $('bdRoom').addEventListener('input', render);
  const close = () => ov.classList.remove('open');
  $('bdClose').onclick = close;
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  ov.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  store.on('plans', render);
  return { open: () => { render(); ov.classList.add('open'); $('bdClose').focus(); }, close };
}
