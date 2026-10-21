import { esc } from '../core/util.js';

// Browser katalog skill & agen (729 entri dari skills.json). Filter jenis, repo, ruangan (estimasi).
export function createSkillsBrowser(data, roomSkills) {
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const roomOf = new Map();
  for (const id in roomSkills.byRoom) for (const s of roomSkills.byRoom[id]) roomOf.set(s, id);
  const roomName = id => data.map.rooms.find(r => r.id === id)?.name || id;
  const repos = [...new Set(skills.map(s => s.repo))].sort();
  const ov = document.createElement('div');
  ov.className = 'skills-ov';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-label', 'Browser skill');
  ov.innerHTML = `<div class="skills-box">
    <div class="skills-head">
      <input id="skQ" type="search" placeholder="Cari ${skills.length} skill & agen…" autocomplete="off" aria-label="Cari skill">
      <select id="skKind" aria-label="Jenis"><option value="">Semua jenis</option><option value="skill">Skill</option><option value="agent">Agen</option></select>
      <select id="skRepo" aria-label="Repo"><option value="">Semua repo</option>${repos.map(r => `<option>${esc(r)}</option>`).join('')}</select>
      <select id="skRoom" aria-label="Ruangan"><option value="">Semua ruangan</option>${Object.keys(roomSkills.byRoom).map(id => `<option value="${id}">${esc(roomName(id))}</option>`).join('')}</select>
      <button class="btn" id="skClose">Tutup</button>
    </div>
    <div class="skills-count" id="skCount"></div>
    <div class="skills-list skill-list" id="skList"></div>
  </div>`;
  document.body.appendChild(ov);
  const $ = id => ov.querySelector('#' + id);
  const MAX = 150;
  function render() {
    const q = $('skQ').value.trim().toLowerCase(), k = $('skKind').value, rp = $('skRepo').value, rm = $('skRoom').value;
    const res = skills.filter(s => (!k || s.kind === k) && (!rp || s.repo === rp) && (!rm || roomOf.get(s) === rm) &&
      (!q || (s.name + ' ' + (s.desc || '') + ' ' + s.cat).toLowerCase().includes(q)));
    $('skCount').textContent = `${res.length} hasil${res.length > MAX ? `, menampilkan ${MAX} pertama` : ''}${rm ? '. Pemetaan ruangan adalah estimasi.' : ''}`;
    $('skList').innerHTML = res.slice(0, MAX).map(s => `<div class="it"><b>${esc(s.name)}</b><span>${esc(s.kind === 'agent' ? 'Agen' : 'Skill')}, ${esc(s.repo)}${s.cat && s.cat !== s.repo ? ' / ' + esc(s.cat) : ''}${roomOf.get(s) ? ', ' + esc(roomName(roomOf.get(s))) : ''}. ${esc(s.desc || '')}</span></div>`).join('');
  }
  ['skQ', 'skKind', 'skRepo', 'skRoom'].forEach(id => $(id).addEventListener('input', render));
  const close = () => ov.classList.remove('open');
  $('skClose').onclick = close;
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  ov.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  return {
    open(room = '') { $('skRoom').value = room; ov.classList.add('open'); render(); $('skQ').focus(); },
    close, get isOpen() { return ov.classList.contains('open'); },
  };
}
