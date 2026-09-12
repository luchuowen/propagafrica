#!/usr/bin/env bash
# gates | quick | full — the one command a contributor and CI both run.
# gates: manifest text gates + context caps (~1s).
# quick: gates + incremental typecheck.
# full:  quick + lint + format + unit tests + e2e tests + build + guard self-test.
set -uo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

MODE="${1:-full}"
MANIFEST=".factory/manifest.json"
FAIL=0

fail() {
  echo "FAIL: $1" >&2
  FAIL=1
}

pass() {
  echo "ok: $1"
}

run_gates() {
  echo "--- gates ---"

  if ! command -v jq >/dev/null 2>&1; then
    fail "jq is required to read $MANIFEST"
    return
  fi

  local gate_count
  gate_count=$(jq '.gates | length' "$MANIFEST")
  for ((i = 0; i < gate_count; i++)); do
    local name pattern paths exclude ci
    name=$(jq -r ".gates[$i].name" "$MANIFEST")
    pattern=$(jq -r ".gates[$i].pattern" "$MANIFEST")
    ci=$(jq -r ".gates[$i].case_insensitive // false" "$MANIFEST")
    mapfile -t paths < <(jq -r ".gates[$i].paths[]" "$MANIFEST")
    mapfile -t exclude < <(jq -r ".gates[$i].exclude[]? // empty" "$MANIFEST")

    local grep_flags=(-rEn)
    [ "$ci" = "true" ] && grep_flags+=(-i)

    local exclude_args=()
    for ex in "${exclude[@]}"; do
      [ -n "$ex" ] && exclude_args+=(--exclude="$ex" --exclude-dir="$ex")
    done

    local hits=""
    for glob in "${paths[@]}"; do
      # shellcheck disable=SC2086
      local found
      found=$(compgen -G "$glob" || true)
      [ -z "$found" ] && continue
      while IFS= read -r f; do
        [ -z "$f" ] && continue
        local skip=0
        for ex in "${exclude[@]}"; do
          [ -n "$ex" ] && [[ "$f" == *"$ex"* ]] && skip=1
        done
        [ "$skip" = 1 ] && continue
        local m
        m=$(grep "${grep_flags[@]}" "$pattern" "$f" 2>/dev/null || true)
        [ -n "$m" ] && hits+="$f: $m"$'\n'
      done <<< "$found"
    done

    if [ -n "$hits" ]; then
      fail "gate '$name' — $(jq -r ".gates[$i].description" "$MANIFEST")"
      echo "$hits" | sed 's/^/    /' >&2
    else
      pass "gate '$name'"
    fi
  done

  # Context caps
  local cap_count
  cap_count=$(jq -r '.caps | to_entries | length' "$MANIFEST")
  for ((i = 0; i < cap_count; i++)); do
    local file cap
    file=$(jq -r ".caps | to_entries[$i].key" "$MANIFEST")
    cap=$(jq -r ".caps | to_entries[$i].value" "$MANIFEST")
    if [ -f "$file" ]; then
      local lines
      lines=$(wc -l < "$file")
      if [ "$lines" -gt "$cap" ]; then
        fail "cap '$file' is $lines lines, over the $cap-line budget — compact into .factory/history/"
      else
        pass "cap '$file' ($lines/$cap lines)"
      fi
    fi
  done
}

run_quick() {
  run_gates
  echo "--- typecheck ---"
  if pnpm exec astro check; then
    pass "astro check"
  else
    fail "astro check"
  fi
}

run_full() {
  run_quick

  echo "--- lint ---"
  if pnpm exec eslint .; then
    pass "eslint"
  else
    fail "eslint"
  fi

  echo "--- format ---"
  if pnpm exec prettier --check .; then
    pass "prettier"
  else
    fail "prettier"
  fi

  echo "--- unit tests ---"
  if pnpm exec vitest run; then
    pass "vitest"
  else
    fail "vitest"
  fi

  echo "--- build ---"
  if pnpm exec astro build; then
    pass "astro build"
  else
    fail "astro build"
  fi

  echo "--- e2e ---"
  if pnpm exec playwright test; then
    pass "playwright"
  else
    fail "playwright"
  fi

  echo "--- lighthouse ---"
  if node scripts/lighthouse.mjs; then
    pass "lighthouse"
  else
    fail "lighthouse"
  fi
}

case "$MODE" in
  gates) run_gates ;;
  quick) run_quick ;;
  full) run_full ;;
  *)
    echo "usage: $0 [gates|quick|full]" >&2
    exit 64
    ;;
esac

if [ "$FAIL" -ne 0 ]; then
  echo "=== factory-check $MODE: RED ==="
  exit 1
fi
echo "=== factory-check $MODE: GREEN ==="
