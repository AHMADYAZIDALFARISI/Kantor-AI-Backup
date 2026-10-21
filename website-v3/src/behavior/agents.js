import * as THREE from 'three';
import { play } from '../scene/characters.js';
import { rng, hashStr, lerpAngle } from '../core/util.js';

// Pemetaan animasi POI pixel-art → klip 3D.
const POI_ANIM = { type: 'type', sit: 'sit', crossed: 'crossed', talk: 'talk', drink: 'listen', walk_up: 'walk',
  lift: 'celebrate', idle_up: 'think', wave: 'point', phone: 'phone' };
const FACE_NORTH = new Set(['type', 'idle_up', 'walk_up']);
const LABEL = {
  desk: 'Bekerja di meja', board: 'Memantau papan ruangan', work: 'Mengecek peralatan', coffee: 'Rehat kopi',
  eat: 'Makan siang', rest: 'Istirahat di sofa', meeting: 'Rapat', gym: 'Olahraga', kiosk: 'Mencari di direktori',
  shoot: 'Sesi rekaman', wander: 'Berjalan', home: 'Kembali ke ruangan',
};
const SPEED = 1.45; // m/s (cocok dengan langkah klip walk)

export function createAgents({ data, figs, nav, seats, store }) {
  const up = new THREE.Vector3(0, 1, 0);
  const pois = (data.map.pois || []).map((p, i) => ({
    i, room: p.room, tag: p.tag, who: p.who || 'any', anim: POI_ANIM[p.anim] || 'idle', srcAnim: p.anim,
    pos: new THREE.Vector3(p.x / 16, 0, p.y / 16), taken: null,
  }));
  const staffById = Object.fromEntries((data.staff || []).map(s => [s.id, s]));
  const spawnById = Object.fromEntries((data.map.agents || []).map(a => [a.id, a]));
  const agents = [];

  for (const id in figs) {
    const s = staffById[id], sp = spawnById[id];
    const fig = figs[id];
    const role = s.room === 'umum' ? 'staff' : 'head';
    const start = sp ? new THREE.Vector3(sp.spawn[0] / 16, 0, sp.spawn[1] / 16) : new THREE.Vector3(32, 0, 15.5);
    const t = nav.nearestWalkable(start.x, start.z);
    if (t) start.set(t[0] + 0.5, 0, t[1] + 0.5);
    fig.root.position.copy(start);
    agents.push({
      id, fig, role, room: s.room, rand: rng(hashStr(id)), pos: fig.root.position, heading: 0,
      state: 'idle', path: [], timer: 1 + agents.length * 0.6, poi: null, seat: null, anim: 'idle',
      tile: null, wait: 0, speed: 0, exitTo: null, backend: null, label: 'Bersiap', source: 'ambient',
      approach: null, seatT: 0,
    });
  }

  function release(a) {
    if (a.poi) { a.poi.taken = null; a.poi = null; }
    if (a.seat) { a.seat.taken = null; a.seat = null; }
  }

  // ---------------- penjadwalan ambient (deterministik per agen)
  function phase(min) {
    const h = (min / 60) % 24;
    if (h >= 10 && h < 10.5) return 'coffee';
    if (h >= 12 && h < 13) return 'eat';
    if (h >= 13 && h < 14) return 'meeting';
    if (h >= 17 && h < 18) return 'gym';
    if (h >= 18 || h < 7) return 'rest';
    return 'work';
  }
  function freeSeatFor(room, types, a) {
    const list = seats.filter(s => !s.taken && (!room || s.room === room) && (!types || types.includes(s.type)));
    if (!list.length) return null;
    return list[Math.floor(a.rand() * list.length)];
  }
  function freePoi(filter, a) {
    const list = pois.filter(p => !p.taken && filter(p));
    if (!list.length) return null;
    return list[Math.floor(a.rand() * list.length)];
  }
  function chooseActivity(a) {
    const ph = phase(store.state.simMinutes);
    const r = a.rand();
    const own = a.role === 'head' ? a.room : null;
    // fasilitas sesuai jam (tidak semua agen ikut, supaya tidak penuh)
    if (ph === 'coffee' && r < 0.5) { const p = freePoi(p => p.tag === 'coffee', a); if (p) return { poi: p, tag: 'coffee', anim: 'listen', dur: 25 }; }
    if (ph === 'eat' && r < 0.75) { const s = freeSeatFor('kantin', ['dining_set', 'bar_stool'], a); if (s) return { seat: s, tag: 'eat', anim: 'sit', dur: 40 }; }
    if (ph === 'meeting' && a.role === 'head' && r < 0.55) { const s = freeSeatFor('rapat', ['chair_meeting'], a); if (s) return { seat: s, tag: 'meeting', anim: r < 0.3 ? 'talk' : 'sit', dur: 45 }; }
    if (ph === 'gym' && r < 0.4) { const p = freePoi(p => p.tag === 'gym', a); if (p) return { poi: p, tag: 'gym', anim: p.anim, dur: 30 }; }
    if (ph === 'rest' && r < 0.6) { const s = freeSeatFor(null, ['sofa', 'armchair', 'bench'], a); if (s) return { seat: s, tag: 'rest', anim: a.rand() < 0.5 ? 'rest' : 'phone', dur: 50 }; }
    if (own) {
      const r2 = a.rand();
      if (r2 < 0.45) {
        const s = freeSeatFor(own, ['chair_office', 'chair_exec'], a);
        if (s) return { seat: s, tag: 'desk', anim: s.type === 'chair_exec' ? 'sit' : 'type', dur: 30 + a.rand() * 30 };
      }
      if (r2 < 0.7) { const p = freePoi(p => p.room === own && p.tag === 'board', a); if (p) return { poi: p, tag: 'board', anim: a.rand() < 0.6 ? 'crossed' : 'talk', dur: 18 }; }
      const p = freePoi(p => p.room === own && ['work', 'shoot', 'desk', 'kiosk'].includes(p.tag) && p.anim !== 'type' && p.anim !== 'sit', a);
      if (p) return { poi: p, tag: p.tag, anim: p.anim === 'idle' ? 'think' : p.anim, dur: 20 };
      const s = freeSeatFor(own, null, a);
      if (s) return { seat: s, tag: 'desk', anim: 'type', dur: 30 };
    }
    // staf umum: bergerak antar fasilitas & meja kosong
    const pick = a.rand();
    if (pick < 0.35) { const s = freeSeatFor(null, ['chair_office'], a); if (s) return { seat: s, tag: 'desk', anim: 'type', dur: 35 }; }
    if (pick < 0.55) { const p = freePoi(p => p.tag === 'kiosk' || p.tag === 'coffee', a); if (p) return { poi: p, tag: p.tag, anim: p.tag === 'kiosk' ? 'think' : 'listen', dur: 15 }; }
    if (pick < 0.75) { const s = freeSeatFor(null, ['sofa', 'bench', 'armchair'], a); if (s) return { seat: s, tag: 'rest', anim: 'phone', dur: 25 }; }
    const p = freePoi(p => p.who !== 'head' && p.tag !== 'desk', a);
    if (p) return { poi: p, tag: p.tag, anim: p.anim, dur: 18 };
    return null;
  }

  function goTo(a, act, source = 'ambient') {
    release(a);
    standUp(a);
    a.act = act;
    a.source = source;
    let target;
    if (act.seat) { act.seat.taken = a.id; a.seat = act.seat; target = act.seat.pos; }
    else if (act.poi) { act.poi.taken = a.id; a.poi = act.poi; target = act.poi.pos; }
    else return false;
    const st = nav.nearestWalkable(a.pos.x, a.pos.z);
    const tt = nav.nearestWalkable(target.x, target.z);
    if (!st || !tt) { release(a); return false; }
    const path = nav.findPath(st[0], st[1], tt[0], tt[1]);
    if (!path) { release(a); return false; }
    a.path = path.map(([x, y]) => new THREE.Vector3(x + 0.5, 0, y + 0.5));
    a.approach = target.clone();
    a.state = 'walking';
    a.label = (source === 'backend' ? 'Menuju meja: memproses chat' : (LABEL[act.tag] ? 'Menuju: ' + LABEL[act.tag].toLowerCase() : 'Berjalan'));
    publish(a);
    return true;
  }

  function standUp(a) {
    if (a.state === 'seated' && a.seatFrom) { a.pos.copy(a.seatFrom); }
    a.seatFrom = null;
  }

  function arrive(a) {
    const act = a.act;
    a.state = act.seat ? 'seated' : 'acting';
    a.timer = act.dur;
    let face;
    if (act.seat) { a.seatFrom = a.pos.clone(); a.seatT = 0; face = act.seat.rot; }
    else face = FACE_NORTH.has(act.poi.srcAnim) ? Math.PI : 0;
    a.targetHeading = face;
    a.anim = act.anim;
    play(a.fig, act.anim);
    a.label = a.source === 'backend' ? a.label : (LABEL[act.tag] || 'Beraktivitas');
    publish(a);
  }

  function publish(a) {
    store.setAgent(a.id, { activity: a.label, mode: a.state, source: a.source, backendState: a.backend?.state || null });
  }

  // ---------------- kejadian backend nyata
  store.on('agent-event', ev => {
    const a = agents.find(x => x.id === ev.agentId);
    if (!a) return;
    if (ev.type === 'chat_start') {
      a.backend = { state: 'thinking', at: Date.now() };
      const seat = seats.find(s => s.room === a.room && (s.type === 'chair_office' || s.type === 'chair_exec') && (!s.taken || s.taken === a.id))
        || seats.find(s => !s.taken && s.type === 'chair_office');
      a.label = 'Memproses chat (backend)';
      if (a.seat && a.state === 'seated') { a.anim = 'type'; play(a.fig, 'type'); a.timer = 9999; a.source = 'backend'; publish(a); }
      else if (!seat || !goTo(a, { seat, tag: 'desk', anim: 'type', dur: 9999 }, 'backend')) {
        a.state = 'acting'; a.anim = 'think'; play(a.fig, 'think'); a.timer = 9999; a.source = 'backend'; publish(a);
      }
    } else if (ev.type === 'chat_reply' || ev.type === 'chat_error') {
      const ok = ev.type === 'chat_reply';
      a.backend = { state: ok ? 'replied' : 'error', at: Date.now(), error: ev.error };
      a.source = 'backend';
      a.label = ok ? 'Membalas chat (backend)' : 'Chat gagal: ' + (ev.error || 'error');
      if (a.state === 'walking') { a.pendingReaction = ok ? 'talk' : 'error'; }
      else {
        standUp(a); release(a);
        a.state = 'reacting'; a.anim = ok ? 'talk' : 'error'; play(a.fig, a.anim); a.timer = ok ? 5 : 4;
      }
      publish(a);
    }
  });

  // ---------------- loop
  const tmp = new THREE.Vector3();
  function update(dt) {
    for (const a of agents) {
      const fig = a.fig;
      if (a.state === 'idle') {
        a.timer -= dt;
        if (a.timer <= 0) {
          const act = chooseActivity(a);
          if (!act || !goTo(a, act)) { a.timer = 2 + a.rand() * 3; play(fig, 'idle'); }
        }
      } else if (a.state === 'walking') {
        walk(a, dt);
      } else if (a.state === 'seated' || a.state === 'acting') {
        if (a.state === 'seated' && a.seatT < 1) {
          a.seatT = Math.min(1, a.seatT + dt * 2.2);
          a.pos.lerpVectors(a.seatFrom, a.seat.pos, a.seatT);
        }
        a.timer -= dt;
        if (a.timer <= 0) {
          if (a.source === 'backend' && a.backend?.state === 'thinking') { a.timer = 1; }
          else { standUp(a); release(a); a.state = 'idle'; a.timer = 0.6 + a.rand() * 2; a.source = 'ambient'; a.backend = a.backend?.state === 'thinking' ? a.backend : null; play(fig, 'idle'); a.label = 'Siaga'; publish(a); }
        }
      } else if (a.state === 'reacting') {
        a.timer -= dt;
        if (a.timer <= 0) { a.state = 'idle'; a.timer = 1; a.source = 'ambient'; a.backend = null; play(fig, 'idle'); a.label = 'Siaga'; publish(a); }
      }
      // rotasi halus
      if (a.targetHeading !== undefined) a.heading = lerpAngle(a.heading, a.targetHeading, Math.min(1, dt * 7));
      fig.root.rotation.y = a.heading;
      fig.mixer.update(dt);
    }
  }

  function walk(a, dt) {
    const fig = a.fig;
    let target = a.path[0] || a.approach;
    if (!target) { arrive(a); return; }
    // reservasi tile berikutnya untuk menghindari tabrakan antar agen
    const tx = Math.floor(target.x), tz = Math.floor(target.z);
    const occ = a.path.length ? nav.occupant(tx, tz) : null;
    if (occ && occ !== a.id) {
      a.wait += dt;
      a.speed = Math.max(0, a.speed - dt * 4);
      if (a.wait > 1.2) {
        a.wait = 0;
        const st = nav.nearestWalkable(a.pos.x, a.pos.z), end = a.path[a.path.length - 1];
        const avoid = new Set([nav.key(tx, tz)]);
        const p = end ? nav.findPath(st[0], st[1], Math.floor(end.x), Math.floor(end.z), avoid) : null;
        if (p) a.path = p.map(([x, y]) => new THREE.Vector3(x + 0.5, 0, y + 0.5));
      }
    } else {
      a.wait = 0;
      a.speed = Math.min(SPEED, a.speed + dt * 3.2);
    }
    const remaining = a.path.length;
    if (remaining <= 1) a.speed = Math.min(a.speed, 0.6 + a.pos.distanceTo(a.approach) * 1.2);
    tmp.subVectors(target, a.pos); tmp.y = 0;
    const dist = tmp.length();
    const stepLen = a.speed * dt;
    if (dist > 1e-4) {
      a.targetHeading = Math.atan2(tmp.x, tmp.z);
      a.pos.addScaledVector(tmp, Math.min(1, stepLen / dist));
    }
    const ts = Math.max(0.35, a.speed / SPEED);
    if (a.anim !== 'walk') { a.anim = 'walk'; play(fig, 'walk', 0.22, ts); } else fig.current.timeScale = ts;
    // update reservasi tile saat ini
    const ct = [Math.floor(a.pos.x), Math.floor(a.pos.z)];
    if (!a.tile || a.tile[0] !== ct[0] || a.tile[1] !== ct[1]) {
      if (a.tile) nav.release(a.tile[0], a.tile[1], a.id);
      nav.reserve(ct[0], ct[1], a.id);
      a.tile = ct;
    }
    if (dist < 0.06) {
      if (a.path.length) a.path.shift();
      else {
        if (a.tile) { nav.release(a.tile[0], a.tile[1], a.id); a.tile = null; }
        a.speed = 0;
        if (a.pendingReaction) {
          const r = a.pendingReaction; a.pendingReaction = null; release(a);
          a.state = 'reacting'; a.anim = r; play(fig, r); a.timer = 4; return;
        }
        arrive(a);
      }
    }
  }

  function positionOf(id) { const a = agents.find(x => x.id === id); return a ? a.pos : null; }
  return { agents, update, positionOf };
}
