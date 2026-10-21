#!/usr/bin/env python3
"""office_ops — operasi Kantor KCSH 3D dari bot Telegram.

Membaca/mengubah data tugas kantor (office3d/data) lalu men-deploy ulang ke
Vercel supaya progres live di https://kantor-kcsh.vercel.app.

Aksi yang didukung (dipanggil dari super_agent_core setelah validasi):
  list_tasks(staff_id=None)          -> ringkasan tugas
  approve_task(staff_id, index)      -> progress=100, done=True
  add_task(staff_id, title, eta)     -> tambah tugas baru
  set_progress(staff_id, index, p)   -> set progres 0..100

Semua mutasi men-trigger redeploy (kecuali dry_run=True).
"""
import subprocess
import shlex
import json
import os
import time
import urllib.request
import urllib.error

HOME = os.path.expanduser("~")
OFFICE = os.path.join(HOME, "workspace", "kantor-kcsh", "v3", "office3d")
DATA = os.path.join(OFFICE, "public", "data")
TOKEN_FILE = os.path.join(HOME, ".config", "kantor-kcsh", "vercel-token")
TEAM = "team_IXiZcrNqgHjbeaoAik0iqCYf"
PROJECT = "prj_ANBxPXiDqwB3rSIBaW8nrKQEIj44"
LIVE_URL = "https://kantor-kcsh.vercel.app"


def _load(name):
    with open(os.path.join(DATA, name), encoding="utf-8") as f:
        return json.load(f)


def _stamp(task):
    """Tugas yang disentuh pemilik lewat bot = data operasional."""
    import datetime as _dt
    task["kind"] = "operational"
    task["updated_at"] = _dt.datetime.now().astimezone().isoformat(timespec="seconds")
    return task


def _save_tasks(tasks):
    with open(os.path.join(DATA, "tasks.json"), "w", encoding="utf-8") as f:
        json.dump(tasks, f, ensure_ascii=False, indent=1)


def staff_list():
    """[(id, name, title, room)]"""
    return [(s["id"], s.get("name", s["id"]), s.get("title", ""), s.get("room", ""))
            for s in _load("staff.json")]


def resolve_staff(query):
    """Cari staf dari nama/id/judul (substring, case-insensitive). None bila ambigu/tidak ada."""
    q = (query or "").strip().lower()
    if not q:
        return None
    hits = []
    for sid, name, title, room in staff_list():
        if q == sid.lower() or q == name.lower():
            return sid
        if q in name.lower() or q in title.lower():
            hits.append(sid)
    return hits[0] if len(hits) == 1 else None


def office_context():
    """Ringkasan staf + tugas untuk prompt LLM (dengan indeks tugas)."""
    tasks = _load("tasks.json")
    lines = []
    for sid, name, title, room in staff_list():
        ts = tasks.get(sid, [])
        tdesc = "; ".join(
            f"[{i}] {t.get('title','?')} ({int(t.get('progress',0))}%{' selesai' if t.get('done') else ''})"
            for i, t in enumerate(ts)) or "tidak ada tugas"
        lines.append(f"- {name} (id:{sid}, {title}): {tdesc}")
    return "\n".join(lines)


def list_tasks(staff_id=None):
    tasks = _load("tasks.json")
    out = []
    for sid, name, title, room in staff_list():
        if staff_id and sid != staff_id:
            continue
        ts = tasks.get(sid, [])
        if not ts:
            out.append(f"{name}: tidak ada tugas")
            continue
        rows = "\n".join(
            f"  [{i}] {t.get('title','?')} — {int(t.get('progress',0))}%{' ✅' if t.get('done') else ''}"
            for i, t in enumerate(ts))
        out.append(f"{name}:\n{rows}")
    return "\n".join(out)


def _mutate(fn):
    tasks = _load("tasks.json")
    msg = fn(tasks)
    _save_tasks(tasks)
    return msg


def approve_task(staff_id, index):
    def fn(tasks):
        ts = tasks.get(staff_id, [])
        if not (0 <= index < len(ts)):
            raise ValueError("indeks tugas tidak valid")
        ts[index]["progress"] = 100
        ts[index]["done"] = True
        _stamp(ts[index])
        return f"Tugas '{ts[index].get('title','?')}' di-ACC (100%, selesai)."
    return _mutate(fn)


def add_task(staff_id, title, eta="-"):
    def fn(tasks):
        tasks.setdefault(staff_id, []).append(_stamp(
            {"title": title, "progress": 0, "eta": eta or "-", "done": False}))
        return f"Tugas baru '{title}' ditambahkan."
    return _mutate(fn)


def set_progress(staff_id, index, progress):
    def fn(tasks):
        ts = tasks.get(staff_id, [])
        if not (0 <= index < len(ts)):
            raise ValueError("indeks tugas tidak valid")
        p = max(0, min(100, int(progress)))
        ts[index]["progress"] = p
        ts[index]["done"] = p >= 100
        _stamp(ts[index])
        return f"Progres '{ts[index].get('title','?')}' diatur ke {p}%."
    return _mutate(fn)


def apply_action(action):
    """Eksekusi dict aksi tervalidasi. Return (summary:str, mutated:bool)."""
    kind = action.get("action")
    if kind == "list_tasks":
        sid = action.get("staff_id")
        if action.get("staff"):
            sid = resolve_staff(action["staff"]) or sid
        return list_tasks(sid), False
    sid = action.get("staff_id")
    if action.get("staff"):
        sid = resolve_staff(action["staff"])
    if not sid:
        return "Nama staf tidak dikenali. Sebutkan nama stafnya ya.", False
    name = dict((s[0], s[1]) for s in staff_list()).get(sid, sid)
    if kind == "approve_task":
        return f"{name}: " + approve_task(sid, int(action.get("index", -1))), True
    if kind == "add_task":
        title = (action.get("title") or "").strip()
        if not title:
            return "Judul tugasnya kosong.", False
        return f"{name}: " + add_task(sid, title, action.get("eta", "-")), True
    if kind == "set_progress":
        return f"{name}: " + set_progress(sid, int(action.get("index", -1)),
                                          int(action.get("progress", 0))), True
    return "Aksi tidak dikenal.", False


# ---------------- redeploy ----------------

def _api(method, path, token, data=None, headers=None):
    h = {"Authorization": "Bearer " + token}
    if headers:
        h.update(headers)
    body = data if isinstance(data, bytes) else (
        json.dumps(data).encode() if data is not None else None)
    if body and "Content-Type" not in h:
        h["Content-Type"] = "application/json"
    req = urllib.request.Request("https://api.vercel.com" + path, data=body,
                                 headers=h, method=method)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return r.status, json.loads(r.read() or b"{}")
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b"{}")


def redeploy(timeout_s=600):
    """Deploy ulang kantor v3 via Vercel CLI (build Vite di server Vercel)."""
    token = open(TOKEN_FILE).read().strip()
    try:
        cp = subprocess.run(
            "npx -y vercel@latest deploy --prod --yes --token " + shlex.quote(token),
            shell=True, cwd=OFFICE, capture_output=True, text=True, timeout=timeout_s)
        out = (cp.stdout or "") + (cp.stderr or "")
        if cp.returncode == 0 and "kantor-kcsh.vercel.app" in out or cp.returncode == 0:
            return f"Sudah live di {LIVE_URL}"
        return "Deploy gagal: " + out.strip().splitlines()[-1][:120] if out.strip() else "Deploy gagal."
    except subprocess.TimeoutExpired:
        return "Deploy terkirim, masih proses build (cek lagi sebentar)."
    except Exception as e:
        return f"Deploy gagal: {e}"
