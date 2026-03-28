---
description: Automatically loop through all ROADMAP phases, completing each task using the opsx workflow
---

Drive the full ROADMAP automation loop — iterate through every pending task across all phases, using the opsx workflow to spec, implement, test, and archive each one.

**Input**: Optional arguments after `/opsx-loop`:
- A phase number (e.g., `/opsx-loop 2`) to process only that phase
- A phase range (e.g., `/opsx-loop 3-5`) to process phases 3 through 5
- No argument to process all phases 0–9

**Prerequisites**

Before starting, verify the environment is ready:

```bash
# Confirm helper script exists and is executable
ls -la scripts/roadmap-helper.sh

# Confirm openspec CLI is available
openspec --version

# Show current roadmap progress
bash scripts/roadmap-helper.sh status
```

If any prerequisite fails, inform the user and stop.

**Steps**

1. **Show current progress and confirm**

   Run:
   ```bash
   bash scripts/roadmap-helper.sh status
   ```

   Display the progress table. Then announce:
   > "Starting ROADMAP automation loop for phase(s) X–Y. I'll work through each pending task using the full opsx workflow. I won't prompt for confirmation between tasks — interrupt me anytime if you want to pause."

2. **Enter the main loop**

   This is the core loop. Repeat until the helper reports `ROADMAP_COMPLETE`:

   ---

   **2a. Get the next pending task**

   ```bash
   bash scripts/roadmap-helper.sh next-task
   ```
   Or, if a phase filter was provided:
   ```bash
   bash scripts/roadmap-helper.sh next-task --phase <N>
   ```

   The output format is: `<phase>|<task_id>|<description>`

   If the output is `ROADMAP_COMPLETE`, go to step 3.

   Parse the three fields. Generate the change name:
   ```bash
   bash scripts/roadmap-helper.sh change-name <phase> <task_id>
   ```

   Announce: `"── Task <task_id>: <description> ──"`

   ---

   **2b. Create a new openspec change**

   ```bash
   openspec new change "<change_name>" --description "Phase <phase> task <task_id>: <description>"
   ```

   If the change already exists (e.g., from a previous interrupted run), reuse it.

   ---

   **2c. Fast-forward through all artifacts**

   Follow the `/opsx-ff` workflow **inline** (do NOT literally invoke `/opsx-ff` — execute its logic directly):

   i. Get the artifact build order:
      ```bash
      openspec status --change "<change_name>" --json
      ```

   ii. Loop through artifacts in dependency order. For each artifact with `status: "ready"`:
      - Get instructions:
        ```bash
        openspec instructions <artifact-id> --change "<change_name>" --json
        ```
      - Read any completed dependency files for context
      - **Write the artifact with real, thoughtful content** based on the task description, the ROADMAP context, and any dependency artifacts:
        - **proposal**: Explain why this task matters, what changes, which capabilities are affected. Reference the ROADMAP task ID and phase goal.
        - **specs**: Write real requirements with concrete scenarios (WHEN/THEN) derived from the task description and REQUIREMENTS.md. Each scenario should be testable.
        - **design**: Document the technical approach, file structure, key decisions. Reference existing code patterns in the project.
        - **tasks**: Break the work into concrete implementation subtasks with checkboxes.
      - Write to the `outputPath` from instructions
      - Show brief progress: `"✓ Created <artifact-id>"`

   iii. After each artifact, re-check:
      ```bash
      openspec status --change "<change_name>" --json
      ```
      Continue until all `applyRequires` artifacts have `status: "done"`.

   ---

   **2d. Create unit tests from spec scenarios**

   Read the specs you just created at `openspec/changes/<change_name>/specs/*/spec.md`.

   For each scenario found (lines matching `#### Scenario: ...`):
   - Create a **real test file** under `tests/` in the appropriate subdirectory
   - Import from the deliverable path listed in the ROADMAP task (the `[deliverable: ...]` tag)
   - Write actual test assertions that validate the scenario — not just `expect(true).toBe(true)` placeholders
   - Use `vitest` (`describe`, `it`, `expect`) as the test framework

   If the deliverable module doesn't exist yet, that's fine — the tests will fail until implementation. That's the point: test-first.

   Show: `"✓ Created N test(s) for <task_id>"`

   ---

   **2e. Implement the task**

   Follow the `/opsx-apply` workflow **inline** (do NOT literally invoke `/opsx-apply`):

   i. Get apply instructions:
      ```bash
      openspec instructions apply --change "<change_name>" --json
      ```

   ii. Read all context files listed in `contextFiles`.

   iii. For each pending subtask in the tasks artifact:
      - Implement the code changes
      - Keep changes focused and minimal
      - Follow existing project patterns (check similar files in the same directory)
      - Mark the subtask complete in the tasks file: `- [ ]` → `- [x]`
      - Show progress: `"✓ Subtask complete: <subtask description>"`

   iv. After all subtasks are done, run quality checks:
      ```bash
      bash scripts/roadmap-helper.sh check
      ```

   v. **If quality checks fail**:
      - Read the error output carefully
      - Fix the issues (lint errors, type errors, failing tests, build errors)
      - Re-run `bash scripts/roadmap-helper.sh check`
      - Repeat up to 3 fix-and-recheck cycles
      - If still failing after 3 cycles, report the remaining errors and **continue to the next step anyway** — don't get stuck on one task forever

   vi. **If quality checks pass**: Show `"✓ Quality checks passed for <task_id>"`

   ---

   **2f. Mark task complete in ROADMAP**

   ```bash
   bash scripts/roadmap-helper.sh mark-done <task_id>
   ```

   Verify the output is `updated`. If `missing`, warn but continue.

   ---

   **2g. Update documentation**

   ```bash
   bash scripts/roadmap-helper.sh update-docs <task_id> <phase> <description>
   ```

   ---

   **2h. Commit all changes**

   ```bash
   bash scripts/roadmap-helper.sh commit <task_id> <description>
   ```

   ---

   **2i. Archive the change**

   Follow the `/opsx-archive` workflow **inline**:

   i. Check for delta specs at `openspec/changes/<change_name>/specs/`. If they exist, sync them to main specs by reading each delta spec and applying changes (adds/modifications/removals) to the corresponding main spec at `openspec/specs/<capability>/spec.md`.

   ii. Archive:
      ```bash
      openspec archive "<change_name>" -y
      ```
      If archive fails, warn but continue — don't let archive issues block the loop.

   Show: `"✓ Archived <change_name>"`

   ---

   **2j. Show task summary and loop back**

   ```bash
   bash scripts/roadmap-helper.sh status
   ```

   Show a brief one-line summary: `"✓ <task_id> complete — N/M total tasks done (X%)"`

   **Go back to step 2a.**

   ---

3. **Loop complete**

   When `next-task` returns `ROADMAP_COMPLETE` (or all tasks in the filtered phase range are done):

   ```bash
   bash scripts/roadmap-helper.sh status
   ```

   Display the final progress table and announce:

   ```
   ## ROADMAP Loop Complete

   **Phases processed:** X–Y
   **Tasks completed this session:** N
   **Overall progress:** M/T tasks (Z%)

   All pending tasks have been processed. Run `bash scripts/roadmap-helper.sh status` to review.
   ```

**Guardrails**

- **Do NOT prompt the user between tasks.** The whole point of this command is autonomous execution. Only pause if:
  - A task is critically ambiguous and you genuinely cannot determine what to implement
  - The same quality check failure persists after 3 fix attempts across 2 consecutive tasks (suggests a systemic issue)
  - A fundamental tool is broken (openspec CLI errors, git errors, missing node_modules)

- **Do NOT use placeholder content.** Every artifact, test, and implementation must contain real, functional code. Read existing source files to understand project patterns before writing new code.

- **Do NOT skip the test-creation step.** Tests must exist before implementation begins (step 2d before 2e). The tests can initially fail — that's expected.

- **Keep momentum.** If a minor issue arises (archive fails, a non-critical quality check warns), log it and move on. Don't block the entire loop on edge cases.

- **Respect existing work.** If a change already exists from a previous interrupted run, reuse it. If tests already exist, don't overwrite them. If code already exists for a task, verify it passes checks and mark done.

- **Reference REQUIREMENTS.md and ROADMAP.md** when writing specs and proposals. These are the source of truth for what the project should do.

- **Read existing source code** before implementing. Check `src/` for patterns, naming conventions, module structure. New code should be consistent.

**Recovery From Interruption**

If `/opsx-loop` is interrupted and restarted:
- `next-task` automatically picks up from the first unchecked task (completed tasks are already marked `[x]`)
- If an openspec change exists for the current task, it will be reused (step 2b handles this)
- Quality checks re-validate everything, so partial implementations are caught

**Output Style**

Keep output concise during the loop. Use this pattern per task:

```
── Task 2.3: Implement phrase detector (multi-word) ──
  ✓ Created proposal
  ✓ Created specs/vocabulary/spec.md (3 scenarios)
  ✓ Created design
  ✓ Created tasks (4 subtasks)
  ✓ Created 3 tests for 2.3
  ✓ Subtask 1/4: Create multi-word phrase patterns
  ✓ Subtask 2/4: Implement sliding window matcher
  ✓ Subtask 3/4: Add phrase boundary detection
  ✓ Subtask 4/4: Export public API
  ✓ Quality checks passed
  ✓ Committed: complete roadmap task 2.3
  ✓ Archived roadmap-phase-2-task-2-3
  ✓ 2.3 complete — 18/79 total tasks done (23%)
```
