#!/usr/bin/env bash
# PreToolUse guard for Edit|Write.
# - Blocks edits under manifest.protected.
# - Blocks edits to a file under append_only_dirs that already exists in HEAD.
# - Blocks a Write that re-emits a >=150-line file while changing <25% of its lines.
# Exit 2 with the reason blocks the tool call; exit 0 allows it.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
MANIFEST="$REPO_ROOT/.factory/manifest.json"

INPUT="$(cat)"

command -v jq >/dev/null 2>&1 || { echo "$INPUT"; exit 0; }

TOOL_NAME=$(echo "$INPUT" | jq -r '.tool_name // empty')
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

[ -z "$FILE_PATH" ] && exit 0
[ ! -f "$MANIFEST" ] && exit 0

# Path relative to repo root, for matching against the manifest's project-relative globs.
REL_PATH="${FILE_PATH#"$REPO_ROOT"/}"

# --- protected paths -------------------------------------------------------
PROTECTED=$(jq -r '.protected[]? // empty' "$MANIFEST")
while IFS= read -r p; do
  [ -z "$p" ] && continue
  if [ "$REL_PATH" = "$p" ]; then
    echo "BLOCKED: '$REL_PATH' is protected (.factory/manifest.json). Ask the owner to name the exact edit, or edit it by hand." >&2
    exit 2
  fi
done <<< "$PROTECTED"

# --- append-only dirs -------------------------------------------------------
APPEND_ONLY=$(jq -r '.append_only_dirs[]? // empty' "$MANIFEST")
while IFS= read -r dir; do
  [ -z "$dir" ] && continue
  case "$REL_PATH" in
    "$dir"/*)
      if git -C "$REPO_ROOT" cat-file -e "HEAD:$REL_PATH" 2>/dev/null; then
        echo "BLOCKED: '$REL_PATH' is under the append-only directory '$dir' and already exists in HEAD. Append a new file instead of editing history." >&2
        exit 2
      fi
      ;;
  esac
done <<< "$APPEND_ONLY"

# --- wasteful whole-file rewrite --------------------------------------------
if [ "$TOOL_NAME" = "Write" ] && [ -f "$FILE_PATH" ]; then
  OLD_LINES=$(wc -l < "$FILE_PATH" 2>/dev/null || echo 0)
  if [ "$OLD_LINES" -ge 150 ]; then
    NEW_CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // empty')
    if [ -n "$NEW_CONTENT" ]; then
      DIFF_LINES=$(diff <(printf '%s' "$NEW_CONTENT") "$FILE_PATH" 2>/dev/null | grep -c '^[<>]' || true)
      CHANGE_PCT=$(( (DIFF_LINES * 100) / (OLD_LINES + 1) ))
      if [ "$CHANGE_PCT" -lt 25 ]; then
        echo "BLOCKED: Write re-emits a $OLD_LINES-line file changing ~${CHANGE_PCT}% of it. Use Edit instead." >&2
        exit 2
      fi
    fi
  fi
fi

exit 0
