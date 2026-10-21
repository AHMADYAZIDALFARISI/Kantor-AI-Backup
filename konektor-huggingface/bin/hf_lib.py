"""Helper bersama konektor Hugging Face: ambil surrogate kredensial dari authd.

Token asli TIDAK pernah dibaca kode ini — yang beredar hanya surrogate
`hsurr:*`, ditukar runtime menjadi kredensial asli pada permintaan yang
menuju host terdaftar (huggingface.co, tencentarc-instantmesh.hf.space).
"""
import sys

sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import dynamic_credential_entry  # noqa: E402


def hf_surrogate() -> str:
    entry = dynamic_credential_entry("custom.huggingface", "access_token")
    return str(entry["surrogate"]).strip()
