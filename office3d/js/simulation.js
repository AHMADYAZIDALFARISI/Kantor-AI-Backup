import * as THREE from 'three';

const W = 64, H = 46;

function walkable(g, x, y) {
  return x >= 0 && y >= 0 && x < W && y < H && g[y] && g[y][x] !== '#';
}

function nearestWalkable(g, x, y) {
  if (walkable(g, x, y)) return [x, y];
  for (let r = 1; r <= 6; r++) {
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
      if (walkable(g, x + dx, y + dy)) return [x + dx, y + dy];
    }
  }
  return [x, y];
}

function lerpAngle(a, b, t) {
  let d = ((b - a + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
  return a + d * t;
}

export function createStore(data) {
  const state = { agents: {}, tasks: JSON.parse(JSON.stringify(data.tasks || {})), selected: null, time: 0 };
  for (const s of data.staff || []) state.agents[s.id] = { anim: 'idle', status: 'Idle', taskIdx: 0 };
  const listeners = new Set();
  const emit = () => listeners.forEach(fn => fn(state));
  const subscribe = fn => { listeners.add(fn); return () => listeners.delete(fn); };
  const setAgent = (id, patch) => { state.agents[id] = Object.assign(state.agents[id] || {}, patch); emit(); };
  return { state, subscribe, setAgent, emit };
}

export function findPath(collision, sx, sy, tx, ty) {
  [sx, sy] = nearestWalkable(collision, sx, sy);
  [tx, ty] = nearestWalkable(collision, tx, ty);
  if (!walkable(collision, tx, ty) || !walkable(collision, sx, sy)) return [];
  if (sx === tx && sy === ty) return [];
  const key = (x, y) => y * W + x;
  const h = (x, y) => Math.abs(x - tx) + Math.abs(y - ty);
  const g = new Map([[key(sx, sy), 0]]), came = new Map(), closed = new Set();
  const open = [{ x: sx, y: sy, f: h(sx, sy) }];
  while (open.length) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
    const c = open.splice(bi, 1)[0], ck = key(c.x, c.y);
    if (closed.has(ck)) continue;
    closed.add(ck);
    if (c.x === tx && c.y === ty) {
      const path = []; let k = ck;
      while (k !== key(sx, sy)) { path.push([k % W, Math.floor(k / W)]); k = came.get(k); }
      return path.reverse();
    }
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = c.x + dx, ny = c.y + dy, nk = key(nx, ny);
      if (!walkable(collision, nx, ny) || closed.has(nk)) continue;
      const ng = g.get(ck) + 1;
      if (ng < (g.get(nk) ?? Infinity)) {
        g.set(nk, ng); came.set(nk, ck);
        open.push({ x: nx, y: ny, f: ng + h(nx, ny) });
      }
    }
  }
  return [];
}

export function createSimulation(data, figs, store) {
  const grid = data.map.collision;
  const allPois = (data.map.pois || []).map(p => ({ ...p, tx: Math.floor(p.x / 16), ty: Math.floor(p.y / 16) }));
  const poisByRoom = {};
  for (const p of allPois) (poisByRoom[p.room] ||= []).push(p);

  const sims = figs.map(fig => ({ fig, mode: 'idle', timer: 2 + Math.random() * 4, path: [], pathIdx: 0, speed: 2.5 + Math.random(), targetTag: null }));
  let emitAcc = 0;

  const agentTile = fig => [Math.floor(fig.group.position.x), Math.floor(fig.group.position.z)];
  const statusFor = { work: 'Working', talk: 'Meeting', rest: 'Resting', idle: 'Idle', walk: 'Walking' };

  function pickPOI(fig) {
    const room = fig.group.userData.pick && fig.group.userData.pick.room;
    const list = (poisByRoom[room] && poisByRoom[room].length) ? poisByRoom[room] : allPois;
    if (!list.length) return null;
    const p = list[Math.floor(Math.random() * list.length)];
    const [tx, ty] = nearestWalkable(grid, p.tx, p.ty);
    return { ...p, tx, ty };
  }

  function setStatus(fig, mode) {
    const a = store.state.agents[fig.id];
    if (a) { a.anim = mode; a.status = statusFor[mode] || 'Idle'; }
  }

  function update(dt, time) {
    for (const s of sims) {
      const fig = s.fig;
      s.timer -= dt;
      if (s.mode === 'idle') {
        fig.anim = 'idle';
        if (s.timer <= 0) {
          const poi = pickPOI(fig);
          const [ax, ay] = agentTile(fig);
          s.path = poi ? findPath(grid, ax, ay, poi.tx, poi.ty) : [];
          if (s.path.length) { s.mode = 'walk'; s.pathIdx = 0; s.targetTag = poi.tag; setStatus(fig, 'walk'); }
          else s.timer = 2;
        }
      } else if (s.mode === 'walk') {
        fig.anim = 'walk';
        const [px, py] = s.path[s.pathIdx];
        const pos = fig.group.position;
        const dx = px + 0.5 - pos.x, dz = py + 0.5 - pos.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 1e-4) {
          const step = Math.min(dist, s.speed * dt);
          pos.x += dx / dist * step; pos.z += dz / dist * step;
          fig.group.rotation.y = lerpAngle(fig.group.rotation.y, Math.atan2(dx, dz), Math.min(1, dt * 10));
        }
        if (dist < 0.08) {
          s.pathIdx++;
          if (s.pathIdx >= s.path.length) {
            s.mode = s.targetTag === 'rest' ? 'rest' : (s.targetTag === 'board' ? 'talk' : 'work');
            s.timer = 6 + Math.random() * 8;
            setStatus(fig, s.mode);
          }
        }
      } else { // work / talk / rest
        fig.anim = s.mode;
        if (s.timer <= 0) {
          s.mode = 'idle';
          s.timer = 2 + Math.random() * 5;
          setStatus(fig, 'idle');
        }
      }
      // task progress
      const ag = store.state.agents[fig.id];
      const tl = store.state.tasks[fig.id];
      if (tl && tl.length && ag) {
        const t = tl[ag.taskIdx % tl.length];
        if (t && !t.done) {
          t.progress = Math.min(100, t.progress + dt * 0.35);
          if (t.progress >= 100) { t.done = true; ag.taskIdx++; }
        }
      }
    }
    emitAcc += dt;
    if (emitAcc >= 2) { emitAcc = 0; store.emit(); }
    store.state.time += dt;
  }
  return { update, sims };
}