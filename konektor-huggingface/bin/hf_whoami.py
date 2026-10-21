"""Verifikasi kredensial Hugging Face: GET /api/whoami-v2 dengan surrogate.

Usage: python3 hf_whoami.py  -> mencetak nama akun + tipe token (tanpa rahasia).
"""
import json
import sys
import urllib.request

sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request, read_json_response  # noqa: E402


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        raise RuntimeError("redirect refused, verify the endpoint")


def main():
    req = urllib.request.Request("https://huggingface.co/api/whoami-v2")
    add_surrogate_to_request(req, "custom.huggingface", allowed_hosts=["huggingface.co"])
    with urllib.request.build_opener(NoRedirect()).open(req, timeout=30) as resp:
        d = read_json_response(resp)
    print(json.dumps({
        "name": d.get("name"),
        "type": d.get("type"),
        "token_role": (d.get("auth") or {}).get("accessToken", {}).get("role"),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
