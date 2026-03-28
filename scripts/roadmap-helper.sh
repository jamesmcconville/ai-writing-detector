#!/usr/bin/env bash

set -euo pipefail

# ---------------------------------------------------------------------------
# roadmap-helper.sh
#
# Thin utility for LLM agents to query and update ROADMAP.md state.
# Designed to be called from within an agent-driven loop (opsx-loop).
#
# Subcommands:
#   next-task    Print the next pending task (optionally for a specific phase)
#   mark-done    Mark a task as complete in the ROADMAP
#   check        Run quality checks (lint, typecheck, test, build)
#   commit       Stage all changes and create an atomic commit
#   update-docs  Update CHANGELOG.md and README.md for a completed task
#   status       Show per-phase and overall progress summary
# ---------------------------------------------------------------------------

readonly ROADMAP_FILE="${ROADMAP_FILE:-ROADMAP.md}"

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

log()  { printf '[roadmap-helper] %s\n' "$*"; }
warn() { printf '[roadmap-helper] WARN: %s\n' "$*" >&2; }
fail() { printf '[roadmap-helper] ERROR: %s\n' "$*" >&2; exit 1; }

# ---------------------------------------------------------------------------
# Subcommand: next-task [--phase N]
#
# Prints the next unchecked task. Output format (pipe-delimited):
#   <phase>|<task_id>|<description>
#
# If --phase is given, restricts to that phase. Otherwise scans 0-9.
# Exits 0 with output if a task is found, exits 0 with "ROADMAP_COMPLETE"
# if no pending tasks remain.
# ---------------------------------------------------------------------------

cmd_next_task() {
  local phase_filter=""

  while (( $# > 0 )); do
    case "$1" in
      --phase)
        [[ $# -ge 2 ]] || fail "Missing value for --phase"
        phase_filter="$2"
        shift 2
        ;;
      *) fail "Unknown option for next-task: $1" ;;
    esac
  done

  [[ -f "$ROADMAP_FILE" ]] || fail "Roadmap file not found: $ROADMAP_FILE"

  ROADMAP="$ROADMAP_FILE" PHASE_FILTER="$phase_filter" python3 <<'PY'
import re, os, sys

roadmap_path = os.environ["ROADMAP"]
phase_filter = os.environ.get("PHASE_FILTER", "").strip()

with open(roadmap_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

phases_to_scan = range(0, 10)
if phase_filter:
    try:
        p = int(phase_filter)
        phases_to_scan = [p]
    except ValueError:
        print(f"Invalid phase: {phase_filter}", file=sys.stderr)
        sys.exit(1)

for phase in phases_to_scan:
    phase_header = re.compile(rf'^##\s+Phase\s+{phase}\b')
    next_header  = re.compile(r'^##\s+Phase\s+\d+\b')
    task_re      = re.compile(
        r'^\s*-\s*\[(?P<st>[ xX])\]\s*(?P<id>'
        + str(phase)
        + r'\.\d+)\s*(?P<desc>.*)$'
    )

    in_phase = False
    for raw in lines:
        line = raw.rstrip('\n')
        if phase_header.match(line):
            in_phase = True
            continue
        if in_phase and next_header.match(line) and not phase_header.match(line):
            break
        if not in_phase:
            continue
        m = task_re.match(line)
        if not m:
            continue
        if m.group('st').lower() == 'x':
            continue
        # Found a pending task
        print(f"{phase}|{m.group('id')}|{m.group('desc').strip()}")
        sys.exit(0)

print("ROADMAP_COMPLETE")
PY
}

# ---------------------------------------------------------------------------
# Subcommand: mark-done <task-id>
#
# Toggles a checklist item from [ ] to [x] in the ROADMAP.
# Prints: updated | already_done | missing
# ---------------------------------------------------------------------------

cmd_mark_done() {
  local task_id="${1:-}"
  [[ -n "$task_id" ]] || fail "Usage: roadmap-helper.sh mark-done <task-id>"
  [[ -f "$ROADMAP_FILE" ]] || fail "Roadmap file not found: $ROADMAP_FILE"

  ROADMAP="$ROADMAP_FILE" TASK_ID="$task_id" python3 <<'PY'
import re, os, sys

roadmap_path = os.environ["ROADMAP"]
task_id      = os.environ["TASK_ID"]

with open(roadmap_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

pattern = re.compile(
    r'^(\s*-\s*\[)(?P<status>[ xX])(\]\s*'
    + re.escape(task_id)
    + r'(?:\b|\.|\s).*)'
    + r'$'
)

updated = False
for idx, raw in enumerate(lines):
    line = raw.rstrip('\n')
    m = pattern.match(line)
    if not m:
        continue
    if m.group('status').lower() == 'x':
        print('already_done')
        sys.exit(0)
    lines[idx] = f"{m.group(1)}x{m.group(3)}\n"
    updated = True
    break

if not updated:
    print('missing')
    sys.exit(2)

with open(roadmap_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print('updated')
PY
}

# ---------------------------------------------------------------------------
# Subcommand: check
#
# Runs quality checks: lint, typecheck, test, build.
# Skips any npm script not defined in package.json.
# Exits 0 if all pass, 1 if any fail.
# ---------------------------------------------------------------------------

cmd_check() {
  [[ -f "package.json" ]] || { log "No package.json found; skipping quality checks"; return 0; }

  log "Running quality checks"
  local any_failed=0

  for script_name in lint typecheck test build; do
    if ! node -e "
      const p = require('./package.json');
      if (!p.scripts || !p.scripts['${script_name}']) process.exit(1);
    " 2>/dev/null; then
      log "  ⊘ npm run ${script_name} — not defined, skipping"
      continue
    fi

    if npm run "$script_name" --silent 2>&1; then
      log "  ✓ ${script_name} passed"
    else
      warn "  ✗ ${script_name} failed"
      any_failed=1
    fi
  done

  return $any_failed
}

# ---------------------------------------------------------------------------
# Subcommand: commit <task-id> <description...>
#
# Stages all changes (including untracked) and creates an atomic commit.
# If there are no changes, prints a message and exits 0.
# ---------------------------------------------------------------------------

cmd_commit() {
  local task_id="${1:-}"
  [[ -n "$task_id" ]] || fail "Usage: roadmap-helper.sh commit <task-id> <description...>"
  shift
  local desc="$*"
  [[ -n "$desc" ]] || desc="complete task ${task_id}"

  if git diff --quiet 2>/dev/null \
     && git diff --cached --quiet 2>/dev/null \
     && [[ -z "$(git ls-files --others --exclude-standard 2>/dev/null)" ]]; then
    log "No changes to commit for ${task_id}"
    return 0
  fi

  git add -A
  git commit -m "complete roadmap task ${task_id}: ${desc}"
  log "Committed: ${task_id} — ${desc}"
}

# ---------------------------------------------------------------------------
# Subcommand: update-docs <task-id> <phase> <description...>
#
# Appends an entry to CHANGELOG.md (creates it if missing) and ensures
# README.md references the ROADMAP for progress tracking.
# ---------------------------------------------------------------------------

cmd_update_docs() {
  local task_id="${1:-}"
  local phase="${2:-}"
  shift 2 2>/dev/null || true
  local desc="$*"

  [[ -n "$task_id" && -n "$phase" ]] || fail "Usage: roadmap-helper.sh update-docs <task-id> <phase> <description...>"

  local changelog="CHANGELOG.md"
  if [[ ! -f "$changelog" ]]; then
    printf '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n' > "$changelog"
    log "Created ${changelog}"
  fi

  local date_stamp
  date_stamp="$(date +%Y-%m-%d)"

  CLOG="$changelog" DATE="$date_stamp" TID="$task_id" TDESC="$desc" PHASE="$phase" \
    python3 <<'PY'
import os

clog  = os.environ["CLOG"]
date  = os.environ["DATE"]
tid   = os.environ["TID"]
tdesc = os.environ["TDESC"]
phase = os.environ["PHASE"]

with open(clog, "r", encoding="utf-8") as f:
    content = f.read()

entry = f"\n## [{date}] Phase {phase} — Task {tid}\n\n- {tdesc}\n"

parts = content.split("\n\n", 1)
if len(parts) == 2:
    new_content = parts[0] + "\n" + entry + "\n" + parts[1]
else:
    new_content = content + entry

with open(clog, "w", encoding="utf-8") as f:
    f.write(new_content)

print(f"[roadmap-helper] Updated {clog} with task {tid}")
PY

  if [[ -f "README.md" ]]; then
    if ! grep -q 'ROADMAP.md' README.md 2>/dev/null; then
      printf '\n## Progress\n\nSee [ROADMAP.md](ROADMAP.md) for implementation status.\n' >> README.md
      log "Added ROADMAP reference to README.md"
    fi
  fi
}

# ---------------------------------------------------------------------------
# Subcommand: status [--phase N]
#
# Shows per-phase progress. If --phase is given, shows only that phase.
# Output: one line per phase with counts, plus a summary total.
# ---------------------------------------------------------------------------

cmd_status() {
  local phase_filter=""

  while (( $# > 0 )); do
    case "$1" in
      --phase)
        [[ $# -ge 2 ]] || fail "Missing value for --phase"
        phase_filter="$2"
        shift 2
        ;;
      *) fail "Unknown option for status: $1" ;;
    esac
  done

  [[ -f "$ROADMAP_FILE" ]] || fail "Roadmap file not found: $ROADMAP_FILE"

  ROADMAP="$ROADMAP_FILE" PHASE_FILTER="$phase_filter" python3 <<'PY'
import re, os, sys

roadmap_path = os.environ["ROADMAP"]
phase_filter = os.environ.get("PHASE_FILTER", "").strip()

with open(roadmap_path, "r", encoding="utf-8") as f:
    text = f.read()

phases_to_scan = range(0, 10)
if phase_filter:
    try:
        phases_to_scan = [int(phase_filter)]
    except ValueError:
        print(f"Invalid phase: {phase_filter}", file=sys.stderr)
        sys.exit(1)

total_done  = 0
total_count = 0

print(f"{'Phase':<8} {'Done':>5} {'Total':>6} {'Remaining':>10}  Status")
print("-" * 52)

for phase in phases_to_scan:
    done  = len(re.findall(
        rf'^\s*-\s*\[[xX]\]\s*{phase}\.\d+',
        text, re.MULTILINE
    ))
    count = len(re.findall(
        rf'^\s*-\s*\[[ xX]\]\s*{phase}\.\d+',
        text, re.MULTILINE
    ))
    remaining = count - done
    total_done  += done
    total_count += count

    if count == 0:
        status = "—"
    elif done == count:
        status = "✓ complete"
    elif done == 0:
        status = "○ pending"
    else:
        status = "◐ in progress"

    print(f"  {phase:<6} {done:>5} {count:>6} {remaining:>10}  {status}")

print("-" * 52)
remaining_total = total_count - total_done
pct = (total_done / total_count * 100) if total_count else 0
print(f"  {'Total':<6} {total_done:>5} {total_count:>6} {remaining_total:>10}  {pct:.0f}% complete")

if total_done == total_count and total_count > 0:
    print("\n🎉 ROADMAP is fully complete!")
PY
}

# ---------------------------------------------------------------------------
# Subcommand: change-name <phase> <task-id>
#
# Generates a consistent kebab-case change name for a task.
# Used by the agent to derive the openspec change name.
# ---------------------------------------------------------------------------

cmd_change_name() {
  local phase="${1:-}"
  local task_id="${2:-}"
  [[ -n "$phase" && -n "$task_id" ]] || fail "Usage: roadmap-helper.sh change-name <phase> <task-id>"

  # Convert 0.1 → 0-1
  local safe_id="${task_id//./-}"
  echo "roadmap-phase-${phase}-task-${safe_id}"
}

# ---------------------------------------------------------------------------
# Dispatch
# ---------------------------------------------------------------------------

show_usage() {
  cat <<'EOF'
Usage: scripts/roadmap-helper.sh <subcommand> [args...]

Subcommands:
  next-task [--phase N]                     Print next pending task (phase|id|desc)
  mark-done <task-id>                       Mark task complete in ROADMAP.md
  check                                     Run quality checks (lint, typecheck, test, build)
  commit <task-id> <description...>         Stage and commit all changes
  update-docs <task-id> <phase> <desc...>   Update CHANGELOG.md and README.md
  status [--phase N]                        Show per-phase progress summary
  change-name <phase> <task-id>             Generate openspec change name for a task

Environment:
  ROADMAP_FILE    Path to roadmap file (default: ROADMAP.md)

EOF
}

main() {
  local subcmd="${1:-}"
  [[ -n "$subcmd" ]] || { show_usage; exit 1; }
  shift

  case "$subcmd" in
    next-task)    cmd_next_task "$@" ;;
    mark-done)    cmd_mark_done "$@" ;;
    check)        cmd_check "$@" ;;
    commit)       cmd_commit "$@" ;;
    update-docs)  cmd_update_docs "$@" ;;
    status)       cmd_status "$@" ;;
    change-name)  cmd_change_name "$@" ;;
    --help|-h)    show_usage ;;
    *)            fail "Unknown subcommand: $subcmd. Run with --help for usage." ;;
  esac
}

main "$@"
