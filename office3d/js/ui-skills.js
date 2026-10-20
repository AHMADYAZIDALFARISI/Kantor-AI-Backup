export function createSkillsBrowser(opts) {
  const data = (opts && opts.data) || {};
  const skills = Array.isArray(data.skills) ? data.skills : [];
  const total = skills.length;
  const MAX = 120;

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const style = document.createElement('style');
  style.textContent = `#gskills{position:fixed;inset:0;z-index:50;display:none;align-items:center;justify-content:center;background:rgba(8,10,14,.72);backdrop-filter:blur(6px);font-family:Inter,system-ui,sans-serif}
#gskills.open{display:flex}
.sk-panel{width:min(760px,94vw);height:min(640px,88vh);background:#141a24;border:1px solid rgba(255,255,255,.1);border-radius:16px;display:flex;flex-direction:column;overflow:hidden;color:#eef2f7}
.sk-head{padding:14px 18px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;gap:10px;align-items:center}
.sk-head input{flex:1;padding:9px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:#0e131b;color:#fff;font-size:14px}
.sk-head select{padding:9px;border-radius:10px;background:#0e131b;color:#fff;border:1px solid rgba(255,255,255,.15)}
.sk-close{background:none;border:none;color:#9fb0c3;font-size:20px;cursor:pointer}
.sk-list{flex:1;overflow-y:auto;padding:8px}
.sk-item{padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer}
.sk-item:hover{background:rgba(255,255,255,.04)}
.sk-name{font-weight:600;font-size:14px}
.sk-meta{font-size:11px;color:#8fa0b5;margin:2px 0}
.sk-desc{font-size:12px;color:#c4cfdb;display:none;margin-top:4px;line-height:1.5}
.sk-item.exp .sk-desc{display:block}
.sk-count{font-size:12px;color:#8fa0b5;padding:8px 12px}
.chip{display:inline-block;padding:1px 8px;border-radius:10px;background:rgba(74,144,217,.18);color:#7fb3e8;font-size:10px;margin-right:6px}`;
  document.head.appendChild(style);

  const cats = [...new Set(skills.map((s) => s.cat).filter(Boolean))].sort();

  const ov = document.createElement('div');
  ov.id = 'gskills';
  ov.innerHTML = `<div class="sk-panel"><div class="sk-head"><input id="skin" type="text" placeholder="Cari ${total} skill &amp; agen…" autocomplete="off"><select id="skind"><option value="">Semua</option><option value="skill">Skill</option><option value="agent">Agen</option></select><select id="scat"><option value="">Semua kategori</option>${cats.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select><button class="sk-close" title="Tutup">×</button></div><div class="sk-count"></div><div class="sk-list"></div></div>`;
  document.body.appendChild(ov);

  const inp = ov.querySelector('#skin');
  const selKind = ov.querySelector('#skind');
  const selCat = ov.querySelector('#scat');
  const countEl = ov.querySelector('.sk-count');
  const listEl = ov.querySelector('.sk-list');

  function render() {
    const q = inp.value.trim().toLowerCase();
    const k = selKind.value;
    const c = selCat.value;
    const res = skills.filter((s) => {
      if (k && s.kind !== k) return false;
      if (c && s.cat !== c) return false;
      if (q && !((s.name || '') + ' ' + (s.desc || '')).toLowerCase().includes(q)) return false;
      return true;
    });
    const shown = res.slice(0, MAX);
    countEl.textContent = `Menampilkan ${shown.length} dari ${total}`;
    let html = shown.map((s) => `<div class="sk-item"><div class="sk-name">${s.emoji ? esc(s.emoji) + ' ' : ''}${esc(s.name)}</div><div class="sk-meta"><span class="chip">${esc(s.kind === 'agent' ? 'agen' : 'skill')}</span><span class="chip">${esc(s.repo)}</span>${esc(s.path)}</div><div class="sk-desc">${esc(s.desc)}</div></div>`).join('');
    if (res.length > MAX) html += `<div class="sk-count">+${res.length - MAX} lagi, persempit pencarian</div>`;
    if (!res.length) html = `<div class="sk-count">Tidak ada hasil untuk pencarian ini</div>`;
    listEl.innerHTML = html;
  }

  listEl.addEventListener('click', e => {
    const it = e.target.closest('.sk-item');
    if (it) it.classList.toggle('exp');
  });
  inp.addEventListener('input', render);
  selKind.addEventListener('change', render);
  selCat.addEventListener('change', render);

  function open() { ov.classList.add('open'); render(); try { inp.focus(); } catch (e) {} }
  function close() { ov.classList.remove('open'); }

  ov.querySelector('.sk-close').addEventListener('click', close);
  ov.addEventListener('click', e => { if (e.target === ov) close(); });
  window.addEventListener('keydown', e => {
    const tag = e.target && e.target.tagName;
    if (e.key === 'Escape' && ov.classList.contains('open')) { close(); return; }
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (e.key.toLowerCase() === 's') { ov.classList.contains('open') ? close() : open(); }
  });

  const btn = document.createElement('button');
  btn.id = 'gskillsbtn';
  btn.textContent = 'Skills (S)';
  btn.style.cssText = 'position:fixed;bottom:14px;left:110px;z-index:30;padding:8px 12px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:rgba(16,20,28,0.88);color:#eef2f7;font-family:Inter,system-ui,sans-serif;font-size:12px;cursor:pointer';
  btn.addEventListener('click', () => { ov.classList.contains('open') ? close() : open(); });
  document.body.appendChild(btn);

  render();
  return { open, close };
}