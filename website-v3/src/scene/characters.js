import * as THREE from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { applyCharacterFinish } from './finish.js';

const FADE = 0.28;

export async function loadCharacters(scene, data, loader, onProgress) {
  const rig = await loader.loadAsync('assets/characters/rig_clips.glb');
  const clips = {};
  for (const c of rig.animations) {
    const cc = c.clone();
    // pertahankan rotasi semua tulang + translasi hips saja (proporsi tiap karakter berbeda)
    cc.tracks = cc.tracks.filter(t => t.name.endsWith('.quaternion') || /^hips\.position$/.test(t.name));
    clips[c.name] = cc;
  }
  const figs = {};
  let done = 0;
  const staff = data.staff || [];
  await Promise.all(staff.map(async s => {
    const g = await loader.loadAsync(`assets/characters/${s.id}.glb`);
    const model = g.scene;
    // variasi skala halus antar karakter (deterministik dari id) agar siluet tidak seragam
    const sv = 0.97 + (((s.id.charCodeAt(0) * 7 + s.id.length * 13) % 7) * 0.01);
    model.scale.setScalar(sv);
    model.traverse(o => {
      if (o.isMesh) {
        o.castShadow = true; o.receiveShadow = false; o.frustumCulled = false;
        o.material.roughness = 0.7; o.material.envMapIntensity = 0.6;
      }
    });
    try { applyCharacterFinish(model, (s.palette && s.palette[2]) || '#cfe4ff'); } catch (e) { /* lanjut tanpa rim shader */ }
    const root = new THREE.Group();
    root.name = 'agent:' + s.id;
    root.add(model);
    const mixer = new THREE.AnimationMixer(model);
    const actions = {};
    for (const n in clips) {
      const a = mixer.clipAction(clips[n]);
      a.enabled = true;
      actions[n] = a;
    }
    // bayangan blob (dipakai saat shadow map mati)
    const blob = new THREE.Mesh(new THREE.CircleGeometry(0.32, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2; blob.position.y = 0.01; blob.visible = false;
    root.add(blob);
    scene.add(root);
    const fig = { id: s.id, staff: s, root, model, mixer, actions, current: null, blob, timeScale: 1 };
    play(fig, 'idle', 0);
    figs[s.id] = fig;
    onProgress?.(++done / staff.length);
  }));
  return { figs, clips };
}

export function play(fig, name, fade = FADE, timeScale = 1) {
  const next = fig.actions[name] || fig.actions.idle;
  if (fig.current === next) { next.timeScale = timeScale; return; }
  next.reset();
  next.timeScale = timeScale;
  next.setEffectiveWeight(1);
  next.play();
  // fase acak supaya agen tidak bergerak serempak
  next.time = (fig.id.length * 0.37) % next.getClip().duration;
  if (fig.current) fig.current.crossFadeTo(next, fade, false);
  fig.current = next;
}

export function createSelection(scene) {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.42, 0.52, 40),
    new THREE.MeshBasicMaterial({ color: 0x5b6cff, transparent: true, opacity: 0.95, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.visible = false; ring.renderOrder = 2;
  const hover = new THREE.Mesh(
    new THREE.RingGeometry(0.4, 0.46, 40),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7, depthWrite: false }));
  hover.rotation.x = -Math.PI / 2; hover.visible = false;
  scene.add(ring, hover);
  return {
    ring, hover,
    update(t, sel, hov) {
      ring.visible = !!sel;
      if (sel) { ring.position.set(sel.x, 0.02, sel.z); const k = 1 + Math.sin(t * 4) * 0.05; ring.scale.set(k, k, k); }
      hover.visible = !!hov && hov !== sel;
      if (hover.visible) hover.position.set(hov.x, 0.015, hov.z);
    },
  };
}

// Potret 3D kecil untuk panel UI, dirender sekali per karakter.
export function createPortraits(renderer, figs) {
  const cache = {};
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8078, 2.0));
  const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(1.5, 2.5, 3); scene.add(key);
  const cam = new THREE.PerspectiveCamera(24, 1, 0.1, 20);
  cam.position.set(0.35, 1.58, 1.75); cam.lookAt(0, 1.42, 0);
  const rt = new THREE.WebGLRenderTarget(256, 256, { samples: 4, colorSpace: THREE.SRGBColorSpace });
  return function portrait(id) {
    if (cache[id]) return cache[id];
    const fig = figs[id];
    if (!fig) return '';
    const clone = SkeletonUtils.clone(fig.model);
    const mixer = new THREE.AnimationMixer(clone);
    const a = mixer.clipAction(fig.actions.idle.getClip()); a.play(); mixer.setTime(0.4);
    scene.add(clone);
    const prevTarget = renderer.getRenderTarget();
    const prevClear = renderer.getClearAlpha();
    renderer.setRenderTarget(rt);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(scene, cam);
    const px = new Uint8Array(256 * 256 * 4);
    renderer.readRenderTargetPixels(rt, 0, 0, 256, 256, px);
    renderer.setRenderTarget(prevTarget);
    renderer.setClearAlpha(prevClear);
    scene.remove(clone);
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const g = c.getContext('2d');
    const img = g.createImageData(256, 256);
    for (let y = 0; y < 256; y++) img.data.set(px.subarray((255 - y) * 1024, (256 - y) * 1024), y * 1024);
    g.putImageData(img, 0, 0);
    cache[id] = c.toDataURL('image/png');
    return cache[id];
  };
}
