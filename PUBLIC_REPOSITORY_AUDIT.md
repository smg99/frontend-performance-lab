# Frontend Performance Lab - Public Repository Audit

## Goal

Transform the repository structure to distinguish between what should be public-facing and what should be treated as private/internal toolchains.

## Findings & Recommendations

### 1. `.factory/` Directory

- **Current State**: Contains AI prompts, historical context (`HANDOVER.md`), sprint instructions, and raw dogfooding logs (`DOGFOODING_RESULTS.md`).
- **Recommendation**: **Rename to `.internal/` or add to `.gitignore` if it contains private telemetry.** In a public context, users don't need to see the raw AI prompts used to generate the tool. However, the dogfooding results might be interesting if published as official benchmarks in `docs/benchmarks/`.
- **Action Needed**: Move `HANDOVER.md` and AI instructions to a `.internal/` folder.

### 2. `app/` vs `packages/` vs `shared/`

- **Current State**: An incomplete monorepo migration.
- **Recommendation**: Complete the migration. `shared/` should become `packages/core/`. `app/` should move to `apps/web/` or similar. Until then, document the structure clearly in the README so new contributors aren't confused.

### 3. `test/` vs `tests/` vs inline `*.test.ts`

- **Current State**: Fragmented test locations.
- **Recommendation**: Adopt a single unified testing convention. Co-locate unit tests alongside their modules (e.g., `ConfigPatcher.test.ts` next to `ConfigPatcher.ts`), and keep integration/E2E tests in a top-level `tests/` directory.

### 4. Boilerplate & Meta files

- **Current State**: Was missing CI, templates, Code of Conduct, etc.
- **Recommendation**: These have now been injected via `.github/` and root markdown files to establish trust and streamline community contributions.
