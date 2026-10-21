#!/bin/bash
# start-bridge.sh — jalankan kantor-bridge (API untuk chat agen + MCP ArtCraft).
export no_proxy="localhost,127.0.0.1"
export NO_PROXY="localhost,127.0.0.1"
cd "$HOME/workspace/kantor-bridge" || exit 1
exec python3 bridge.py
