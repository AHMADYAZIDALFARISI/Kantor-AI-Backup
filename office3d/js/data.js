// js/data.js
export async function loadData() {
  const files = {
    map: 'data/map.json',
    staff: 'data/staff.json',
    tasks: 'data/tasks.json',
    divisions: 'data/divisions.json',
    builders: 'data/furniture-builders.json',
    skills: 'data/skills.json',
    bridge: 'data/bridge.json',
  };
  const entries = await Promise.all(
    Object.entries(files).map(async ([key, url]) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`${url}: ${res.status}`);
        return [key, await res.json()];
      } catch (e) {
        console.warn('loadData failed for', url, e);
        return [key, key === 'map' ? { rooms: [], furniture: [], pois: [], collision: [], agents: [] } : []];
      }
    })
  );
  return Object.fromEntries(entries);
}

export function hexToInt(hex) {
  if (typeof hex === 'number') return hex;
  if (!hex) return 0;
  let h = String(hex).trim().replace(/^#|^0x/i, '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  return Number.isNaN(n) ? 0 : n;
}

function toHex(r, g, b) {
  return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
}

function median(arr) {
  if (!arr.length) return 0;
  const s = arr.slice().sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}

function sampleRegion(ctx, x, y, w, h, step = 2) {
  x = Math.max(0, Math.floor(x)); y = Math.max(0, Math.floor(y));
  w = Math.max(1, Math.floor(w)); h = Math.max(1, Math.floor(h));
  const d = ctx.getImageData(x, y, w, h).data;
  const rs = [], gs = [], bs = [];
  for (let j = 0; j < h; j += step) {
    for (let i = 0; i < w; i += step) {
      const k = (j * w + i) * 4;
      if (d[k + 3] < 128) continue;
      rs.push(d[k]); gs.push(d[k + 1]); bs.push(d[k + 2]);
    }
  }
  return { r: median(rs), g: median(gs), b: median(bs), n: rs.length };
}

function sampleAccent(ctx, W, H) {
  const d = ctx.getImageData(0, 0, W, H).data;
  let best = null, bestSat = -1;
  const buckets = new Map();
  for (let k = 0; k < d.length; k += 4 * 16) {
    if (d[k + 3] < 128) continue;
    const r = d[k], g = d[k + 1], b = d[k + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const sat = mx === 0 ? 0 : (mx - mn) / mx;
    if (sat < 0.35 || mx < 60) continue;
    const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
    const e = buckets.get(key) || { r: [], g: [], b: [], sat: 0 };
    e.r.push(r); e.g.push(g); e.b.push(b); e.sat += sat;
    buckets.set(key, e);
  }
  for (const e of buckets.values()) {
    const score = e.sat;
    if (score > bestSat) { bestSat = score; best = e; }
  }
  if (!best) return null;
  return { r: median(best.r), g: median(best.g), b: median(best.b) };
}

const colorCache = new Map();

export function sampleRoomColors(roomImgUrl) {
  if (colorCache.has(roomImgUrl)) return colorCache.get(roomImgUrl);
  const fallback = { floor: '#8a7f72', wall: '#d8d2c8', accent: '#4a90d9' };
  const p = new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const W = img.naturalWidth || 1024, H = img.naturalHeight || 736;
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, W, H);
        // floor: central region
        const f = sampleRegion(ctx, W * 0.3, H * 0.35, W * 0.4, H * 0.3, 3);
        // wall: top strip + left strip
        const wt = sampleRegion(ctx, W * 0.1, 0, W * 0.8, H * 0.06, 2);
        const wl = sampleRegion(ctx, 0, H * 0.1, W * 0.04, H * 0.8, 2);
        const wn = wt.n + wl.n || 1;
        const wall = {
          r: (wt.r * wt.n + wl.r * wl.n) / wn,
          g: (wt.g * wt.n + wl.g * wl.n) / wn,
          b: (wt.b * wt.n + wl.b * wl.n) / wn,
        };
        const a = sampleAccent(ctx, W, H);
        resolve({
          floor: f.n ? toHex(f.r, f.g, f.b) : fallback.floor,
          wall: wn > 1 ? toHex(wall.r, wall.g, wall.b) : fallback.wall,
          accent: a ? toHex(a.r, a.g, a.b) : fallback.accent,
        });
      } catch (e) {
        console.warn('sampleRoomColors failed', roomImgUrl, e);
        resolve(fallback);
      }
    };
    img.onerror = () => resolve(fallback);
    img.src = roomImgUrl;
  });
  colorCache.set(roomImgUrl, p);
  return p;
}
