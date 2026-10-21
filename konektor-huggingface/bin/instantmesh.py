"""Jalankan pipeline InstantMesh (Space TencentARC/InstantMesh) -> berkas GLB.

Usage: instantmesh.py <gambar-input> <keluaran.glb>
Menggunakan kredensial konektor custom.huggingface (surrogate) agar kuota
ZeroGPU dihitung ke akun pemilik, bukan kuota anonim.
"""
import os
import shutil
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
# VM ini: no_proxy bawaan berisi [::1] yang merusak parser URL httpx — timpa paksa.
os.environ["no_proxy"] = "127.0.0.1,localhost"
os.environ["NO_PROXY"] = "127.0.0.1,localhost"

from hf_lib import hf_surrogate  # noqa: E402


def main():
    if len(sys.argv) != 3:
        print("usage: instantmesh.py <gambar-input> <keluaran.glb>")
        return 2
    src_img, out_glb = sys.argv[1], sys.argv[2]
    import httpx
    from gradio_client import Client, handle_file

    t0 = time.time()
    surrogate = hf_surrogate()
    client = Client(
        "TencentARC/InstantMesh",
        token=surrogate,
        headers={"Authorization": f"Bearer {surrogate}"},
        httpx_kwargs={"timeout": httpx.Timeout(900, connect=60)},
    )
    print("terhubung ke Space (terautentikasi)", flush=True)
    proc = client.predict(handle_file(src_img), True, api_name="/preprocess")
    pimg = proc["path"] if isinstance(proc, dict) else proc
    print(f"preprocess OK ({time.time() - t0:.0f}s)", flush=True)
    client.predict(handle_file(pimg), 75, 42, api_name="/generate_mvs")
    print(f"multi-view OK ({time.time() - t0:.0f}s)", flush=True)
    _obj, glb = client.predict(api_name="/make3d")
    src = glb["path"] if isinstance(glb, dict) else glb
    os.makedirs(os.path.dirname(os.path.abspath(out_glb)), exist_ok=True)
    shutil.copy(src, out_glb)
    print(f"GLB tersimpan: {out_glb} ({time.time() - t0:.0f}s total)", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
