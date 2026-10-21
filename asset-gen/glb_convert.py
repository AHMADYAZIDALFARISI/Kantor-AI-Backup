"""Konversi OBJ hasil TripoSR -> GLB siap pipa aset kantor.

Usage: glb_convert.py <input.obj> <output.glb>
Menambal ketidakcocokan trimesh vs numpy 2.x (ndarray.ptp dihapus).
"""
import sys

import numpy as np
import trimesh.util as _u


def _allclose(a, b, atol=1e-8):
    return float(np.ptp(np.asanyarray(a, dtype=np.float64) - np.asanyarray(b, dtype=np.float64))) < atol


_u.allclose = _allclose

import os  # noqa: E402
import trimesh  # noqa: E402


def main():
    src, out = sys.argv[1], sys.argv[2]
    m = trimesh.load(src)
    if hasattr(m, "dump"):
        m = m.dump(concatenate=True)
    m.export(out)
    g = trimesh.load(out)
    if hasattr(g, "dump"):
        g = g.dump(concatenate=True)
    print(f"GLB OK: {os.path.getsize(out) // 1024} KB | segitiga: {len(g.faces):,} | "
          f"vertex: {len(g.vertices):,} | watertight: {g.is_watertight} | "
          f"bounds: {g.bounds.round(2).tolist()}")


if __name__ == "__main__":
    main()
