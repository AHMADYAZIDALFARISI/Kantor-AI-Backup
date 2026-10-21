import * as THREE from 'three';
import { OFFICE } from './renderer.js';
import { makeFloorDetail } from './finish.js';

// Identitas visual per ruangan: lantai + cat dinding (lihat docs/ART_DIRECTION.md).
export const ROOM_STYLE = {
  direksi:     { floor: 'wood_warm',  wall: '#e9d9c4', accent: '#c9894f' },
  lab_qa:      { floor: 'lab_tile',   wall: '#cfe9e3', accent: '#2fa58f' },
  engineering: { floor: 'concrete',   wall: '#c9d2e3', accent: '#4f6bd8' },
  riset:       { floor: 'carpet_sage',wall: '#ece3cc', accent: '#7c9a5a' },
  rapat:       { floor: 'carpet_blue',wall: '#d6dbf4', accent: '#5b6cff' },
  lobby:       { floor: 'terrazzo',   wall: '#cde9ea', accent: '#2f9a9a' },
  redaksi:     { floor: 'wood_light', wall: '#f2e6cf', accent: '#d4a434' },
  growth:      { floor: 'carpet_peach',wall: '#f6dccb', accent: '#ff7a59' },
  studio:      { floor: 'studio',     wall: '#4a4e60', accent: '#a78bfa' },
  arsip:       { floor: 'wood_dark',  wall: '#ddd0bd', accent: '#a0784f' },
  spesialis:   { floor: 'tech',       wall: '#ddd3f2', accent: '#8a5cc0' },
  kantin:      { floor: 'checker',    wall: '#f7e9b8', accent: '#e8823a' },
  gym:         { floor: 'rubber',     wall: '#f3cfc8', accent: '#e5484d' },
};
const WALL_H = 2.8, WALL_LOW = 0.42, WALL_T = 0.16;
// Baris dinding pixel-art (3 tile) diterjemahkan jadi dinding tipis di +2 tile dari tepi atas ruangan.
export const NORTH_OFFSET = 2;

function floorTexture(kind) {
  const S = 256, c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  const rnd = (() => { let a = kind.length * 977; return () => ((a = (a * 16807) % 2147483647) / 2147483647); })();
  const fill = (col) => { g.fillStyle = col; g.fillRect(0, 0, S, S); };
  const noise = (n, a, col) => { g.fillStyle = col; for (let i = 0; i < n; i++) { g.globalAlpha = a * rnd(); g.fillRect(rnd() * S, rnd() * S, 2, 2); } g.globalAlpha = 1; };
  switch (kind) {
    case 'wood_warm': case 'wood_light': case 'wood_dark': {
      const base = { wood_warm: '#b07a52', wood_light: '#d2ad80', wood_dark: '#7d5a40' }[kind];
      fill(base);
      for (let r = 0; r < 8; r++) {
        const y = r * 32, off = (r % 2) * 96 + rnd() * 40;
        g.fillStyle = `rgba(0,0,0,${0.04 + rnd() * 0.06})`; g.fillRect(0, y, S, 32);
        g.fillStyle = 'rgba(0,0,0,0.22)'; g.fillRect(0, y + 31, S, 1);
        for (let x = off; x < S + 200; x += 180) g.fillRect(x % S, y, 1, 31);
        g.strokeStyle = 'rgba(255,255,255,0.05)';
        for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(0, y + 6 + k * 9); g.bezierCurveTo(80, y + 3 + k * 9, 160, y + 12 + k * 8, S, y + 6 + k * 9); g.stroke(); }
      }
      break;
    }
    case 'lab_tile': case 'checker': case 'terrazzo': {
      if (kind === 'checker') {
        for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) { g.fillStyle = (x + y) % 2 ? '#e05a4a' : '#f4efe4'; g.fillRect(x * 64, y * 64, 64, 64); }
      } else if (kind === 'terrazzo') {
        fill('#ece8e1');
        const cols = ['#c9c2b6', '#9fb8b8', '#d9b9a0', '#b8c4d4', '#e4dcd0'];
        for (let i = 0; i < 420; i++) { g.fillStyle = cols[i % 5]; const s = 2 + rnd() * 6; g.beginPath(); g.ellipse(rnd() * S, rnd() * S, s, s * (0.5 + rnd() * 0.5), rnd() * 3, 0, 7); g.fill(); }
      } else {
        fill('#e9f1ef');
        g.fillStyle = '#c4d8d4';
        for (let i = 0; i <= 4; i++) { g.fillRect(i * 64 - 1, 0, 2, S); g.fillRect(0, i * 64 - 1, S, 2); }
        noise(500, 0.08, '#000');
      }
      break;
    }
    case 'concrete': fill('#b9bcc0'); noise(5000, 0.12, '#000'); noise(3000, 0.1, '#fff');
      g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(0, 0, S, 2); g.fillRect(0, 0, 2, S); break;
    case 'carpet_sage': case 'carpet_blue': case 'carpet_peach': {
      fill({ carpet_sage: '#8fa883', carpet_blue: '#7b86c9', carpet_peach: '#e8a98a' }[kind]);
      noise(9000, 0.12, '#000'); noise(6000, 0.1, '#fff'); break;
    }
    case 'studio': fill('#3b3e4a'); g.fillStyle = 'rgba(255,255,255,.06)';
      for (let i = 0; i <= 4; i++) { g.fillRect(i * 64 - 1, 0, 2, S); g.fillRect(0, i * 64 - 1, S, 2); } noise(2000, 0.08, '#fff'); break;
    case 'tech': fill('#4a3d6e'); g.strokeStyle = 'rgba(190,160,255,.35)'; g.lineWidth = 2;
      for (let i = 0; i < 4; i++) { g.strokeRect(i * 64 + 4, 4, 56, 248); }
      g.fillStyle = 'rgba(200,170,255,.5)'; for (let i = 0; i < 6; i++) g.fillRect(rnd() * S, rnd() * S, 18, 2); break;
    case 'rubber': fill('#3a3c44'); g.fillStyle = '#4a4d57';
      for (let y = 8; y < S; y += 16) for (let x = 8 + ((y / 16) % 2) * 8; x < S; x += 16) { g.beginPath(); g.arc(x, y, 2.5, 0, 7); g.fill(); } break;
    case 'corridor': fill('#d9dade');
      g.fillStyle = 'rgba(0,0,0,.1)'; for (let i = 0; i <= 2; i++) { g.fillRect(i * 128 - 1, 0, 2, S); g.fillRect(0, i * 128 - 1, S, 2); }
      noise(1200, 0.06, '#000'); break;
    default: fill('#cccccc');
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

function textTexture(text, color, w = 1024, h = 160) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.font = `700 ${Math.round(h * 0.5)}px "Plus Jakarta Sans", system-ui, sans-serif`;
  g.textBaseline = 'middle';
  g.fillStyle = color;
  g.fillText(text.toUpperCase(), 0, h / 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return { tex: t, width: Math.min(w, g.measureText(text.toUpperCase()).width) };
}

export function buildEnvironment(scene, data) {
  const group = new THREE.Group();
  group.name = 'environment';
  scene.add(group);
  const rooms = data.map.rooms;
  const texCache = {};
  const floorMat = kind => {
    if (!texCache[kind]) {
      const map = floorTexture(kind);
      const mat = new THREE.MeshStandardMaterial({ map, roughness: kind.startsWith('carpet') || kind === 'rubber' ? 0.95 : 0.6, metalness: 0 });
      try {
        const fd = makeFloorDetail(kind);
        if (fd.bump) { mat.bumpMap = fd.bump; mat.bumpScale = 0.03; mat.roughnessMap = fd.rough; mat.roughness = 1.0; }
      } catch (e) { /* detail lantai gagal: lanjut polos */ }
      texCache[kind] = mat;
    }
    return texCache[kind];
  };
  const floorPlane = (x, z, w, d, kind, rep = 2) => {
    const geo = new THREE.PlaneGeometry(w, d);
    const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / rep, uv.getY(i) * d / rep);
    const m = new THREE.Mesh(geo, floorMat(kind).clone());
    m.material.map = floorMat(kind).map;
    m.rotation.x = -Math.PI / 2;
    m.position.set(x + w / 2, 0, z + d / 2);
    m.receiveShadow = true;
    group.add(m);
    return m;
  };

  // diorama: alas kantor
  const D0 = NORTH_OFFSET, DD = OFFICE.d - D0;
  const baseGeo = new THREE.BoxGeometry(OFFICE.w + 1.2, 0.6, DD + 1.2);
  const base = new THREE.Mesh(baseGeo, new THREE.MeshStandardMaterial({ color: 0x3a3f4c, roughness: 0.8 }));
  base.position.set(OFFICE.w / 2, -0.38, D0 + DD / 2);
  base.receiveShadow = true;
  group.add(base);
  const lip = new THREE.Mesh(new THREE.BoxGeometry(OFFICE.w + 0.6, 0.06, DD + 0.6), new THREE.MeshStandardMaterial({ color: 0xe6e3dc, roughness: 0.7 }));
  lip.position.set(OFFICE.w / 2, -0.045, D0 + DD / 2);
  lip.receiveShadow = true;
  group.add(lip);

  // koridor
  const corridors = [[0, 14, 64, 3 + NORTH_OFFSET], [0, 29, 64, 3 + NORTH_OFFSET]];
  for (const [x, z, w, d] of corridors) {
    floorPlane(x, z, w, d, 'corridor', 4);
    // garis pemandu lantai
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(w - 1, 0.08), new THREE.MeshStandardMaterial({ color: 0x5b6cff, roughness: 0.5 }));
    strip.rotation.x = -Math.PI / 2; strip.position.set(x + w / 2, 0.004, z + 1.5);
    group.add(strip);
  }

  // lantai ruangan + rambu lantai
  const roomInfo = {};
  for (const r of rooms) {
    const [x, z0, w, d0] = r.rect_tiles;
    const z = z0 + NORTH_OFFSET, d = d0 - NORTH_OFFSET;
    const st = ROOM_STYLE[r.id] || { floor: 'concrete', wall: '#dddddd', accent: '#888888' };
    floorPlane(x, z, w, d, st.floor);
    const { tex, width } = textTexture(r.name, st.accent);
    const lw = Math.min(w - 1.6, 5.2), lh = lw * 160 / 1024;
    const label = new THREE.Mesh(new THREE.PlaneGeometry(lw, lh), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85, depthWrite: false }));
    tex.repeat.set(1, 1);
    label.rotation.x = -Math.PI / 2;
    label.position.set(x + 0.8 + lw / 2, 0.006, z + d - 0.55);
    label.renderOrder = 1;
    group.add(label);
    roomInfo[r.id] = { rect: [x, z, w, d], style: st, labelWidth: width };
  }

  // ---------- dinding (InstancedMesh, tinggi dinamis untuk cutaway)
  const segs = [];
  const seen = new Set();
  const addSeg = (axis, c, a, b, roomId, side) => {
    const k = `${axis}:${c}:${a}:${b}`;
    if (seen.has(k)) { segs.find(s => s.k === k).sides.push({ roomId, side }); return; }
    seen.add(k);
    segs.push({ k, axis, c, a, b, sides: [{ roomId, side }] });
  };
  const openings = {};
  for (const r of rooms) {
    for (const dr of r.doors || []) {
      const xs = dr.tiles.map(t => t[0]);
      const x0 = Math.min(...xs), x1 = Math.max(...xs) + 1;
      const zline = dr.side === 'top' ? r.rect_tiles[1] + NORTH_OFFSET : r.rect_tiles[1] + r.rect_tiles[3];
      (openings[`x:${zline}`] ||= []).push([x0, x1]);
    }
  }
  const splitAround = (a, b, holes) => {
    let parts = [[a, b]];
    for (const [h0, h1] of holes || []) {
      parts = parts.flatMap(([p0, p1]) => (h1 <= p0 || h0 >= p1) ? [[p0, p1]] : [[p0, h0], [h1, p1]].filter(([u, v]) => v - u > 0.05));
    }
    return parts;
  };
  for (const r of rooms) {
    const [x, z0, w, d0] = r.rect_tiles;
    const z = z0 + NORTH_OFFSET, zs = z0 + d0;
    for (const [a, b] of splitAround(x, x + w, openings[`x:${z}`])) addSeg('x', z, a, b, r.id, 'N');
    for (const [a, b] of splitAround(x, x + w, openings[`x:${zs}`])) addSeg('x', zs, a, b, r.id, 'S');
    addSeg('z', x, z, zs, r.id, 'W');
    addSeg('z', x + w, z, zs, r.id, 'E');
  }
  const wallGeo = new THREE.BoxGeometry(1, 1, 1);
  wallGeo.translate(0, 0.5, 0);
  const wallMat = new THREE.MeshStandardMaterial({ roughness: 0.88, metalness: 0 });
  const walls = new THREE.InstancedMesh(wallGeo, wallMat, segs.length);
  walls.castShadow = true; walls.receiveShadow = true;
  const capMat = new THREE.MeshStandardMaterial({ color: 0x3b3f4c, roughness: 0.6 });
  const caps = new THREE.InstancedMesh(wallGeo, capMat, segs.length);
  caps.castShadow = false;
  const skirtMat = new THREE.MeshStandardMaterial({ color: 0xf4f2ee, roughness: 0.5 });
  const skirts = new THREE.InstancedMesh(wallGeo, skirtMat, segs.length);
  const col = new THREE.Color();
  segs.forEach((s, i) => {
    const owner = s.sides.find(q => q.side === 'N' || q.side === 'W') || s.sides[0];
    col.set((ROOM_STYLE[owner.roomId] || {}).wall || '#dddddd');
    walls.setColorAt(i, col);
    s.h = WALL_H; s.target = WALL_H;
  });
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3();
  function writeSeg(i) {
    const s = segs[i];
    const len = s.b - s.a + (s.axis === 'x' ? WALL_T : 0);
    const mid = (s.a + s.b) / 2;
    const px = s.axis === 'x' ? mid : s.c, pz = s.axis === 'x' ? s.c : mid;
    const sx = s.axis === 'x' ? len : WALL_T, sz = s.axis === 'x' ? WALL_T : len;
    walls.setMatrixAt(i, m4.compose(v.set(px, 0, pz), q, sc.set(sx, s.h, sz)));
    caps.setMatrixAt(i, m4.compose(v.set(px, s.h, pz), q, sc.set(sx + 0.02, 0.05, sz + 0.02)));
    skirts.setMatrixAt(i, m4.compose(v.set(px, 0, pz), q, sc.set(sx + 0.04, Math.min(0.12, s.h), sz + 0.04)));
  }
  segs.forEach((_, i) => writeSeg(i));
  group.add(walls, caps, skirts);

  // ---------- kusen pintu
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x2f3340, roughness: 0.5 });
  const doorFrames = [];
  for (const key in openings) {
    const zline = +key.split(':')[1];
    for (const [x0, x1] of openings[key]) {
      const gp = new THREE.Group();
      for (const xx of [x0, x1]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.25, WALL_T + 0.06), frameMat);
        post.position.set(xx, 1.125, zline); post.castShadow = true;
        gp.add(post);
      }
      const head = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0 + 0.12, 0.12, WALL_T + 0.06), frameMat);
      head.position.set((x0 + x1) / 2, 2.25, zline);
      gp.add(head);
      const top = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, WALL_H - 2.31, WALL_T), wallMat);
      top.position.set((x0 + x1) / 2, 2.31 + (WALL_H - 2.31) / 2, zline);
      gp.add(top);
      gp.userData = { zline, x0, x1 };
      group.add(gp);
      doorFrames.push(gp);
    }
  }

  // ---------- jendela dari penempatan "window" di map (menempel di dinding utara ruangan)
  const glassMat = new THREE.MeshStandardMaterial({ color: 0xbfe3f5, roughness: 0.08, metalness: 0.1, emissive: 0x9fd0ee, emissiveIntensity: 0.35 });
  const winFrameMat = new THREE.MeshStandardMaterial({ color: 0xf6f5f2, roughness: 0.4 });
  const windows = [];
  for (const p of data.map.furniture) {
    if (p.name !== 'window') continue;
    const room = rooms.find(r => r.id === p.room);
    if (!room) continue;
    const zline = room.rect_tiles[1] + NORTH_OFFSET;
    const cx = (p.x + p.w / 2) / 16, w = Math.max(1.4, p.w / 16 * 0.9);
    const gp = new THREE.Group();
    const glass = new THREE.Mesh(new THREE.BoxGeometry(w, 1.25, 0.03), glassMat);
    glass.position.set(cx, 1.65, zline + WALL_T / 2 + 0.01);
    gp.add(glass);
    for (const [ww, hh, x, y] of [[w + 0.12, 0.08, cx, 1.02], [w + 0.12, 0.08, cx, 2.28], [0.08, 1.3, cx - w / 2, 1.65], [0.08, 1.3, cx + w / 2, 1.65], [0.05, 1.25, cx, 1.65]]) {
      const f = new THREE.Mesh(new THREE.BoxGeometry(ww, hh, 0.07), winFrameMat);
      f.position.set(x, y, zline + WALL_T / 2 + 0.03);
      gp.add(f);
    }
    const sill = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.05, 0.18), winFrameMat);
    sill.position.set(cx, 0.98, zline + WALL_T / 2 + 0.09);
    gp.add(sill);
    gp.userData = { zline, roomId: room.id };
    group.add(gp);
    windows.push(gp);
  }

  // ---------- cutaway: sisi yang menghadap kamera direndahkan
  let front = { x: 'S', z: 'E' };
  function setQuadrant(qd) {
    const camSouth = qd.includes('S'), camEast = qd.includes('E');
    front = { x: camSouth ? 'S' : 'N', z: camEast ? 'E' : 'W' };
    segs.forEach(s => {
      const isFront = s.sides.some(sd => sd.side === (s.axis === 'x' ? front.x : front.z));
      const exterior = s.sides.length === 1 && (s.c === 0 || s.c === OFFICE.w || s.c === OFFICE.d || s.c === NORTH_OFFSET);
      s.target = isFront ? WALL_LOW : WALL_H;
      if (isFront && exterior) s.target = WALL_LOW;
    });
  }
  function update(dt) {
    let dirty = false;
    segs.forEach((s, i) => {
      if (Math.abs(s.h - s.target) > 0.002) {
        s.h += (s.target - s.h) * Math.min(1, dt * 6);
        if (Math.abs(s.h - s.target) < 0.004) s.h = s.target;
        writeSeg(i); dirty = true;
      }
    });
    if (dirty) { walls.instanceMatrix.needsUpdate = caps.instanceMatrix.needsUpdate = skirts.instanceMatrix.needsUpdate = true; walls.computeBoundingSphere(); }
    for (const gp of doorFrames) {
      const s = segs.find(sg => sg.axis === 'x' && sg.c === gp.userData.zline);
      gp.visible = !s || s.h > 1.5;
    }
    for (const gp of windows) {
      const s = segs.find(sg => sg.axis === 'x' && sg.c === gp.userData.zline && sg.sides.some(sd => sd.roomId === gp.userData.roomId));
      gp.visible = !s || s.h > 2.0;
    }
  }
  // apakah dinding utara ruangan sedang tinggi (untuk item yang menempel di dinding)
  function northWallTall(roomId) {
    const r = rooms.find(rr => rr.id === roomId);
    if (!r) return true;
    const s = segs.find(sg => sg.axis === 'x' && sg.c === r.rect_tiles[1] + NORTH_OFFSET && sg.sides.some(sd => sd.roomId === roomId));
    return !s || s.h > 2.0;
  }
  return { group, update, setQuadrant, roomInfo, northWallTall, wallHeight: WALL_H, wallThickness: WALL_T };
}
