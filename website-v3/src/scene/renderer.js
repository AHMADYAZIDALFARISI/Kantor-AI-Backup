import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export const OFFICE = { w: 64, d: 46, center: new THREE.Vector3(32, 0, 24) };

export function detectTier() {
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const small = Math.min(screen.width, screen.height) < 820;
  const mem = navigator.deviceMemory || 8;
  if (coarse && small) return 'low';
  if (coarse || mem <= 4) return 'medium';
  return 'high';
}

export function createRenderer(container, settings) {
  let tier = settings.quality === 'auto' ? detectTier() : settings.quality;
  const renderer = new THREE.WebGLRenderer({ antialias: tier !== 'low', powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = gradientTexture();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.3;
  pmrem.dispose();

  const hemi = new THREE.HemisphereLight(0xfff6ec, 0x9c8f82, 0.8);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0dc, 2.1);
  sun.position.set(OFFICE.center.x + 22, 42, OFFICE.center.z + 30);
  sun.target.position.copy(OFFICE.center);
  sun.shadow.camera.left = -42; sun.shadow.camera.right = 42;
  sun.shadow.camera.top = 34; sun.shadow.camera.bottom = -34;
  sun.shadow.camera.near = 5; sun.shadow.camera.far = 110;
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);
  const fill = new THREE.DirectionalLight(0xdfe8ff, 0.45);
  fill.position.set(OFFICE.center.x - 30, 25, OFFICE.center.z - 20);
  fill.target.position.copy(OFFICE.center);
  scene.add(fill, fill.target);

  function applyTier(t) {
    tier = t;
    const dpr = window.devicePixelRatio || 1;
    renderer.setPixelRatio(Math.min(dpr, t === 'high' ? 2 : t === 'medium' ? 1.5 : 1.25));
    const shadows = t !== 'low';
    renderer.shadowMap.enabled = shadows;
    sun.castShadow = shadows;
    const size = t === 'high' ? 4096 : 2048;
    if (sun.shadow.mapSize.x !== size) {
      sun.shadow.mapSize.set(size, size);
      sun.shadow.map?.dispose(); sun.shadow.map = null;
    }
    scene.traverse(o => { if (o.material) o.material.needsUpdate = true; });
  }
  applyTier(tier);

  function resize() {
    const w = container.clientWidth || innerWidth, h = container.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = w + 'px';
    renderer.domElement.style.height = h + 'px';
    return { w, h };
  }

  // Kualitas adaptif: turunkan tier bila FPS rata-rata 4 detik terlalu rendah (hanya mode auto).
  let acc = 0, frames = 0, downgraded = 0;
  function sample(dt) {
    if (settings.quality !== 'auto' || downgraded >= 2) return;
    acc += dt; frames++;
    if (acc >= 4) {
      const fps = frames / acc;
      acc = 0; frames = 0;
      if (fps < 32 && tier !== 'low') { applyTier(tier === 'high' ? 'medium' : 'low'); downgraded++; }
    }
  }

  return { renderer, scene, sun, resize, applyTier, sample, get tier() { return tier; } };
}

function gradientTexture() {
  const c = document.createElement('canvas');
  c.width = 2; c.height = 256;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, '#e9ebef');
  grd.addColorStop(0.55, '#dfe2e7');
  grd.addColorStop(1, '#c9ccd3');
  g.fillStyle = grd; g.fillRect(0, 0, 2, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
