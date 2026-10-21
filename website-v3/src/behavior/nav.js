// Grid navigasi dari map.json (1 tile = 1 unit). A* dengan binary heap + reservasi tile antar agen.
export function createNav(collision) {
  const H = collision.length, W = collision[0].length;
  const base = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) base[y * W + x] = collision[y][x] === '.' ? 1 : 0;
  const reserved = new Map(); // tileKey -> agentId
  const key = (x, y) => y * W + x;
  const walkable = (x, y) => x >= 0 && y >= 0 && x < W && y < H && base[key(x, y)] === 1;

  function nearestWalkable(x, y, maxR = 6) {
    x = Math.floor(x); y = Math.floor(y);
    if (walkable(x, y)) return [x, y];
    for (let r = 1; r <= maxR; r++)
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        if (walkable(x + dx, y + dy)) return [x + dx, y + dy];
      }
    return null;
  }

  function findPath(sx, sy, tx, ty, avoid) {
    const s = nearestWalkable(sx, sy), t = nearestWalkable(tx, ty);
    if (!s || !t) return null;
    if (s[0] === t[0] && s[1] === t[1]) return [];
    const N = W * H;
    const g = new Float32Array(N).fill(Infinity);
    const came = new Int32Array(N).fill(-1);
    const closed = new Uint8Array(N);
    const heap = [];
    const push = (f, k) => {
      heap.push([f, k]);
      let i = heap.length - 1;
      while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; }
    };
    const pop = () => {
      const top = heap[0], last = heap.pop();
      if (heap.length) {
        heap[0] = last;
        let i = 0;
        for (;;) {
          const l = 2 * i + 1, r = l + 1; let m = i;
          if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
          if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
          if (m === i) break;
          [heap[m], heap[i]] = [heap[i], heap[m]]; i = m;
        }
      }
      return top;
    };
    const h = (x, y) => Math.abs(x - t[0]) + Math.abs(y - t[1]);
    const sk = key(s[0], s[1]), tk = key(t[0], t[1]);
    g[sk] = 0; push(h(s[0], s[1]), sk);
    while (heap.length) {
      const [, k] = pop();
      if (closed[k]) continue;
      closed[k] = 1;
      if (k === tk) break;
      const x = k % W, y = (k / W) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (!walkable(nx, ny)) continue;
        const nk = key(nx, ny);
        if (closed[nk]) continue;
        const ng = g[k] + 1 + (avoid && avoid.has(nk) ? 8 : 0);
        if (ng < g[nk]) { g[nk] = ng; came[nk] = k; push(ng + h(nx, ny), nk); }
      }
    }
    if (!closed[tk]) return null;
    const path = [];
    for (let k = tk; k !== sk; k = came[k]) path.push([k % W, (k / W) | 0]);
    return path.reverse();
  }

  function reserve(x, y, id) {
    const k = key(x, y), cur = reserved.get(k);
    if (cur && cur !== id) return false;
    reserved.set(k, id);
    return true;
  }
  function release(x, y, id) { const k = key(x, y); if (reserved.get(k) === id) reserved.delete(k); }
  function occupant(x, y) { return reserved.get(key(x, y)); }
  return { W, H, walkable, nearestWalkable, findPath, reserve, release, occupant, key };
}
