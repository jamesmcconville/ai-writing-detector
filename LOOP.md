# Automation Loop

The ROADMAP is completed by an **LLM agent** running inside OpenCode, not by a
standalone shell script. The agent drives each task end-to-end — writing real
specs, tests, and source code — using the `opsx-*` workflow commands and a thin
helper script for bookkeeping.

## How to Run

```bash
# Inside an OpenCode session, invoke the loop command:
/opsx-loop          # process all phases 0-9
/opsx-loop 2        # process only phase 2
/opsx-loop 3-5      # process phases 3 through 5
```

The agent will work autonomously through every pending task without prompting
between iterations. Interrupt at any time to pause; restarting `/opsx-loop`
picks up from the first unchecked task automatically.

## Architecture

```
┌──────────────────────────────────────────────────────┐
│  LLM Agent  (OpenCode)                               │
│                                                      │
│  /opsx-loop                                          │
│    ├── reads next task ──► scripts/roadmap-helper.sh │
│    ├── creates change  ──► openspec CLI              │
│    ├── writes artifacts     (proposal, specs,        │
│    │                         design, tasks)          │
│    ├── writes real tests                             │
│    ├── implements code                               │
│    ├── runs quality checks ► roadmap-helper.sh check │
│    ├── marks task done   ──► roadmap-helper.sh       │
│    ├── updates docs      ──► roadmap-helper.sh       │
│    ├── commits           ──► roadmap-helper.sh       │
│    ├── archives change   ──► openspec CLI            │
│    └── loops back to next task                       │
└──────────────────────────────────────────────────────┘
```

**The agent is the brain.** It reads requirements, designs solutions, writes
code, and fixes failing checks. The helper script and openspec CLI are tools it
calls — they handle structured data extraction and bookkeeping, not thinking.

## Per-Task Workflow

For each unchecked task in @ROADMAP:

```
1. Get next task           bash scripts/roadmap-helper.sh next-task [--phase N]
2. Create openspec change  openspec new change "<name>"
3. Fast-forward artifacts  Agent writes real proposal → specs → design → tasks
                           using openspec status/instructions to walk the graph
4. Create unit tests       Agent reads spec scenarios, writes real vitest tests
                           with actual assertions (test-first, before implementation)
5. Implement code          Agent writes source code, working against the tests
                           Follows existing project patterns in src/
6. Quality checks          bash scripts/roadmap-helper.sh check
                           Fix and re-run up to 3 times if checks fail
7. Mark task done          bash scripts/roadmap-helper.sh mark-done <task-id>
8. Update documentation    bash scripts/roadmap-helper.sh update-docs <id> <phase> <desc>
9. Commit                  bash scripts/roadmap-helper.sh commit <id> <desc>
10. Sync & archive         openspec archive "<name>" -y
```

## Components

### `/opsx-loop` — Agent Command

The primary command. Defined in `.opencode/command/opsx-loop.md`. Contains the
full instructions the LLM follows to iterate through the ROADMAP, including
when to pause, how to handle failures, and what "real content" means at each
step.

### `scripts/roadmap-helper.sh` — Bookkeeping Utility

A thin bash script the agent shell-calls for structured operations that don't
require reasoning:

| Subcommand | Purpose |
|---|---|
| `next-task [--phase N]` | Print the next pending task as `phase\|id\|desc` |
| `mark-done <id>` | Toggle `- [ ]` → `- [x]` in ROADMAP.md |
| `check` | Run lint, typecheck, test, build (skips missing scripts) |
| `commit <id> <desc>` | `git add -A && git commit` |
| `update-docs <id> <phase> <desc>` | Maintain CHANGELOG.md and README.md |
| `status [--phase N]` | Show per-phase progress table |
| `change-name <phase> <id>` | Generate consistent openspec change name |

### `opsx-*` Slash Commands — Workflow Knowledge

The existing `/opsx-ff`, `/opsx-apply`, `/opsx-archive`, etc. commands define
how to interact with openspec artifacts. The `/opsx-loop` command executes
their logic **inline** rather than invoking them as separate commands, so the
agent maintains context across the full task lifecycle.

## Recovery

The loop is **idempotent and resumable**:

- Completed tasks are already `[x]` in the ROADMAP — `next-task` skips them
- If an openspec change exists from a previous run, it is reused
- Existing test files are not overwritten
- Quality checks re-validate everything, catching partial implementations

## Requirements

- **OpenCode** with an LLM that supports tool use (for running shell commands)
- **openspec** CLI installed and on PATH
- **Node.js** / npm with project scripts: `lint`, `typecheck`, `test`, `build`
- **python3** (used by roadmap-helper.sh for markdown parsing)
- **git** (for atomic commits per task)
- @ROADMAP tasks in checklist format: `- [ ] 1.1 Task description [deps: ...] [deliverable: ...]`
