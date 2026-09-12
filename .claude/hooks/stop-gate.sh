#!/usr/bin/env bash
# Stop hook. If tracked source changed since the last green run, run
# `factory-check quick` and block (exit 2) on failure. Skips instantly on an
# unchanged tree, and honours stop_hook_active to avoid loops.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

INPUT="$(cat || true)"
if command -v jq >/dev/null 2>&1; then
  STOP_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false' 2>/dev/null || echo false)
  [ "$STOP_ACTIVE" = "true" ] && exit 0
fi

STATE_FILE="$REPO_ROOT/.factory/.stop-gate-state"

# Fingerprint of tracked source (committed + working tree) so a no-op turn
# never re-runs the gate.
FINGERPRINT=$(
  {
    git diff HEAD -- src astro.config.mjs tsconfig.json package.json 2>/dev/null
    git status --porcelain -- src astro.config.mjs tsconfig.json package.json 2>/dev/null
  } | git hash-object --stdin 2>/dev/null || echo "no-git"
)

LAST_GOOD=""
[ -f "$STATE_FILE" ] && LAST_GOOD=$(cat "$STATE_FILE")

if [ "$FINGERPRINT" = "$LAST_GOOD" ]; then
  exit 0
fi

OUTPUT=$(bash scripts/factory-check.sh quick 2>&1) && STATUS=0 || STATUS=$?

if [ "$STATUS" -ne 0 ]; then
  echo "$OUTPUT" >&2
  echo "STOP GATE: factory-check quick failed. Fix before stopping." >&2
  exit 2
fi

echo "$FINGERPRINT" > "$STATE_FILE"
exit 0
