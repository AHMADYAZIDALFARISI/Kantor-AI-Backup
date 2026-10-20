#!/usr/bin/env python3
"""kantor-bridge: pintu API ber-auth untuk kantor-kcsh 3D.

Mengekspos via tunnel (cloudflared -> 127.0.0.1:20129):
  GET  /health            -> {ok:true} (tanpa auth, buat health check)
  POST /v1/chat           -> {agent_id, messages:[{role,content}], model?} -> {reply}
  POST /v1/mcp/tools      -> {app} -> {tools:[{name,description}]}
  POST /v1/mcp/call       -> {app, name, arguments} -> {ok, result}

Auth: header Authorization: Bearer <token> (token di .token, dibuat otomatis).
Rate limit per IP: 30/jam chat, 10/jam mcp/call. Hanya stdlib.
"""
import json
import os
import re
import sqlite3
import subprocess
import sys
import time
import urllib.request as _urlreq
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HOME = os.path.expanduser("~")
BASE = os.path.join(HOME, "workspace", "kantor-bridge")
TOKEN_FILE = os.path.join(BASE, ".token")
VENV_PY = os.path.join(HOME, "workspace", "Muse-Skill-Hub", "runtime", ".venv", "bin", "python")
MCP_CLIENT = os.path.join(HOME, "workspace", "artcraft", "mcp", "client.py")
NINEROUTER_URL = "http://127.0.0.1:20128/api/v1/chat/completions"
STAFF_JSON = os.path.join(HOME, "workspace", "kantor-kcsh", "office3d", "data", "staff.json")
DIV_JSON = os.path.join(HOME, "workspace", "kantor-kcsh", "office3d", "data", "divisions.json")
PORT = 20129

ALLOWED_APPS = {"photocraft", "vectorcraft", "filmcraft", "lightcraft", "pdfcraft",
                "effectcraft", "designcraft", "figcraft", "wordcraft", "soundcraft",
                "deckcraft", "cadcraft", "gridcraft"}
NAME_RE = re.compile(r"^[A-Za-z0-9_.-]{1,80}$")

# rate limit: {ip: [timestamps]}
_hits = {}
def rate_ok(ip, key, limit, window=3600):
    now = time.time()
    k = (ip, key)
    arr = [t for t in _hits.get(k, []) if now - t < window]
    if len(arr) >= limit:
        return False
    arr.append(now)
    _hits[k] = arr
    return True

def get_token():
    if not os.path.exists(TOKEN_FILE):
        import secrets
        os.makedirs(BASE, exist_ok=True)
        tok = secrets.token_urlsafe(32)
        with open(TOKEN_FILE, "w") as f:
            f.write(tok)
        os.chmod(TOKEN_FILE, 0o600)
        return tok
    with open(TOKEN_FILE) as f:
        return f.read().strip()

BRIDGE_TOKEN = get_token()

def ninerouter_key():
    con = sqlite3.connect(os.path.join(HOME, ".9router", "db", "data.sqlite"))
    try:
        row = con.execute("SELECT key FROM apiKeys WHERE name='gembul-design' LIMIT 1").fetchone()
    finally:
        con.close()
    if not row:
        raise RuntimeError("9router apiKey 'gembul-design' not found")
    return row[0]

def load_personas():
    try:
        staff = json.load(open(STAFF_JSON))
        divs = {d["id"]: d.get("label", d["id"]) for d in json.load(open(DIV_JSON))}
    except Exception:
        return {}
    out = {}
    for s in staff:
        out[s["id"]] = (
            "Kamu adalah %s, %s di %s (kantor AI KCSH). "
            "Jawab dalam Bahasa Indonesia yang santai dan singkat (maks 3 kalimat, "
            "kecuali diminta detail). Kamu membantu pekerjaan kantormu sesuai peranmu. "
            "Jangan pernah mengaku sebagai model AI lain; kamu adalah staf kantor KCSH."
            % (s.get("name", s["id"]), s.get("title", ""), divs.get(s.get("room"), "kantor"))
        )
    return out

PERSONAS = load_personas()
_tools_cache = {}  # app -> (ts, tools)

def chat_9router(system, messages, model):
    body = json.dumps({
        "model": model, "stream": False, "max_tokens": 600, "temperature": 0.7,
        "messages": [{"role": "system", "content": system}] +
                    [{"role": m.get("role", "user"), "content": str(m.get("content", ""))[:4000]}
                     for m in messages[-12:]],
    }).encode()
    req = _urlreq.Request(NINEROUTER_URL, data=body, headers={
        "Authorization": "Bearer " + ninerouter_key(),
        "Content-Type": "application/json"})
    with _urlreq.urlopen(req, timeout=120) as r:
        d = json.load(r)
    msg = d["choices"][0]["message"]
    content = msg.get("content", "")
    if isinstance(content, list):
        content = "".join(b.get("text", "") for b in content if isinstance(b, dict))
    return content or "(tidak ada jawaban)"

def mcp_tools(app):
    now = time.time()
    if app in _tools_cache and now - _tools_cache[app][0] < 3600:
        return _tools_cache[app][1]
    p = subprocess.run([VENV_PY, MCP_CLIENT, app, "list-tools"],
                       capture_output=True, text=True, timeout=90)
    if p.returncode != 0:
        raise RuntimeError("list-tools failed: " + p.stderr[-300:])
    tools = json.loads(p.stdout or "[]")
    slim = [{"name": t.get("name"), "description": (t.get("description") or "")[:200]}
            for t in tools]
    _tools_cache[app] = (now, slim)
    return slim

def mcp_call(app, name, arguments):
    p = subprocess.run([VENV_PY, MCP_CLIENT, app, "call-tool",
                        "--name", name, "--arguments", json.dumps(arguments or {})],
                       capture_output=True, text=True, timeout=180)
    if p.returncode != 0:
        raise RuntimeError("call-tool failed: " + p.stderr[-300:])
    try:
        return json.loads(p.stdout)
    except Exception:
        return {"raw": p.stdout[-2000:]}

class H(BaseHTTPRequestHandler):
    server_version = "kantor-bridge/1.0"

    def log_message(self, *a):
        pass

    def _send(self, code, obj):
        body = json.dumps(obj, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Authorization, Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send(200, {})

    def do_GET(self):
        if self.path == "/health":
            self._send(200, {"ok": True, "ts": int(time.time())})
        else:
            self._send(404, {"error": "not found"})

    def _body(self):
        try:
            n = int(self.headers.get("Content-Length", 0))
        except Exception:
            n = 0
        if n <= 0 or n > 1_000_000:
            return {}
        try:
            return json.loads(self.rfile.read(n) or b"{}")
        except Exception:
            return {}

    def _authed(self):
        return self.headers.get("Authorization", "") == "Bearer " + BRIDGE_TOKEN

    def do_POST(self):
        ip = self.client_address[0]
        if self.path == "/v1/chat":
            if not self._authed():
                return self._send(401, {"error": "unauthorized"})
            if not rate_ok(ip, "chat", 30):
                return self._send(429, {"error": "rate limited"})
            b = self._body()
            agent_id = str(b.get("agent_id", ""))[:40]
            system = PERSONAS.get(agent_id, "Kamu adalah staf AI kantor KCSH. Jawab Bahasa Indonesia, singkat.")
            model = str(b.get("model", ""))[:60] or "cc/claude-haiku-4-5-20251001"
            try:
                reply = chat_9router(system, b.get("messages", []), model)
                self._send(200, {"reply": reply})
            except Exception as e:
                self._send(502, {"error": "ai backend error: " + str(e)[:200]})
        elif self.path == "/v1/mcp/tools":
            if not self._authed():
                return self._send(401, {"error": "unauthorized"})
            app = str(self._body().get("app", ""))
            if app not in ALLOWED_APPS:
                return self._send(400, {"error": "unknown app"})
            try:
                self._send(200, {"tools": mcp_tools(app)})
            except Exception as e:
                self._send(502, {"error": str(e)[:200]})
        elif self.path == "/v1/mcp/call":
            if not self._authed():
                return self._send(401, {"error": "unauthorized"})
            if not rate_ok(ip, "mcp", 10):
                return self._send(429, {"error": "rate limited"})
            b = self._body()
            app, name = str(b.get("app", "")), str(b.get("name", ""))
            if app not in ALLOWED_APPS or not NAME_RE.match(name):
                return self._send(400, {"error": "bad app/tool name"})
            try:
                self._send(200, {"ok": True, "result": mcp_call(app, name, b.get("arguments", {}))})
            except Exception as e:
                self._send(502, {"error": str(e)[:200]})
        else:
            self._send(404, {"error": "not found"})

if __name__ == "__main__":
    srv = ThreadingHTTPServer(("127.0.0.1", PORT), H)
    print("kantor-bridge on 127.0.0.1:%d" % PORT, flush=True)
    srv.serve_forever()
