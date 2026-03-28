# Loop Enhancements: Token Reduction & Drift Prevention

Analysis of `/opsx-loop` command efficiency and recommendations for reducing
token consumption and preventing LLM drift over long-running ROADMAP automation.

---

## Current Token Profile Per Phase

For a single phase (e.g., Phase 2 with 5 tasks), the LLM's context accumulates:

| Content | Tokens (est.) |
|---|---|
| `opsx-loop.md` system instruction | ~3,500 |
| Other `opsx-*` commands in system context | ~4,000 |
| `ROADMAP.md` full read | ~4,000 |
| `REQUIREMENTS.md` full read | ~1,200 |
| `openspec status --json` output (×5 calls) | ~2,500 |
| `openspec instructions --json` output (×4 artifacts) | ~4,000 |
| Writing 4 artifact files | ~4,000 |
| Reading artifact files back as context | ~4,000 |
| Writing test files | ~2,000 |
| Implementing 5 tasks (source code) | ~5,000 |
| Quality check output | ~500 |
| Helper script calls + output | ~1,000 |
| **Total per phase** | **~35,000–40,000** |

By phase 4–5, conversation history from earlier phases pushes past ~150k tokens,
causing the LLM to lose track of the protocol. This is where drift starts.

---

## Problem 1: Redundant Instruction Duplication

The `opsx-loop.md` (352 lines) **re-explains** logic that already exists in the
other opsx command files:

- Step 2d re-explains `opsx-ff.md` (97 lines) — artifact creation workflow
- Step 2f re-explains `opsx-apply.md` (130 lines) — task implementation workflow
- Step 2i re-explains `opsx-archive.md` (155 lines) and `opsx-sync.md` (120 lines)

The loop says "follow the `/opsx-ff` workflow **inline**" then proceeds to
restate the steps. Since the LLM also has the other `opsx-*` files loaded as
available commands in its system context, the artifact creation logic exists
**twice** in context.

**Estimated waste**: ~200 lines of duplicated instruction content per iteration.

## Problem 2: Full ROADMAP.md Read Every Phase

Step 2b instructs the agent to read `ROADMAP.md` directly for phase context.
The LLM reads the entire 409-line file but only needs the ~20 lines for the
current phase. The helper script already extracts structured task data — it
should also extract the phase goal and metadata.

**Estimated waste**: ~380 lines of irrelevant ROADMAP content per phase.

## Problem 3: REQUIREMENTS.md Read Every Phase

Step 2d says to "reference REQUIREMENTS.md" when writing specs. The LLM
re-reads the full 121-line file each phase, but only the section matching the
current phase's Step is relevant.

**Estimated waste**: ~100 lines per phase.

## Problem 4: Context Window Accumulation → Drift Risk

After 4–5 phases, the conversation history accumulates 150k+ tokens. The LLM
starts exhibiting drift behaviors:

- Forgetting to call `mark-done` after each task
- Skipping the test-creation step
- Creating per-task changes instead of per-phase
- Writing increasingly shallow artifacts as it "rushes" through later phases
- Losing track of which step in the protocol it's on

## Problem 5: No Re-Anchoring Between Phases

Once the loop starts, there's no mechanism to remind the LLM of the protocol.
The system instruction is read once at the beginning, and by phase 4+ it's
buried under thousands of tokens of conversation history.

## Problem 6: Verbose Output Eats Tokens

The output style section encourages detailed per-task logging (~20 lines per
phase). Every output line is generated tokens that eat into the context window
with no value for subsequent reasoning.

---

## Recommended Enhancements

### Enhancement 1: Don't Inline the opsx Workflows — Delegate Them

Instead of re-explaining the `opsx-ff`, `opsx-apply`, `opsx-archive` logic
inside `opsx-loop.md`, the loop should invoke them by reference. Replace step
2d's 40 lines with:

```
### 2d. Fast-forward artifacts
Execute the `/opsx-ff` workflow for change `<change_name>`.
Artifacts must cover ALL tasks in the phase — not a single task.
Reference the phase goal and full task list when writing each artifact.
```

This cuts ~150 lines from the command and avoids conflicting with the canonical
opsx command definitions.

### Enhancement 2: Add a `phase-context` Helper Subcommand

Instead of having the LLM read the full ROADMAP and REQUIREMENTS, add a helper
subcommand that extracts just the relevant section:

```bash
# New subcommand: phase-context --phase N
# Output:
#   Phase goal, all tasks with deps/deliverables,
#   parallel groups, and the matching REQUIREMENTS.md section
#   (~20-40 lines instead of ~530)
bash scripts/roadmap-helper.sh phase-context --phase 2
```

This keeps the LLM focused on only the content it needs, reducing per-phase
input by ~3,500 tokens.

### Enhancement 3: Add a Step-Summary Checkpoint Between Phases

After each phase completes, emit a compact **re-anchoring block** that reminds
the LLM of the protocol before it starts the next phase:

```
### Phase checkpoint — confirm before proceeding:
- [ ] Will create ONE openspec change for the entire phase
- [ ] Will use `phase-tasks` to get ALL pending tasks
- [ ] Will write artifacts covering the WHOLE phase
- [ ] Will create tests BEFORE implementing
- [ ] Will mark each task done individually with `mark-done`
- [ ] Will run quality checks AFTER all tasks are implemented
- [ ] Will commit once and archive once for the phase
```

This costs ~10 tokens but dramatically reduces drift over long runs by keeping
the critical rules in the LLM's recent attention window.

### Enhancement 4: Minimize Output Verbosity

Replace the detailed per-task output example with single-line progress. Instead
of the current 20-line example block, use:

```
Phase 2: 5 tasks | artifacts ✓ | tests ✓ | 2.1 ✓ 2.2 ✓ 2.3 ✓ 2.4 ✓ 2.5 ✓ | checks ✓ | committed | archived
  Overall: 16/79 (20%)
```

This reduces generated output tokens per phase and keeps the context window
cleaner for reasoning about actual code.

### Enhancement 5: Per-Phase Session Boundaries

The biggest drift mitigation: start a **fresh agent session per phase**. The
`opsx-loop` command would:

1. Call `next-phase` to find the phase
2. Spawn a sub-agent (or restart the session) with only the phase-specific context
3. The sub-agent runs one phase, commits, archives
4. Control returns to the outer loop, which continues to the next phase

This caps context growth at one phase instead of accumulating all phases. The
conversation history from Phase 1 never pollutes the context when working on
Phase 5.

This depends on whether OpenCode supports spawning sub-sessions from a command.
If not, an alternative is to instruct the user to run `/opsx-loop <N>` for each
phase sequentially, or to have the loop explicitly state "Phase N complete.
Starting fresh context for Phase N+1." as a signal.

### Enhancement 6: Move Guardrails to a Compact Checklist at the Top

The current guardrails section is 25 lines at the bottom of a 352-line file. By
the time the LLM is mid-implementation, it's outside the attention window. Move
the most critical rules to a 5-line block at the top, right after the
description:

```
**CRITICAL RULES (never violate):**
1. ONE openspec change per phase — never per task
2. Tests BEFORE implementation — never skip
3. Mark each task done individually — never batch at the end
4. Artifacts describe the WHOLE phase — never a single task
5. Do NOT prompt the user — work autonomously
```

The detailed guardrails section can remain at the bottom as supplementary
context, but the compact version at the top ensures the rules stay in the
attention window throughout the run.

---

## Impact Estimate

| Enhancement | Token Savings Per Phase | Drift Reduction |
|---|---|---|
| 1. Don't inline opsx workflows | ~1,500 | Removes conflicting instructions |
| 2. `phase-context` helper | ~3,500 | LLM reads only relevant content |
| 3. Re-anchoring checkpoint | +100 (cost) | High — prevents protocol forgetting |
| 4. Compact output | ~500–1,000 | Less noise in context window |
| 5. Per-phase session boundaries | ~20,000+ (cumulative) | Eliminates multi-phase drift entirely |
| 6. Guardrails at top | 0 (reorganization) | Keeps rules in attention window |

The combination of enhancements 1–4 would cut per-phase token usage by roughly
**40%** and significantly reduce drift risk. Enhancement 5 (per-phase sessions)
would eliminate drift as a concern entirely but depends on OpenCode capabilities.

---

## Implementation Priority

1. **Enhancement 6** (guardrails at top) — zero cost, immediate drift reduction
2. **Enhancement 3** (re-anchoring checkpoint) — minimal cost, high drift reduction
3. **Enhancement 2** (`phase-context` helper) — moderate effort, large token savings
4. **Enhancement 1** (delegate opsx workflows) — moderate effort, removes duplication
5. **Enhancement 4** (compact output) — trivial change, moderate savings
6. **Enhancement 5** (per-phase sessions) — depends on OpenCode support, highest impact