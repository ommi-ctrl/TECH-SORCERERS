#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
cd "$ROOT_DIR"

if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi

for candidate in \
  /usr/local/bin/node \
  /usr/bin/node \
  /opt/node/bin/node \
  /Users/$(whoami)/tools/node-v22/node-v22.23.3-win-x64/node \
  "$HOME"/tools/node-v22/node-v22.23.3-win-x64/node; do
  if [ -x "$candidate" ]; then
    export PATH="$(dirname "$candidate"):$PATH"
    break
  fi
done

if command -v node >/dev/null 2>&1; then
  npm run dev -- --host 0.0.0.0 --port 8080 >/tmp/veilbound-dev.log 2>&1 &
  exit 0
fi

echo "Node runtime not found for startup" >&2
exit 1
