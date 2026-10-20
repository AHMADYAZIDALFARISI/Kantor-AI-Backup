import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const FRUSTUM_HALF_H = 26;
const CENTER = new THREE.Vector3(32, 0, 23);
const CAM_DISTANCE = 90;
const AZIMUTH = THREE.MathUtils.degToRad(45);
const ELEVATION = THREE.MathUtils.degToRad(35.264);

function toColor(v, fallback) {
  if (v === undefined || v === null || v === '') return new THREE.Color(fallback);
  try {
    return new THREE.Color(v);
  } catch (e) {
    return new THREE.Color(fallback);
  }
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, h / 2, w / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.arcTo(x + w, y, x + w, y + rr, rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
  ctx.lineTo(x + rr, y + h);
  ctx.arcTo(x, y + h, x, y + h - rr, rr);
  ctx.lineTo(x, y + rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

function makeLabelSprite(text, accent) {
  const fontSize = 48;
  const padX = 32;
  const padY = 18;
  const border = 5;
  const font = `600 ${fontSize}px "Inter", "Segoe UI", system-ui, sans-serif`;

  const measure = document.createElement('canvas').getContext('2d');
  measure.font = font;
  const textW = Math.ceil(measure.measureText(text).width);

  const cw = textW + padX * 2 + border * 2;
  const ch = fontSize + padY * 2 + border * 2;
  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');

  const accentColor = toColor(accent, 0x6cc4ff);
  const accentCss = '#' + accentColor.getHexString();

  roundRect(ctx, border / 2, border / 2, cw - border, ch - border, (ch - border) / 2);
  ctx.fillStyle = 'rgba(20, 24, 32, 0.88)';
  ctx.fill();
  ctx.lineWidth = border;
  ctx.strokeStyle = accentCss;
  ctx.stroke();

  ctx.font = font;
  ctx.fillStyle = '#f2f4f8';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cw / 2, ch / 2 + 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.needsUpdate = true;

  const mat = new THREE.SpriteMaterial({
    map: tex,
    depthTest: false,
    depthWrite: false,
    transparent: true,
  });
  const sprite = new THREE.Sprite(mat);
  sprite.renderOrder = 999;
  const h = 0.9;
  sprite.scale.set(h * (cw / ch), h, 1);
  return sprite;
}

function makeBox(w, h, d, x, y, z, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function buildWorld(data, paletteMap, container) {
  paletteMap = paletteMap || {};
  const getSize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    return { w: Math.max(1, w), h: Math.max(1, h) };
  };

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const size0 = getSize();
  renderer.setSize(size0.w, size0.h);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1e26);

  const aspect = size0.w / size0.h;
  const camera = new THREE.OrthographicCamera(
    -FRUSTUM_HALF_H * aspect,
    FRUSTUM_HALF_H * aspect,
    FRUSTUM_HALF_H,
    -FRUSTUM_HALF_H,
    0.1,
    1000
  );
  camera.position.set(
    CENTER.x + CAM_DISTANCE * Math.cos(ELEVATION) * Math.sin(AZIMUTH),
    CENTER.y + CAM_DISTANCE * Math.sin(ELEVATION),
    CENTER.z + CAM_DISTANCE * Math.cos(ELEVATION) * Math.cos(AZIMUTH)
  );
  camera.lookAt(CENTER);
  camera.updateProjectionMatrix();

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.copy(CENTER);
  controls.enableRotate = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.minZoom = 0.5;
  controls.maxZoom = 3;
  controls.screenSpacePanning = true;
  controls.update();

  const hemi = new THREE.HemisphereLight(0xffffff, 0xb0a8a0, 0.6);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(30, 50, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = 0;
  sun.shadow.camera.right = 64;
  sun.shadow.camera.top = 46;
  sun.shadow.camera.bottom = 0;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 120;
  sun.shadow.bias = -0.0005;
  sun.shadow.camera.updateProjectionMatrix();
  scene.add(sun);
  scene.add(sun.target);
  sun.target.position.set(30, 0, 20);
  sun.target.updateMatrixWorld();

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), new THREE.MeshStandardMaterial({ color: 0x232833, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.21;
  ground.receiveShadow = true;
  scene.add(ground);

  const toCss = (hex) => '#' + hex.toString(16).padStart(6, '0');

  const addBox = (gw, gh, gd, px, py, pz, color) => {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(gw, gh, gd),
      new THREE.MeshStandardMaterial({ color, roughness: 0.8 })
    );
    m.position.set(px, py, pz);
    m.castShadow = m.receiveShadow = true;
    group.add(m);
    return m;
  };

  const makeLabel = (text, accent) => {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    const font = 'bold 44px system-ui, sans-serif';
    ctx.font = font;
    const pad = 28, h = 80;
    const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
    c.width = w; c.height = h;
    ctx.font = font;
    const r = h / 2 - 4;
    ctx.beginPath();
    ctx.moveTo(4 + r, 4);
    ctx.lineTo(w - 4 - r, 4);
    ctx.arc(w - 4 - r, h / 2, r, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(4 + r, h - 4);
    ctx.arc(4 + r, h / 2, r, Math.PI / 2, Math.PI * 1.5);
    ctx.closePath();
    ctx.fillStyle = 'rgba(20,24,32,0.78)';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = toCss(accent);
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2 + 2);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    sprite.renderOrder = 999;
    const sh = 0.9;
    sprite.scale.set(sh * (w / h), sh, 1);
    return sprite;
  };

  const group = new THREE.Group();
  group.userData.rooms = {};
  for (const room of data.map.rooms) {
    const { id } = room;
    const label = room.name || room.label || id;
    const rect = room.rect_tiles || room.rect || [0, 0, 8, 8];
    const [x, y, w, d] = rect;
    const pal = paletteMap[id];
    const floorC = pal?.floor ?? 0x8a7f72;
    const wallC = pal?.wall ?? 0xd8d2c8;
    addBox(w, 0.2, d, x + w / 2, -0.1, y + d / 2, floorC);
    addBox(w, 2.5, 0.15, x + w / 2, 1.25, y + 0.075, wallC);
    addBox(0.15, 2.5, d, x + 0.075, 1.25, y + d / 2, wallC);
    addBox(w, 0.3, 0.15, x + w / 2, 0.15, y + d - 0.075, wallC);
    addBox(0.15, 0.3, d, x + w - 0.075, 0.15, y + d / 2, wallC);

    const sprite = makeLabel(label ?? id, pal?.accent ?? 0x4a90d9);
    sprite.position.set(x + w / 2, 4.2, y + d / 2);
    group.add(sprite);

    group.userData.rooms[id] = { center: new THREE.Vector3(x + w / 2, 0, y + d / 2), rect, label };
  }
  scene.add(group);

  const rooms = group.userData.rooms;

  function onResize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    const aspect = w / h;
    if (camera.isOrthographicCamera) {
      const fh = camera.top - camera.bottom;
      camera.left = -fh * aspect / 2;
      camera.right = fh * aspect / 2;
      camera.aspect = aspect;
    } else {
      camera.aspect = aspect;
    }
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
  onResize();

  (function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  })();

  return { renderer, scene, camera, controls, rooms };
}

export function fitCameraToRoom(camera, controls, center, w, d) {
  controls.target.copy(center);
  const frustumH = camera.top - camera.bottom;
  const frustumW = frustumH * (camera.aspect ?? (camera.right - camera.left) / (camera.top - camera.bottom));
  const zoom = Math.min(frustumW / w, frustumH / d) * 0.8;
  camera.zoom = Math.min(3, Math.max(0.5, zoom));
  camera.updateProjectionMatrix();
  controls.update();
}