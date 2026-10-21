import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { planarUV } from './screens.js';
import { NORTH_OFFSET } from './environment.js';
import { makeDetailTextures, applyFurnitureFinish, makeContactShadowTexture } from './finish.js';

const T = 16; // px per tile di map.json
// Arah hadap default per tipe (radian, rotasi Y). Model menghadap +Z (ke kamera default).
const ROT = { sofa: Math.PI, armchair: Math.PI, waiting_bench: Math.PI, exec_chair: Math.PI, exec_desk: Math.PI, chair_office_down: Math.PI };
const SCREEN_KIND = {
  desk_workstation: 'code', desk_dual: 'code', desk_editing: 'video', desk_exec: 'chart', table_meeting: 'chart',
  test_bench: 'code', wall_display: 'chart', tv_wall: 'chart', projector_screen: 'chart', security_wall: 'sec',
  directory_kiosk: 'ui', shield_terminal: 'sec', printer_3d: 'ui', anti_slop_filter: 'ui',
};
// Kursi: posisi duduk relatif model (x, z, hadap) di ruang lokal; hadap 0 = +Z.
const SEATS = {
  chair_office: [[0, 0.02, Math.PI]], chair_exec: [[0, 0.02, Math.PI]], chair_meeting: [[0, 0.0, Math.PI]],
  armchair: [[0, -0.05, Math.PI]], sofa: [[-0.6, -0.08, Math.PI], [0, -0.08, Math.PI], [0.6, -0.08, Math.PI]],
  bench: [[-0.7, -0.02, Math.PI], [0, -0.02, Math.PI], [0.7, -0.02, Math.PI]],
  dining_set: [[-0.4, -0.62, 0], [0.4, -0.62, 0], [-0.4, 0.62, Math.PI], [0.4, 0.62, Math.PI]],
  bar_stool: [[0, 0, 0]],
};
const NO_COLLIDE_TYPES = new Set(['rug', 'rug_round', 'yoga_mat']);

// GLB terkompresi (KHR_mesh_quantization) memakai atribut integer ternormalisasi.
// Ubah ke Float32 sebelum ditransformasi & digabung.
function dequantize(src) {
  const geo = new THREE.BufferGeometry();
  for (const name of Object.keys(src.attributes)) {
    const a = src.attributes[name];
    const out = new Float32Array(a.count * a.itemSize);
    for (let i = 0; i < a.count; i++) for (let k = 0; k < a.itemSize; k++) out[i * a.itemSize + k] = a.getComponent(i, k);
    geo.setAttribute(name, new THREE.BufferAttribute(out, a.itemSize));
  }
  if (src.index) geo.setIndex(new THREE.BufferAttribute(Uint32Array.from(src.index.array), 1));
  return geo;
}

export async function buildFurniture(scene, data, env, screens, loader, onProgress, roomBoards) {
  const manifest = await (await fetch('assets/furniture/manifest.json')).json();
  const typeToModel = manifest.type_to_model;
  const placements = data.map.furniture.filter(p => typeToModel[p.name]);
  const needed = [...new Set(placements.map(p => typeToModel[p.name]))];
  const models = {};
  let done = 0;
  await Promise.all(needed.map(async name => {
    const g = await loader.loadAsync(`assets/furniture/${name}.glb`);
    g.scene.updateMatrixWorld(true);
    const parts = [];
    g.scene.traverse(o => {
      if (!o.isMesh) return;
      const geo = dequantize(o.geometry);
      geo.applyMatrix4(o.matrixWorld);
      const matName = (o.material.name || 'FurnVC').replace(/\.\d+$/, '');
      if (matName === 'Screen') planarUV(geo);
      parts.push({ geo, matName, srcMat: o.material });
    });
    models[name] = { parts, info: manifest.models[name] };
    onProgress?.(++done / needed.length);
  }));

  const rooms = Object.fromEntries(data.map.rooms.map(r => [r.id, r]));
  const shadowGeos = [];       // contact shadow gabungan (1 draw call)
  const buckets = new Map();   // key -> {geos:[], mat}
  const picks = [];            // {box, pick}
  const seats = [];            // {pos, rot, type, room, id}
  const mats = {
    FurnVC: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.74, metalness: 0 }),
    Metal: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.36, metalness: 0.55 }),
    Glass: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.32, depthWrite: false }),
  };
  try { applyFurnitureFinish(mats, makeDetailTextures()); } catch (e) { /* tekstur gagal: lanjut tanpa finish */ }
  const glowMat = src => {
    const k = 'glow:' + src.name;
    if (!mats[k]) mats[k] = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: src.emissive.clone(), emissiveIntensity: 2.2 });
    return mats[k];
  };
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);

  placements.forEach((p, idx) => {
    const name = typeToModel[p.name];
    const M = models[name];
    if (!M) return;
    const room = rooms[p.room];
    let rot = ROT[p.name] || 0;
    const { w, d } = M.info;
    const cx = (p.x + p.w / 2) / T;
    let cz;
    const wallZ = room ? room.rect_tiles[1] + NORTH_OFFSET + env.wallThickness / 2 : null;
    if (p.wall) {
      if (!room) return;
      cz = wallZ + 0.004;
    } else {
      const front = (p.y + p.h) / T;
      cz = front - d / 2 - 0.05;
      // objek tinggi yang di pixel-art menempel ke dinding → tempelkan ke dinding 3D
      const relTop = room ? p.y / T - room.rect_tiles[1] : 99;
      if (room && relTop < 3.6 && M.info.h > 1.0) cz = wallZ + d / 2 + 0.03;
      if (room) {
        const [rx, rz, rw, rd] = room.rect_tiles;
        const minZ = rz + NORTH_OFFSET + 0.1 + d / 2, maxZ = rz + rd - 0.15 - d / 2;
        cz = Math.min(maxZ, Math.max(minZ, cz));
      }
    }
    if (p.name === 'meeting_chair') {
      const table = placements.find(t => t.name === 'meeting_table' && t.room === p.room);
      if (table && (p.y + p.h / 2) < (table.y + table.h / 2)) rot = Math.PI;
    }
    const pos = new THREE.Vector3(cx, 0, cz);
    m4.compose(pos, q.setFromAxisAngle(up, rot), new THREE.Vector3(1, 1, 1));
    if (!p.wall && !NO_COLLIDE_TYPES.has(p.name)) {
      const sg = new THREE.PlaneGeometry(w * 1.12, d * 1.12);
      const sm = new THREE.Matrix4().makeRotationY(rot)
        .multiply(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      sm.setPosition(cx, 0.007, cz);
      sg.applyMatrix4(sm);
      shadowGeos.push(sg);
    }
    const wallRoom = p.wall ? p.room : null;
    for (const part of M.parts) {
      let key = part.matName, mat;
      if (part.matName === 'Screen') {
        if (name === 'skill_board' && roomBoards?.[p.room]) { key = 'board:' + p.room; mat = screens.boardMaterial(p.room, roomBoards[p.room]); }
        else { const kind = SCREEN_KIND[name] || 'code'; key = 'screen:' + kind; mat = screens.material(kind); }
      } else if (part.matName.startsWith('Glow')) { mat = glowMat(part.srcMat); key = 'glow:' + part.srcMat.name; }
      else mat = mats[part.matName] || mats.FurnVC;
      if (wallRoom) key = 'wall:' + wallRoom + ':' + key;
      if (!buckets.has(key)) buckets.set(key, { geos: [], mat, wallRoom });
      const g = part.geo.clone();
      g.applyMatrix4(m4);
      buckets.get(key).geos.push(g);
    }
    const box = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(cx, M.info.h / 2, cz + (p.wall ? 0.05 : 0)),
      new THREE.Vector3(rot % Math.PI ? d : w, Math.max(0.3, M.info.h), rot % Math.PI ? w : Math.max(0.12, d)));
    if (p.wall) box.min.y = Math.max(box.min.y, 0.9);
    picks.push({ box, wallRoom, pick: { type: 'furniture', id: p.name + '_' + idx, name: p.name, model: name, room: p.room } });
    for (const [sx, sz, sr] of SEATS[name] || []) {
      const local = new THREE.Vector3(sx, 0, sz).applyAxisAngle(up, rot);
      seats.push({ id: `${p.name}_${idx}_${seats.length}`, pos: pos.clone().add(local), rot: rot + sr, type: name, room: p.room, taken: null });
    }
  });

  const group = new THREE.Group();
  group.name = 'furniture';
  const wallGroups = {};
  let drawCalls = 0;
  for (const [key, b] of buckets) {
    // satukan atribut agar mergeGeometries konsisten
    const attrs = ['position', 'normal', 'color', 'uv'];
    const need = attrs.filter(a => b.geos.every(g => g.attributes[a]));
    b.geos.forEach(g => { for (const a of Object.keys(g.attributes)) if (!need.includes(a)) g.deleteAttribute(a); });
    const allIdx = b.geos.every(g => g.index);
    const geo = mergeGeometries(allIdx ? b.geos : b.geos.map(g => g.index ? g.toNonIndexed() : g), false);
    if (!geo) continue;
    const mesh = new THREE.Mesh(geo, b.mat);
    mesh.castShadow = !key.includes('Glass') && !key.includes('screen') && !key.startsWith('board');
    mesh.receiveShadow = true;
    mesh.name = key;
    if (b.wallRoom) {
      (wallGroups[b.wallRoom] ||= new THREE.Group()).add(mesh);
    } else group.add(mesh);
    drawCalls++;
  }
  for (const id in wallGroups) group.add(wallGroups[id]);
  if (shadowGeos.length) {
    const sGeo = mergeGeometries(shadowGeos, false);
    if (sGeo) {
      const sMesh = new THREE.Mesh(sGeo, new THREE.MeshBasicMaterial({
        map: makeContactShadowTexture(), transparent: true, depthWrite: false, opacity: 0.85 }));
      sMesh.renderOrder = 1;
      sMesh.name = 'contact-shadows';
      group.add(sMesh);
    }
  }
  scene.add(group);

  function update() {
    for (const id in wallGroups) wallGroups[id].visible = env.northWallTall(id);
  }
  function raycast(ray) {
    let best = null, bestD = Infinity;
    const hit = new THREE.Vector3();
    for (const pk of picks) {
      if (pk.wallRoom && !env.northWallTall(pk.wallRoom)) continue;
      if (ray.intersectBox(pk.box, hit)) {
        const dd = hit.distanceTo(ray.origin);
        if (dd < bestD) { bestD = dd; best = { ...pk, point: hit.clone(), distance: dd }; }
      }
    }
    return best;
  }
  return { group, seats, update, raycast, drawCalls, picks };
}
