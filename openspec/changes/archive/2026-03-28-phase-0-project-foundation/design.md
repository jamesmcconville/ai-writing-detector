## Context

The project currently has requirements and a roadmap but no implementation baseline for development tooling and repository structure. Phase 0 in `ROADMAP.md` defines six foundational tasks (0.1–0.6): Node project initialization, strict TypeScript configuration, testing setup, core directory structure, lint/format setup, and sample corpus preparation. This design translates those tasks into an execution-ready structure that minimizes ambiguity before coding begins.

## Goals / Non-Goals

**Goals:**
- Define an implementation approach that keeps foundation work constrained to Phase 0 tasks only.
- Ensure configuration choices are compatible with a TypeScript/Node CLI architecture and future detector/analyzer modules.
- Establish verification expectations (typecheck, lint, tests, and build readiness) as part of foundation setup.
- Preserve dependency ordering where needed (e.g., testing framework setup after `package.json` exists).

**Non-Goals:**
- Implement any Phase 1+ runtime features (CLI behavior, detectors, analyzers, scoring, reports).
- Add optional advanced tooling beyond baseline lint/format/test setup.
- Define production deployment, release, or archive workflows.

## Decisions

1. **Single capability boundary (`project-foundation`) for all Phase 0 work**  
   - **Why:** Phase 0 tasks form one cohesive baseline and are easier to implement/verify as one capability with multiple requirements.  
   - **Alternative considered:** Separate capabilities per task (e.g., `typescript-config`, `linting`). Rejected due to unnecessary fragmentation for a tightly-coupled setup phase.

2. **Normative requirements map directly to roadmap task IDs (0.1–0.6)**  
   - **Why:** Preserves traceability from roadmap to spec/tests and reduces interpretation drift during implementation.  
   - **Alternative considered:** Outcome-only requirements without task ID mapping. Rejected because it weakens traceability for this early-stage pilot.

3. **Treat sample text preparation as structural corpus readiness, not detector content curation**  
   - **Why:** Phase 0 should establish input assets and folder contracts only; quality tuning of sample content belongs to later analysis phases.  
   - **Alternative considered:** Include sample annotation/labeling rules now. Rejected as scope creep beyond foundation.

4. **Enforce strict scope gate in tasks artifact**  
   - **Why:** Prevents premature coding in `src/` and `tests/` for non-foundation features while still allowing foundational scaffolding files.  
   - **Alternative considered:** Open-ended setup checklist. Rejected because this risks accidental Phase 1+ implementation.

## Risks / Trade-offs

- **[Risk] Ambiguity between “create structure” and “implement features” in `src/` and `tests/`** → **Mitigation:** Tasks explicitly distinguish scaffolding/config from feature logic and keep scope tied to 0.1–0.6 deliverables.
- **[Risk] Tooling choice drift (e.g., Vitest vs Jest) can cause inconsistent scripts/config** → **Mitigation:** Require one selected framework to be fully wired with passing sample test and matching npm scripts.
- **[Risk] Overly strict early defaults may increase initial setup friction** → **Mitigation:** Keep strict TypeScript and linting baseline minimal but functional; defer advanced rule tuning to later phases.
- **[Risk] Sample corpus incompleteness undermines future detector testing** → **Mitigation:** Require both `samples/ai-generated/` and `samples/human-written/` populated with 3–5 texts each as minimum baseline.
