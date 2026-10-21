// finish.js v2 — tekstur detail prosedural + rim-light karakter (three r180)
import * as THREE from 'three';

const TAU = Math.PI * 2;
const SIZE = 256;

// hash deterministik agar hasil stabil antar reload
function hash(x, y, s) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

// value noise periodik (tileable) dengan periode p sel
function vnoise(x, y, p, s) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const fx = x - xi, fy = y - yi;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const w = v => ((v % p) + p) % p;
  const x0 = w(xi), x1 = w(xi + 1), y0 = w(yi), y1 = w(yi + 1);
  const a = hash(x0, y0, s), b = hash(x1, y0, s), c = hash(x0, y1, s), d = hash(x1, y1, s);
  return (a + (b - a) * ux) + ((c + (d - c) * ux) - (a + (b - a) * ux)) * uy;
}

function fbm(u, v, p, s, oct = 3) {
  let sum = 0, amp = 0.5, norm = 0, f = 1;
  for (let i = 0; i < oct; i++) {
    sum += (vnoise(u * f, v * f, p * f, s + i * 17) - 0.5) * amp;
    norm += amp; amp *= 0.5; f *= 2;
  }
  return sum / norm; // kira-kira -0.5..0.5
}

const clamp8 = v => Math.max(0, Math.min(255, Math.round(v)));

// fn(x, y) -> number (grayscale) atau [r, g, b]
function makeCanvas(size, fn) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const img = g.createImageData(size, size);
  const d = img.data;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const r = fn(x, y);
    const i = (y * size + x) * 4;
    if (typeof r === 'number') {
      d[i] = d[i + 1] = d[i + 2] = clamp8(r);
    } else {
      d[i] = clamp8(r[0]); d[i + 1] = clamp8(r[1]); d[i + 2] = clamp8(r[2] ?? r[0]);
    }
    d[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  return c;
}

function dataTexture(canvas) {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 6);
  t.colorSpace = THREE.NoColorSpace;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

// pola kayu: serat utama vertikal + serat silang tipis + pori halus
function woodSample(x, y, seed, amp) {
  const u = x / SIZE, v = y / SIZE;
  const warp = fbm(u * 4, v * 2, 4, seed, 3) * 0.6;
  const grain = Math.sin(TAU * (u * 22 + warp + Math.sin(TAU * v * 2) * 0.08));
  const fine = Math.sin(TAU * (u * 61 + warp * 1.7));
  const cross = Math.sin(TAU * (v * 9 + u * 1 + fbm(u * 2, v * 6, 2, seed + 5, 2) * 0.4));
  // pori: garis pendek searah serat, jarang
  const px = Math.floor(x / 3), py = Math.floor(y / 14);
  const h = hash(((px % 86) + 86) % 86, ((py % 19) + 19) % 19, seed + 31);
  const pore = h > 0.93 ? -1 : 0;
  const n = grain * 0.45 + fine * 0.18 + cross * 0.14 + pore * 0.55 + fbm(u * 8, v * 8, 8, seed + 9, 2) * 0.5;
  return n * amp;
}

export function makeDetailTextures() {
  // kayu: R = bump, G = roughness (dipakai roughnessMap, center tinggi agar tetap matte)
  const woodBump = dataTexture(makeCanvas(SIZE, (x, y) => {
    const b = woodSample(x, y, 11, 26);
    return [128 + b, 218 + b * 0.7, 128 + b];
  }));

  // fabric: anyaman rapat dua arah
  const fabricBump = dataTexture(makeCanvas(SIZE, (x, y) => {
    const u = x / SIZE, v = y / SIZE;
    const wx = Math.sin(TAU * u * 64), wy = Math.sin(TAU * v * 64);
    const over = Math.sign(Math.sin(TAU * (u + v) * 32)); // pola atas-bawah benang
    const weave = (over > 0 ? wx : wy) * 0.7 + wx * wy * 0.3;
    const fuzz = fbm(u * 32, v * 32, 32, 23, 2);
    return 128 + weave * 13 + fuzz * 10;
  }));

  // metal: brushing horizontal dominan; R = bump, G = roughness
  const metalRough = dataTexture(makeCanvas(SIZE, (x, y) => {
    const u = x / SIZE, v = y / SIZE;
    const streak = fbm(u * 2, v * 64, 2, 41, 3);
    const fineStreak = fbm(u * 4, v * 128, 4, 47, 2);
    const wobble = Math.sin(TAU * (v * 40 + fbm(u * 2, v * 2, 2, 53, 2) * 0.5));
    const n = streak * 0.6 + fineStreak * 0.3 + wobble * 0.1;
    return [128 + n * 40, 130 + n * 52, 128 + n * 40];
  }));

  return { woodBump, fabricBump, metalRough };
}

let _contactShadow = null;
export function makeContactShadowTexture() {
  if (_contactShadow) return _contactShadow;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.55)');
  grad.addColorStop(0.5, 'rgba(0,0,0,0.28)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.needsUpdate = true;
  _contactShadow = t;
  return t;
}

const FLOOR_CATEGORY = {
  wood_warm: 'wood', wood_light: 'wood', wood_dark: 'wood',
  lab_tile: 'tile', checker: 'tile',
  terrazzo: 'terrazzo',
  concrete: 'concrete',
  carpet_sage: 'soft', carpet_blue: 'soft', carpet_peach: 'soft', rubber: 'soft'
};

// jarak halus ke nat (0 di garis nat, 1 di tengah ubin)
function groutMask(x, y, cells, width) {
  const cs = SIZE / cells;
  const dx = Math.min(x % cs, cs - (x % cs));
  const dy = Math.min(y % cs, cs - (y % cs));
  const d = Math.min(dx, dy);
  const t = Math.max(0, Math.min(1, (d - width * 0.5) / width));
  return t * t * (3 - 2 * t);
}

// ---------------------------------------------------------------------------
// Floor detail builders: R = bump (around 128), G = roughness, B = R
// ---------------------------------------------------------------------------
const clamp255 = (v) => Math.max(0, Math.min(255, Math.round(v)));
const px = (bump, rough) => {
  const r = clamp255(128 + bump);
  return [r, clamp255(rough), r];
};

const FLOOR_BUILDERS = {
  wood(x, y) {
    const w = woodSample(x, y, 7.3, 10);
    const m = fbm(x / SIZE * 9, y / SIZE * 9, 9, 73, 2) * 8;
    return px(w * 0.9, 215 + w * 0.6 + m);
  },
  tile(x, y) {
    const g = groutMask(x, y, 4, 2.5);
    const n = fbm(x / SIZE * 24, y / SIZE * 24, 24, 81, 2) * 4;
    return px((g - 1) * 14 + n, 150 + (1 - g) * 40 + n * 1.5);
  },
  terrazzo(x, y) {
    const g = groutMask(x, y, 2, 2);
    const chip = vnoise(x / 4, y / 4, 64, 97) > 0.78 ? 5 : 0;
    const n = fbm(x / SIZE * 30, y / SIZE * 30, 30, 83, 2) * 5;
    return px((g - 1) * 10 + chip + n, 160 - chip * 2 + (1 - g) * 30 + n);
  },
  concrete(x, y) {
    const big = fbm(x / SIZE * 5, y / SIZE * 5, 5, 87, 3) * 12;
    const fine = (vnoise(x / 3, y / 3, 85, 89) - 0.5) * 6;
    return px(big * 0.6 + fine, 185 + big + fine * 0.5);
  },
  soft(x, y) {
    const pile = (vnoise(x / 2, y / 2, 128, 93) - 0.5) * 10;
    const mott = fbm(x / SIZE * 7, y / SIZE * 7, 7, 95, 2) * 8;
    return px(pile + mott * 0.5, 235 + mott * 0.6);
  },
};

const floorDetailCache = new Map();

export function makeFloorDetail(kind) {
  const cat = FLOOR_CATEGORY[kind];
  if (!cat || !FLOOR_BUILDERS[cat]) return { bump: null, rough: null };
  let tex = floorDetailCache.get(cat);
  if (!tex) {
    tex = dataTexture(makeCanvas(SIZE, FLOOR_BUILDERS[cat]));
    floorDetailCache.set(cat, tex);
  }
  return { bump: tex, rough: tex };
}

// ---------------------------------------------------------------------------
// Furniture finish
// ---------------------------------------------------------------------------
export function applyFurnitureFinish(mats, tex) {
  if (!mats || !tex) return;
  const { FurnVC, Metal, Glass } = mats;
  if (FurnVC) {
    FurnVC.bumpMap = tex.woodBump;
    FurnVC.bumpScale = 0.5;
    FurnVC.roughnessMap = tex.woodBump;
    FurnVC.roughness = 1.0;
    FurnVC.needsUpdate = true;
  }
  if (Metal) {
    Metal.roughnessMap = tex.metalRough;
    Metal.bumpMap = tex.metalRough;
    Metal.bumpScale = 0.2;
    Metal.envMapIntensity = 1.1;
    Metal.needsUpdate = true;
  }
  if (Glass) {
    Glass.envMapIntensity = 1.25;
    Glass.needsUpdate = true;
  }
}

// ---------------------------------------------------------------------------
// Character rim light
// ---------------------------------------------------------------------------
export function applyCharacterFinish(model, colorHex) {
  if (!model) return;
  const rimColor = new THREE.Color(colorHex || '#cfe4ff');
  model.traverse((obj) => {
    if (!obj.isMesh) return;
    const list = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of list) {
      if (!mat || !mat.isMeshStandardMaterial || mat.userData.rimApplied) continue;
      mat.userData.rimApplied = true;
      const prev = mat.onBeforeCompile;
      mat.onBeforeCompile = (shader, renderer) => {
        if (prev) prev.call(mat, shader, renderer);
        shader.uniforms.uRimColor = { value: rimColor.clone() };
        shader.uniforms.uRimStrength = { value: 0.32 };
        shader.fragmentShader = shader.fragmentShader
          .replace(
            'void main() {',
            'uniform vec3 uRimColor;\nuniform float uRimStrength;\nvoid main() {'
          )
          .replace(
            '#include <normal_fragment_maps>',
            '#include <normal_fragment_maps>\n' +
              'totalEmissiveRadiance += uRimColor * pow(1.0 - saturate(dot(normal, normalize(vViewPosition))), 2.6) * uRimStrength;'
          );
      };
      mat.customProgramCacheKey = () => 'rim-v1';
      mat.envMapIntensity = 0.75;
      mat.needsUpdate = true;
    }
  });
}
