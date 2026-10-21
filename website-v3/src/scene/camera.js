import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OFFICE } from './renderer.js';
import { clamp } from '../core/util.js';

const DEFAULT = { azimuth: THREE.MathUtils.degToRad(32), polar: THREE.MathUtils.degToRad(50), radius: 66 };

export function createCameraRig(dom, store) {
  const camera = new THREE.PerspectiveCamera(30, 1, 0.5, 400);
  const controls = new OrbitControls(camera, dom);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minPolarAngle = THREE.MathUtils.degToRad(24);
  controls.maxPolarAngle = THREE.MathUtils.degToRad(66);
  controls.minDistance = 7;
  controls.maxDistance = 160;
  controls.screenSpacePanning = false;
  controls.zoomToCursor = true;
  controls.rotateSpeed = 0.6;
  controls.panSpeed = 0.9;
  controls.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
  controls.target.copy(OFFICE.center);
  setSpherical(DEFAULT.azimuth, DEFAULT.polar, DEFAULT.radius);

  let tween = null, follow = null;
  const listeners = new Set();
  let quadrant = '';

  function setSpherical(az, pol, r, target = controls.target) {
    const s = new THREE.Spherical(r, pol, az);
    camera.position.setFromSpherical(s).add(target);
    camera.lookAt(target);
  }
  function current() {
    const off = camera.position.clone().sub(controls.target);
    const s = new THREE.Spherical().setFromVector3(off);
    return { az: s.theta, pol: s.phi, r: s.radius, target: controls.target.clone() };
  }

  function flyTo({ target, radius, azimuth, polar, duration = 0.9 }) {
    const from = current();
    const to = {
      target: target ? target.clone() : from.target,
      r: radius ?? from.r, az: azimuth ?? from.az, pol: polar ?? from.pol,
    };
    let daz = to.az - from.az;
    daz = ((daz + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
    to.az = from.az + daz;
    if (store.state.settings.reducedMotion) duration = 0;
    tween = { from, to, t: 0, duration };
    if (duration === 0) step(0);
  }
  function step(dt) {
    if (!tween) return;
    tween.t = tween.duration ? Math.min(1, tween.t + dt / tween.duration) : 1;
    const k = tween.t < 0.5 ? 4 * tween.t ** 3 : 1 - (-2 * tween.t + 2) ** 3 / 2;
    const { from, to } = tween;
    controls.target.lerpVectors(from.target, to.target, k);
    setSpherical(from.az + (to.az - from.az) * k, from.pol + (to.pol - from.pol) * k, from.r + (to.r - from.r) * k);
    if (tween.t >= 1) tween = null;
  }

  // batas target supaya kantor tidak hilang dari layar
  function clampTarget() {
    const t = controls.target;
    const cx = clamp(t.x, -4, OFFICE.w + 4), cz = clamp(t.z, -4, OFFICE.d + 4);
    if (cx !== t.x || cz !== t.z) {
      const dx = cx - t.x, dz = cz - t.z;
      t.x = cx; t.z = cz; camera.position.x += dx; camera.position.z += dz;
    }
    t.y = 0;
  }

  controls.addEventListener('start', () => { tween = null; follow = null; });

  function update(dt) {
    step(dt);
    if (follow) {
      const p = follow();
      if (p) {
        const delta = p.clone().sub(controls.target).multiplyScalar(Math.min(1, dt * 4));
        delta.y = 0;
        controls.target.add(delta); camera.position.add(delta);
      }
    }
    controls.update();
    clampTarget();
    const off = camera.position.clone().sub(controls.target);
    const q = (off.x >= 0 ? 'E' : 'W') + (off.z >= 0 ? 'S' : 'N');
    if (q !== quadrant) { quadrant = q; listeners.forEach(fn => fn(q)); }
  }

  function resize(w, h) {
    camera.aspect = w / h;
    // layar sempit: mundurkan kamera supaya seluruh kantor terlihat
    camera.fov = w / h < 1 ? 42 : 30;
    vp = { w, h };
    applyOffset();
    camera.updateProjectionMatrix();
  }

  let insets = { left: 0, right: 0 }, vp = { w: 1, h: 1 };
  function applyOffset() {
    const dx = (insets.left - insets.right) / 2;
    if (Math.abs(dx) < 1) camera.clearViewOffset();
    else camera.setViewOffset(vp.w, vp.h, -dx, 0, vp.w, vp.h);
  }
  function setInsets(left, right) { insets = { left, right }; applyOffset(); }
  const portrait = () => camera.aspect < 0.9;
  function overviewRadius() {
    // muat seluruh kantor (64 x 44) dengan ruang untuk panel UI
    const half = THREE.MathUtils.degToRad(camera.fov / 2);
    const effAspect = Math.max(0.4, (vp.w - insets.left - insets.right) / vp.h);
    const needH = portrait() ? Math.max(50 / camera.aspect, 62) : Math.max(74 / effAspect, 48);
    return clamp((needH / 2) / Math.tan(half) * 1.05, 40, 160);
  }
  function reset() {
    follow = null;
    flyTo({ target: OFFICE.center, radius: overviewRadius(), azimuth: portrait() ? THREE.MathUtils.degToRad(84) : DEFAULT.azimuth, polar: DEFAULT.polar });
  }
  function rotateBy(deg) { const c = current(); flyTo({ azimuth: c.az + THREE.MathUtils.degToRad(deg), duration: 0.5 }); }
  function zoomBy(f) { const c = current(); flyTo({ radius: clamp(c.r * f, controls.minDistance, controls.maxDistance), duration: 0.35 }); }
  function focusRoom(room) {
    const [x, y, w, d] = room.rect_tiles;
    const c = new THREE.Vector3(x + w / 2, 0, y + d / 2 + 0.5);
    const r = Math.max(w, d * 1.3) * (camera.aspect < 1 ? 2.4 : 1.55) + 4;
    follow = null;
    flyTo({ target: c, radius: r, polar: THREE.MathUtils.degToRad(48) });
  }
  function focusPoint(p, radius = 10, followFn = null) {
    flyTo({ target: new THREE.Vector3(p.x, 0, p.z), radius, polar: THREE.MathUtils.degToRad(46), duration: 0.8 });
    follow = followFn;
  }
  return {
    camera, controls, update, resize, reset, setInsets, rotateBy, zoomBy, focusRoom, focusPoint, overviewRadius,
    onQuadrant: fn => { listeners.add(fn); if (quadrant) fn(quadrant); },
    stopFollow: () => { follow = null; },
    get following() { return !!follow; },
  };
}
