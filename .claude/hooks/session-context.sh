#!/usr/bin/env bash
# SessionStart(compact|resume). Prints the open change artifact and its
# size, files changed on the branch, matching .claude/rules/*.md, and the
# invariant reminders that map to those paths. Replaces "re-read X" prose.
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

echo "## Factory session context"

LATEST_CHANGE=$(ls -t .factory/changes/*.md 2>/dev/null | grep -v TEMPLATE.md | head -1 || true)
if [ -n "$LATEST_CHANGE" ]; then
  LINES=$(wc -l < "$LATEST_CHANGE")
  echo "- Open change artifact: $LATEST_CHANGE ($LINES lines)"
else
  echo "- No change artifact yet."
fi

DEFAULT_BRANCH=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@')
[ -z "$DEFAULT_BRANCH" ] && DEFAULT_BRANCH="main"
CHANGED_FILES=$(git diff --name-only "origin/$DEFAULT_BRANCH"...HEAD 2>/dev/null || true)
if [ -n "$CHANGED_FILES" ]; then
  echo "- Files changed on this branch:"
  echo "$CHANGED_FILES" | sed 's/^/  - /'
else
  echo "- No files changed on this branch yet (or default branch unknown)."
fi

if [ -d .claude/rules ] && [ -n "$(ls -A .claude/rules 2>/dev/null)" ] && [ -n "$CHANGED_FILES" ]; then
  echo "- Matching rule files:"
  for rule in .claude/rules/*.md; do
    [ -f "$rule" ] || continue
    PATTERNS=$(sed -n 's/^paths:[[:space:]]*//p' "$rule")
    [ -z "$PATTERNS" ] && continue
    while IFS= read -r f; do
      for pat in $PATTERNS; do
        case "$f" in
          $pat) echo "  - $rule (matches $f)"; break ;;
        esac
      done
    done <<< "$CHANGED_FILES"
  done
fi

echo "- Invariants: see CLAUDE.md § Invariants (no-mechanical-check items only)."
