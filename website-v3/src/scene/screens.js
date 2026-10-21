import * as THREE from 'three';

// Konten layar prosedural (canvas). Dekoratif kecuali papan skill, yang menampilkan
// jumlah dari skills.json. Tidak ada layar yang mengklaim status eksekusi agen.
const W = 256, H = 160;

function mk() {
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return { c, g: c.getContext('2d'), t };
}

const PAINTERS = {
  code(g, f) {
    g.fillStyle = '#141824'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#1e2433'; g.fillRect(0, 0, 38, H);
    const cols = ['#7aa2ff', '#ffb86b', '#8be9a8', '#ff79c6', '#c3cbe0'];
    for (let i = 0; i < 13; i++) {
      const y = 10 + i * 11, seed = (i * 37 + f * 11) % 97;
      g.fillStyle = '#4a5268'; g.fillRect(10, y, 16, 4);
      let x = 46 + (seed % 3) * 12;
      for (let k = 0; k < 4; k++) { const w = 12 + ((seed * (k + 3)) % 40); g.fillStyle = cols[(seed + k) % 5]; g.fillRect(x, y, w, 5); x += w + 6; if (x > W - 20) break; }
    }
    g.fillStyle = '#7aa2ff'; g.fillRect(46, 10 + (f % 13) * 11, 3, 7);
  },
  chart(g, f) {
    g.fillStyle = '#10213a'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#ffffff'; g.globalAlpha = 0.85; g.fillRect(14, 12, 90, 8); g.globalAlpha = 1;
    const cols = ['#5b6cff', '#2fd3a8', '#ffb547', '#ff7a59'];
    for (let i = 0; i < 8; i++) { const h = 28 + ((i * 29 + f * 7) % 80); g.fillStyle = cols[i % 4]; g.fillRect(16 + i * 28, H - 16 - h, 18, h); }
    g.strokeStyle = '#ffffff'; g.lineWidth = 2; g.beginPath();
    for (let i = 0; i < 9; i++) { const y = 60 + Math.sin(i * 0.9 + f * 0.4) * 22; i ? g.lineTo(16 + i * 28, y) : g.moveTo(16, y); }
    g.stroke();
  },
  sec(g, f) {
    g.fillStyle = '#071a10'; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(80,255,140,.25)';
    for (let i = 0; i < 6; i++) { g.strokeRect(10 + i * 4, 10 + i * 4, W - 20 - i * 8, H - 20 - i * 8); }
    g.fillStyle = '#5dff96'; g.fillRect(10 + (f * 23) % (W - 20), 10, 2, H - 20);
    g.font = '600 18px monospace'; g.fillText('SCAN ' + String(f % 100).padStart(2, '0'), 18, H - 20);
  },
  ui(g, f) {
    g.fillStyle = '#f4f6fb'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#5b6cff'; g.fillRect(0, 0, W, 26);
    g.fillStyle = '#ffffff'; g.fillRect(14, 36, W - 28, 22);
    g.strokeStyle = '#c9cfe0'; g.strokeRect(14, 36, W - 28, 22);
    for (let i = 0; i < 4; i++) { g.fillStyle = ['#2fd3a8', '#ffb547', '#5b6cff', '#ff7a59'][i]; g.fillRect(14, 70 + i * 20, 12, 12); g.fillStyle = '#a5adc4'; g.fillRect(34, 72 + i * 20, 60 + ((i * 41 + f * 13) % 120), 8); }
  },
  video(g, f) {
    const grd = g.createLinearGradient(0, 0, W, H);
    grd.addColorStop(0, '#3b2a6a'); grd.addColorStop(1, '#c2557a');
    g.fillStyle = grd; g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(255,255,255,.8)'; g.beginPath(); g.arc(W / 2, H / 2 - 10, 30, 0, 7); g.fill();
    g.fillStyle = '#1b1530'; g.fillRect(0, H - 30, W, 30);
    for (let i = 0; i < 5; i++) { g.fillStyle = ['#ffb547', '#2fd3a8', '#5b6cff', '#ff7a59', '#a78bfa'][i]; g.fillRect(8 + i * 48, H - 24, 40, 8); }
    g.fillStyle = '#ffffff'; g.fillRect(8 + (f * 9) % (W - 16), H - 30, 2, 30);
  },
};

export function createScreens() {
  const shared = {};
  let frame = 0, acc = 0;
  function material(kind) {
    if (!shared[kind]) {
      const s = mk();
      PAINTERS[kind](s.g, 0); s.t.needsUpdate = true;
      s.mat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: s.t, emissiveIntensity: 0.95, roughness: 0.35 });
      shared[kind] = s;
    }
    return shared[kind].mat;
  }
  const boards = {};
  function boardMaterial(roomId, info) {
    const s = mk();
    s.c.width = 512; s.c.height = 320;
    const g = s.g;
    g.fillStyle = '#121624'; g.fillRect(0, 0, 512, 320);
    g.fillStyle = info.accent; g.fillRect(0, 0, 512, 10);
    g.fillStyle = '#c9cfe0'; g.font = '600 30px "Plus Jakarta Sans", system-ui, sans-serif';
    g.fillText(info.name, 28, 62);
    g.fillStyle = '#ffffff'; g.font = '800 128px "Plus Jakarta Sans", system-ui, sans-serif';
    g.fillText(String(info.count), 28, 210);
    g.fillStyle = '#8e97b3'; g.font = '500 26px "Plus Jakarta Sans", system-ui, sans-serif';
    g.fillText(info.caption, 28, 270);
    s.t.needsUpdate = true;
    s.mat = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0xffffff, emissiveMap: s.t, emissiveIntensity: 0.9 });
    boards[roomId] = s;
    return s.mat;
  }
  function update(dt, reduced) {
    if (reduced) return;
    acc += dt;
    if (acc < 0.3) return;
    acc = 0; frame++;
    for (const k in shared) { PAINTERS[k](shared[k].g, frame); shared[k].t.needsUpdate = true; }
  }
  return { material, boardMaterial, update };
}

// UV planar untuk primitif layar (export Blender tanpa UV).
export function planarUV(geo) {
  geo.computeBoundingBox();
  const bb = geo.boundingBox, size = new THREE.Vector3();
  bb.getSize(size);
  const pos = geo.attributes.position;
  // pilih 2 sumbu terluas
  const axes = [['x', size.x], ['y', size.y], ['z', size.z]].sort((a, b) => b[1] - a[1]);
  const [u, v] = [axes[0][0], axes[1][0]];
  const horiz = u === 'y' ? v : u, vert = u === 'y' ? u : v;
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    const p = { x: pos.getX(i), y: pos.getY(i), z: pos.getZ(i) };
    uv[i * 2] = (p[horiz] - bb.min[horiz]) / (size[horiz] || 1);
    uv[i * 2 + 1] = (p[vert] - bb.min[vert]) / (size[vert] || 1);
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}
