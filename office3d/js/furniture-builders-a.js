import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler();

function place(g, x, y, z, rx = 0, ry = 0, rz = 0) {
  _q.setFromEuler(_e.set(rx, ry, rz));
  _m.compose(new THREE.Vector3(x, y, z), _q, new THREE.Vector3(1, 1, 1));
  g.applyMatrix4(_m);
  return g;
}

export function box(w, h, d, x, y, z, rx = 0, ry = 0, rz = 0) {
  return place(new THREE.BoxGeometry(w, h, d), x, y, z, rx, ry, rz);
}

export function cyl(rt, rb, h, x, y, z, seg = 10) {
  return place(new THREE.CylinderGeometry(rt, rb, h, seg), x, y, z);
}

export function sph(r, x, y, z) {
  return place(new THREE.IcosahedronGeometry(r, 1), x, y, z);
}

function tint(g, hex) {
  const col = new THREE.Color(hex), n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = col.r; a[i * 3 + 1] = col.g; a[i * 3 + 2] = col.b; }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3));
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
  return g;
}

// parts: [geometry, hexColor, emissive?] -> merged geometry; group 0 = standard, group 1 = emissive
export function merge(parts) {
  const norm = [], emis = [];
  for (const [g, col, em] of parts) {
    const t = tint(g.index ? g.toNonIndexed() : g, col);
    (em ? emis : norm).push(t);
  }
  const sets = [mergeGeometries(norm)];
  if (emis.length) sets.push(mergeGeometries(emis));
  const out = mergeGeometries(sets, true);
  sets.forEach(s => s.dispose());
  return out;
}

export function makeMaterials(accent = 0x66ccff) {
  return [
    new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0, flatShading: true, vertexColors: true }),
    new THREE.MeshStandardMaterial({ roughness: 0.7, metalness: 0, flatShading: true, vertexColors: true,
      emissive: new THREE.Color(accent), emissiveIntensity: 0.6 })
  ];
}

const legs = (w, d, s, h, inset, col, round = false) => {
  const xs = w / 2 - inset - s / 2, zs = d / 2 - inset - s / 2, out = [];
  for (const [sx, sz] of [[1, 1], [1, -1], [-1, 1], [-1, -1]])
    out.push([round ? cyl(s, s, h, sx * xs, h / 2, sz * zs, 8) : box(s, h, s, sx * xs, h / 2, sz * zs), col]);
  return out;
};

export function buildDesk(w, d, c) {
  const bz = -d / 2 + 0.15;
  return merge([
    [box(w, 0.08, d, 0, 0.76, 0), c.main],
    ...legs(w, d, 0.08, 0.72, 0.06, c.dark),
    [box(0.18, 0.02, 0.12, 0, 0.81, bz), c.dark],
    [box(0.04, 0.16, 0.04, 0, 0.9, bz), c.dark],
    [box(0.5, 0.32, 0.04, 0, 1.12, bz + 0.02), c.dark],
    [box(0.44, 0.26, 0.01, 0, 1.12, bz + 0.045), c.accent, true],
    [box(0.4, 0.02, 0.14, 0, 0.81, bz + 0.3), c.dark]
  ]);
}

export function buildChair(w, d, c) {
  return merge([
    [box(0.5, 0.08, 0.5, 0, 0.45, 0), c.main],
    [box(0.5, 0.55, 0.08, 0, 0.75, -0.21), c.main],
    [box(0.4, 0.3, 0.02, 0, 0.78, -0.165), c.accent],
    ...legs(0.5, 0.5, 0.03, 0.45, 0.04, c.dark, true)
  ]);
}
export function buildTable(w, d, c) {
  return merge([
    [box(w, 0.07, d, 0, 0.7, 0), c.main],
    ...legs(w, d, 0.09, 0.7, 0.05, c.dark)
  ]);
}

export function buildSofa(w, d, c) {
  return merge([
    [box(w, 0.35, d, 0, 0.28, 0), c.main],
    [box(w, 0.55, 0.18, 0, 0.55, -(d / 2 - 0.09)), c.main],
    [box(0.18, 0.5, d, -(w / 2 - 0.09), 0.5, 0), c.main],
    [box(0.18, 0.5, d, w / 2 - 0.09, 0.5, 0), c.main],
    [box(w / 2 - 0.12, 0.12, d - 0.2, -w / 4, 0.5, 0), c.accent],
    [box(w / 2 - 0.12, 0.12, d - 0.2, w / 4, 0.5, 0), c.accent]
  ]);
}export function buildShelf(w,d,c){
const p=[];
p.push([box(0.08,1.8,d,-(w/2-0.04),0.9,0),c.main]);
p.push([box(0.08,1.8,d,(w/2-0.04),0.9,0),c.main]);
p.push([box(w,0.08,d,0,1.76,0),c.main]);
p.push([box(w,0.08,d,0,0.04,0),c.main]);
for(const y of [0.5,0.95,1.4])p.push([box(w-0.16,0.05,d-0.12,0,y,0),c.main]);
for(let i=0;i<5;i++)p.push([box(0.09,0.32,0.2,-(w/2-0.3)+i*0.12,1.13,0),i%2===0?c.accent:c.dark]);
return merge(p);
}
export function buildPlant(w,d,c){
return merge([
[cyl(0.16,0.2,0.32,0,0.16,0),c.dark],
[cyl(0.03,0.04,0.4,0,0.5,0),c.dark],
[sph(0.24,0,0.85,0),c.main],
[sph(0.18,0.12,1.05,0.05),c.main],
[sph(0.15,-0.12,1.0,-0.05),c.main]
]);
}export function buildBoard(w,d,c){
  return merge([
    [box(w,0.06,0.08,0,1.78,0),c.dark],
    [box(w,0.06,0.08,0,0.62,0),c.dark],
    [box(0.06,1.22,0.08,-(w/2-0.03),1.2,0),c.dark],
    [box(0.06,1.22,0.08,(w/2-0.03),1.2,0),c.dark],
    [box(w-0.1,1.1,0.04,0,1.2,0),0xf5f5f0],
    [box(0.08,0.62,0.08,-(w/2-0.2),0.31,0),c.dark],
    [box(0.08,0.62,0.08,(w/2-0.2),0.31,0),c.dark],
    [box(w*0.5,0.04,0.1,0,0.64,0),c.accent]
  ]);
}

export function buildScreen(w,d,c){
  return merge([
    [box(w,0.62,0.08,0,1.35,0),c.dark],
    [box(w-0.12,0.5,0.02,0,1.35,0.045),c.accent,true],
    [box(0.12,1.0,0.12,0,0.5,0),c.dark],
    [box(0.5,0.06,0.4,0,0.03,0),c.dark]
  ]);
}