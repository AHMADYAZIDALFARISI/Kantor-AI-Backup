import './ui/styles.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { createStore } from './state/store.js';
import { classifySkills } from './state/skills.js';
import { createBridge } from './integration/bridge.js';
import { createRenderer } from './scene/renderer.js';
import { createCameraRig } from './scene/camera.js';
import { buildEnvironment, ROOM_STYLE } from './scene/environment.js';
import { createScreens } from './scene/screens.js';
import { buildFurniture } from './scene/furniture.js';
import { loadCharacters, createSelection, createPortraits } from './scene/characters.js';
import { createNav } from './behavior/nav.js';
import { createAgents } from './behavior/agents.js';
import { createShell } from './ui/shell.js';
import { createSkillsBrowser } from './ui/skillsBrowser.js';
import { createBoardPanel } from './ui/boardPanel.js';

const bootBar = document.querySelector('#boot .boot-bar i');
const bootStep = document.querySelector('#boot .boot-step');
const progress = (p, step) => { bootBar.style.width = Math.round(p * 100) + '%'; if (step) bootStep.textContent = step; };

function fail(msg) {
  document.querySelector('#boot .boot-card').innerHTML = `<div class="boot-mark">TK</div><h1>Kantor tidak bisa dimuat</h1><p class="boot-error">${msg}</p>`;
}

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

async function loadData() {
  const files = { map: 'map.json', staff: 'staff.json', tasks: 'tasks.json', divisions: 'divisions.json', skills: 'skills.json', rules: 'room-categories.json', org: 'org.json', delegations: 'delegations.json' };
  const out = {};
  const optional = new Set(['org', 'delegations']); // file opsional: gagal muat tidak boleh mematikan boot
  await Promise.all(Object.entries(files).map(async ([k, f]) => {
    try {
      const r = await fetch('data/' + f);
      if (!r.ok) throw new Error(`data/${f}: HTTP ${r.status}`);
      out[k] = await r.json();
    } catch (e) { if (!optional.has(k)) throw e; out[k] = null; }
  }));
  return out;
}

async function boot() {
  if (!webglOK()) return fail('Browser ini tidak mendukung WebGL. Coba Chrome, Edge, Firefox, atau Safari versi terbaru, lalu pastikan akselerasi perangkat keras aktif.');
  progress(0.05, 'Memuat data kantor');
  const data = await loadData();
  const store = createStore(data);
  const roomSkills = classifySkills(data.skills, data.rules);

  const stage = document.getElementById('stage');
  const R = createRenderer(stage, store.state.settings);
  const cam = createCameraRig(R.renderer.domElement, store);
  const env = buildEnvironment(R.scene, data);
  cam.onQuadrant(q => env.setQuadrant(q));
  const screens = createScreens();
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);

  const roomBoards = {};
  const staffRoom = Object.fromEntries((data.staff || []).map(x => [x.id, x.room]));
  const roomTaskAgg = {};
  for (const aid in (data.tasks || {})) {
    const rid = staffRoom[aid]; if (!rid) continue;
    const list = data.tasks[aid];
    const done = list.filter(t => t.done || (Number(t.progress) || 0) >= 100).length;
    const avg = list.length ? Math.round(list.reduce((a, t) => a + (Number(t.progress) || 0), 0) / list.length) : 0;
    const cur = roomTaskAgg[rid] || { n: 0, d: 0, sum: 0 };
    cur.n += list.length; cur.d += done; cur.sum += avg * list.length;
    roomTaskAgg[rid] = cur;
  }
  const taskCaption = rid => {
    const a = roomTaskAgg[rid]; if (!a) return null;
    return `${a.n} tugas \u00B7 rata-rata ${Math.round(a.sum / a.n)}% \u00B7 ${a.d} selesai`;
  };
  for (const r of data.map.rooms) {
    const st = ROOM_STYLE[r.id] || {};
    const cap = taskCaption(r.id);
    if (r.id === 'lobby') roomBoards[r.id] = { name: r.name, count: roomSkills.total, caption: cap || 'skill & agen di katalog', accent: st.accent };
    else if (roomSkills.byRoom[r.id]) roomBoards[r.id] = { name: r.name, count: roomSkills.byRoom[r.id].length, caption: cap || 'skill (estimasi aturan)', accent: st.accent };
  }
  progress(0.15, 'Membangun furnitur');
  const furn = await buildFurniture(R.scene, data, env, screens, loader, p => progress(0.15 + p * 0.4), roomBoards);
  progress(0.55, 'Memuat karakter');
  const { figs } = await loadCharacters(R.scene, data, loader, p => progress(0.55 + p * 0.4));
  const nav = createNav(data.map.collision);
  const agents = createAgents({ data, figs, nav, seats: furn.seats, store });
  const selection = createSelection(R.scene);
  const portrait = createPortraits(R.renderer, figs);
  const bridge = createBridge(store);

  // ---------- seleksi & fokus
  const posOf = id => agents.positionOf(id);
  function selectAgent(id, focus) {
    store.select({ type: 'agent', id });
    if (focus) cam.focusPoint(posOf(id), 11);
    syncHash();
  }
  function selectRoom(id, focus) {
    const room = data.map.rooms.find(r => r.id === id);
    if (!room) return;
    store.select({ type: 'room', id });
    if (focus) cam.focusRoom(room);
    syncHash();
  }
  function clearSelection() { store.select(null); cam.stopFollow(); syncHash(); }
  const skillsUI = createSkillsBrowser(data, roomSkills);
  const boardUI = createBoardPanel(data, store, { pick: id => selectAgent(id, false) });
  const shell = createShell({
    store, data, bridge, roomSkills, cam, portrait, selectAgent, selectRoom, clearSelection,
    org: data.org || null,
    delegations: (data.delegations && data.delegations.runs) || [],
    focusAgent: (id, follow) => cam.focusPoint(posOf(id), 8, follow ? () => posOf(id) : null),
    focusRoom: id => { const r = data.map.rooms.find(x => x.id === id); if (r) cam.focusRoom(r); },
    openSkills: room => skillsUI.open(room),
    openBoard: () => boardUI.open(),
  });
  function syncHash() {
    const s = store.state.selected;
    const h = !s ? '' : s.type === 'agent' ? '#char=' + s.id : s.type === 'room' ? '#room=' + s.id : '';
    if (location.hash !== h) history.replaceState(null, '', h || location.pathname + location.search);
  }

  // ---------- picking (klik dibedakan dari drag)
  const dom = R.renderer.domElement;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  let down = null, hovered = null;
  function setNdc(e) { const r = dom.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, cam.camera); }
  function pickAgent() {
    let best = null, bd = Infinity;
    const box = new THREE.Box3(), hit = new THREE.Vector3();
    for (const a of agents.agents) {
      const p = a.pos, seated = a.state === 'seated';
      box.min.set(p.x - 0.32, 0, p.z - 0.32); box.max.set(p.x + 0.32, seated ? 1.45 : 1.85, p.z + 0.32);
      if (ray.ray.intersectBox(box, hit)) { const d = hit.distanceTo(ray.ray.origin); if (d < bd) { bd = d; best = a; } }
    }
    return best ? { agent: best, d: bd } : null;
  }
  function roomAt(point) {
    return data.map.rooms.find(r => { const [x, z, w, d] = r.rect_tiles; return point.x >= x && point.x < x + w && point.z >= z && point.z < z + d; });
  }
  dom.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
  dom.addEventListener('pointerup', e => {
    if (!down) return;
    const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
    down = null;
    if (moved > 6) return;
    setNdc(e);
    const ag = pickAgent();
    const fu = furn.raycast(ray.ray);
    if (ag && (!fu || ag.d <= fu.distance + 0.3)) return selectAgent(ag.agent.id, false);
    if (fu && e.detail >= 2) { store.select(fu.pick); return; }
    const pt = new THREE.Vector3();
    if (ray.ray.intersectPlane(ground, pt)) {
      const room = roomAt(pt);
      if (room) return selectRoom(room.id, e.detail >= 2);
    }
    clearSelection();
  });
  let lastMove = null;
  dom.addEventListener('pointermove', e => { lastMove = e; });
  dom.addEventListener('pointerleave', () => { lastMove = null; hovered = null; dom.style.cursor = ''; shell.tooltip.style.display = 'none'; });

  // ---------- keyboard
  let tabIdx = -1;
  window.addEventListener('keydown', e => {
    const tag = e.target?.tagName;
    if ((tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') && e.key !== 'Escape') return;
    if (skillsUI.isOpen) return;
    const k = e.key.toLowerCase();
    if (e.key === '/') { e.preventDefault(); shell.searchInput.focus(); }
    else if (e.key === 'Escape') clearSelection();
    else if (k === 'q') cam.rotateBy(-45);
    else if (k === 'e') cam.rotateBy(45);
    else if (k === 'r') cam.reset();
    else if (k === 's') skillsUI.open('');
    else if (k === 'f' && store.state.selected?.type === 'agent') cam.focusPoint(posOf(store.state.selected.id), 8, () => posOf(store.state.selected?.id));
    else if (k === '+' || k === '=') cam.zoomBy(0.8);
    else if (k === '-') cam.zoomBy(1.25);
    else if (e.key === 'Tab' && !e.target.closest?.('.detail, .agents, .topbar, .cam, .popover')) {
      e.preventDefault();
      const ids = (data.staff || []).map(s => s.id);
      tabIdx = (tabIdx + (e.shiftKey ? -1 : 1) + ids.length) % ids.length;
      selectAgent(ids[tabIdx], true);
    } else if (k >= '1' && k <= '9' && !e.ctrlKey && !e.metaKey) {
      const r = data.map.rooms[+k - 1]; if (r) selectRoom(r.id, true);
    }
  });

  // ---------- pengaturan
  store.on('settings', k => {
    if (k === 'quality') R.applyTier(store.state.settings.quality === 'auto' ? R.tier : store.state.settings.quality);
  });

  // ---------- loop tunggal
  const clock = new THREE.Clock();
  const tmpV = new THREE.Vector3();
  let fpsAcc = 0, fpsN = 0, simAcc = 0, hoverAcc = 0;
  function updateInsets() {
    if (innerWidth <= 680) return cam.setInsets(0, 0);
    const ag = document.getElementById('agents'), de = document.getElementById('detail');
    const left = ag && !ag.classList.contains('collapsed') ? ag.offsetWidth + 12 : 0;
    const right = de && de.classList.contains('open') ? de.offsetWidth + 12 : 0;
    cam.setInsets(left, right);
  }
  store.on('select', () => setTimeout(updateInsets, 0));
  document.getElementById('hideAgents').addEventListener('click', () => setTimeout(updateInsets, 0));
  document.getElementById('camShowAgents').addEventListener('click', () => setTimeout(updateInsets, 0));
  function onResize() { const { w, h } = R.resize(); cam.resize(w, h); updateInsets(); }
  window.addEventListener('resize', onResize);
  onResize();
  updateInsets();
  cam.reset();

  function frame() {
    requestAnimationFrame(frame);
    if (document.hidden) { clock.getDelta(); return; }
    const dt = Math.min(0.1, clock.getDelta());
    const t = clock.elapsedTime;
    const reduced = store.state.settings.reducedMotion;
    // jam simulasi: 1 detik = 1 menit
    store.state.simMinutes = (store.state.simMinutes + dt) % 1440;
    simAcc += dt;
    if (simAcc > 1) { simAcc = 0; shell.setClock(); }
    agents.update(dt);
    cam.update(dt);
    env.update(dt);
    furn.update();
    screens.update(dt, reduced);
    const shadowsOn = R.renderer.shadowMap.enabled;
    for (const id in figs) figs[id].blob.visible = !shadowsOn;
    // hover (dibatasi 15 Hz)
    hoverAcc += dt;
    if (lastMove && hoverAcc > 0.066) {
      hoverAcc = 0; setNdc(lastMove);
      const ag = pickAgent();
      hovered = ag ? ag.agent : null;
      dom.style.cursor = hovered ? 'pointer' : '';
      const tip = shell.tooltip;
      if (hovered) { tip.textContent = hovered.fig.staff.name; tip.style.left = lastMove.clientX + 'px'; tip.style.top = lastMove.clientY + 'px'; tip.style.display = 'block'; }
      else tip.style.display = 'none';
    }
    const sel = store.state.selected?.type === 'agent' ? agents.agents.find(a => a.id === store.state.selected.id) : null;
    selection.update(t, sel?.pos, hovered?.pos);
    // label nama agen terpilih
    const tag = shell.nametag;
    if (sel && store.state.settings.labels) {
      tmpV.copy(sel.pos); tmpV.y = sel.state === 'seated' ? 1.6 : 2.0;
      tmpV.project(cam.camera);
      if (tmpV.z < 1) {
        const r = dom.getBoundingClientRect();
        tag.style.left = (r.left + (tmpV.x + 1) / 2 * r.width) + 'px';
        tag.style.top = (r.top + (1 - tmpV.y) / 2 * r.height) + 'px';
        tag.innerHTML = `<span class="dot ${sel.backend?.state === 'error' ? 'err' : sel.backend ? 'ok' : ''}"></span>${sel.fig.staff.name}`;
        tag.style.display = 'block';
      } else tag.style.display = 'none';
    } else tag.style.display = 'none';
    R.renderer.render(R.scene, cam.camera);
    R.sample(dt);
    fpsAcc += dt; fpsN++;
    if (fpsAcc > 1) {
      const info = R.renderer.info.render;
      shell.setPerf(`${Math.round(fpsN / fpsAcc)} fps, ${info.calls} draw call, ${Math.round(info.triangles / 1000)}k segitiga, tier ${R.tier}`);
      fpsAcc = 0; fpsN = 0;
    }
  }
  frame();

  // deep link
  const h = location.hash.slice(1);
  if (h.startsWith('char=')) selectAgent(h.slice(5), true);
  else if (h.startsWith('room=')) selectRoom(h.slice(5), true);

  progress(1, 'Siap');
  document.getElementById('boot').classList.add('done');
  // kait uji otomatis: majukan simulasi tanpa render
  function fastForward(sec) { for (let s = 0; s < sec; s += 0.1) { agents.update(0.1); store.state.simMinutes = (store.state.simMinutes + 0.1) % 1440; } }
  window.__office = { fastForward, THREE, R, cam, env, furn, figs, agents, store, data, bridge, roomSkills, selectAgent, selectRoom };
}

boot().catch(err => { console.error(err); fail('Terjadi kesalahan saat memuat: ' + (err?.message || err)); });
