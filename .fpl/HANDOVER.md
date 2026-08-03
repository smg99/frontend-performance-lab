# Handover Notes

## To New Senior Engineers

Welcome to the **Frontend Performance Lab**! This project serves as an AI-powered performance engine, exposing specialized knowledge to AI assistants via MCP and providing a local AST-based static analyzer.

### Key Concepts

1. **The AST Analyzer:** We don't just lint code; we perform static performance analysis. The core engine uses `@babel/parser` and `@babel/traverse`. If you need to detect new performance bottlenecks, you'll be writing Babel traversal visitors in `shared/utils/analyzer/`.
2. **MCP Integration:** `mcp/server.ts` is the bridge to the outside world. It exposes our knowledge graph to AI agents like Claude, Cursor, and Windsurf via stdio. It provides the `performance_audit` tool, which leverages a secure `FileAccessService` to read files from the workspace and passes them to the AST analyzer.
3. **Strict Separation of Concerns:** The `app/` directory is purely presentational (Nuxt 4). It has zero hardcoded educational content. All state, models, and data live in the `shared/` directory, acting as a single source of truth.

### Getting Started

1. Run `npm install` from the root (utilizes npm workspaces).
2. Start the development server for the web app with `npm run dev`.
3. To test the MCP server locally, use `npm run mcp:start`.
4. Review the CLI tool in `packages/cli/`, which is responsible for user onboarding (`fpl setup`, `fpl doctor`).

### Watch Outs & Conventions

- **Import Strictness:** Be extremely careful with imports. Code in `app/` and `mcp/` must ONLY import from `shared/registry` or `shared/utils`. They should NEVER directly import from `shared/content`. We rely on strict path aliases to enforce this until the monorepo migration is complete.
- **CI/CD:** We have strict linting (`eslint`, `prettier`) and testing (`vitest`, `playwright`) requirements enforced by GitHub Actions. Always run `npm run lint` and `npm run test` before submitting a PR.
- **Monorepo Migration:** Keep in mind that directory structures will shift as we complete the transition to `apps/` and `packages/` workspaces.

### Principal Engineer Self-Review (Diagnostics Slice)

- **Is every field genuinely useful?** Yes, `why` and `howToVerify` are extremely useful for LLMs to generate actionable explanations, and `references` provide ground truth.
- **Is anything duplicated?** No. The AnalyzerEngine produces raw location and ID data. The Diagnostics Mapper enriches it without mutating the engine's internal state.
- **Can future rule authors add diagnostics in under five minutes?** Yes. They only need to create a `rule-id.ts` file implementing `DiagnosticDefinition` and export it in `mapper.ts`.
- **Does this architecture scale to 100+ analyzer rules?** Yes. The registry is an O(1) object map, and rule files can be easily split into subdirectories. It keeps the core analyzer extremely lightweight since strings aren't allocated in the AST traversal itself.

### Principal Engineer Self-Review (Reporting Slice)

- **Would this report impress a Senior Frontend Engineer?** Yes, it instantly provides executive-level summaries, categorized severities, exact lines of failure, actionable fixes, DEV tool verification steps, and calculates estimated impact all locally and deterministically, without relying on unpredictable LLM generation. It feels like an expert audit out-of-the-box.

### Principal Engineer Review (Alpha State)

**Question: Would I publish this publicly today?**
**Answer:** No.

**Why:**
While the architecture is highly scalable and secure, the product itself feels incomplete for a public launch:

1. **Shallow Rule Coverage:** We have only mapped 4 rich diagnostics (`dom-layout-thrashing`, `memory-event-listener`, `vue-large-v-for`, `react-large-map`). All other AST detections degrade to an "Unknown Violation" fallback, which looks unprofessional and undermines trust.
2. **Missing Feature (Recipe Mapping):** We deliberately deferred automated recipe mapping. Without it, developers have to write the fix themselves rather than applying an automated AST-level transformation or specific code suggestion.
3. **Unvalidated False Positives:** We need to push the analyzer through real-world Dogfooding to tune the noise-to-signal ratio. If the tool is too noisy on day one, developers will uninstall it permanently.

### Principal Engineer Review (Distribution Readiness)

**Question: If we open sourced FPL tomorrow, what would stop 10,000 developers from installing it?**
**Answer:** The lack of a frictionless installation pipeline.

**Blockers:**

1. **Manual Configuration Fatigue:** Developers despise editing JSON files manually. Expecting 10,000 engineers to manually find `claude_desktop_config.json` or `~/.cursor/mcp.json` and perfectly paste our configuration object is a massive adoption blocker. We must build `npx fpl setup`.
2. **Node/Environment Dependency Issues:** If FPL relies on the global Node version resolving local dependencies incorrectly, the MCP will crash silently. The binary must be bundled into a zero-dependency executable (`esbuild` or `tsup`).
3. **No Marketplace Presence:** Without an official `manifest.json` and listing in the future MCP marketplace or extension registries (like the Cline/RooCode directories), discoverability is effectively zero.
4. **Permissions Trust:** 10,000 users will not pipe an unknown AST parser through their private codebases unless the package guarantees it only runs entirely locally and makes absolutely zero outbound network requests. Telemetry must be demonstrably nonexistent or strictly opt-in.

### Principal Engineer Review (Open Source Readiness)

**Question: If this repository reached Hacker News tomorrow, what are the top 20 criticisms experienced open-source maintainers would make?**

1. **"Where is the root README.md?"**: The project lacks a primary README at the root level explaining what the project is, how it works, and how to install it.
2. **"What is this `.factory` folder?"**: The `.factory` directory contains a bunch of AI instruction prompts and internal tracking docs which look incredibly unprofessional in a public repository. It should be `.internal` or `.github/admin`.
3. **"Incomplete Monorepo Migration"**: The backlog mentions a migration to `apps/` and `packages/`, but code is still scattered across `shared/` and `app/`. It looks like an abandoned refactor.
4. **"No `npx` CLI actually exists"**: The docs heavily promote `npx fpl setup`, but the `packages/cli` directory doesn't even exist yet. Total vaporware.
5. **"Inconsistent Test Locations"**: Tests are scattered. Some are in `test/unit/`, while others are nested deeply inside `shared/utils/analyzer/tests/`. Pick a lane (colocated vs `__tests__` vs `test/`).
6. **"Inconsistent File Naming"**: We have `core.ts`, `FileAccessService.ts`, and `react-large-map.ts`. Mixing camelCase, PascalCase, and kebab-case is an immediate red flag for code quality.
7. **"Zero Examples"**: There is no `examples/` directory showing a before-and-after of a Vue or React component being analyzed.
8. **"No GitHub Actions CI/CD"**: There are no `.github/workflows/` files. Tests aren't running automatically on PRs.
9. **"Missing License"**: There is no `LICENSE` file in the root.
10. **"Where are the dependencies?"**: The `package.json` sits at the root, but if this is a monorepo, where are the workspace configs (`pnpm-workspace.yaml` or npm workspaces)?
11. **"Hardcoded Rule Registry"**: The rule registry requires manually importing and appending rules to an array. This doesn't scale for community contributions.
12. **"No Architecture Diagram"**: The `ARCHITECTURE_OVERVIEW.md` is just text. Developers expect a Mermaid or Excalidraw diagram for a multi-layered parser.
13. **"ESLint Warnings"**: The linter throws warnings about deprecated `.eslintignore`. We should have fixed our config before launching.
14. **"What happens on large repos?"**: There are no benchmarks or memory limits defined for the AST parser on a 100k line monolithic frontend.
15. **"Why Babel?"**: "Why are you using Babel in 2026? You should be using Rust/SWC or Oxc for AST parsing if you care about performance."
16. **"No Prettier/Husky hooks"**: Code formatting isn't enforced on commit, so PRs will be full of stylistic nitpicks.
17. **"Tight Coupling in Tests"**: The benchmark tests rely heavily on `JSON.parse` of the MCP output string, making them brittle if the markdown structure changes slightly.
18. **"Only 4 Rules?"**: "You launched an 'Analyzer Engine' with only 4 rules? ESLint has hundreds."
19. **"No E2E Tests"**: There is no end-to-end test proving that the MCP server actually talks to an IDE.
20. **"Vague Error Handling"**: When a file fails to parse, it throws an ugly Babel SyntaxError stack trace instead of a graceful diagnostic reporting the parse failure.

### Principal Engineer Review (Installer MVP UX)

**Perspective:** A junior frontend developer who hates configuring build tools.
**Assessment:** Yes, they can install it flawlessly without reading documentation.
**Why?**

- The `npx fpl setup` command auto-detects their OS and IDEs silently.
- The prompts are straightforward (`[Y/n]`).
- Crucially, it manages the dreaded `mcp.json` automatically, injects the server with `npx` (which resolves globally without npm link hell), and warns them to restart the IDE.
- If their existing `mcp.json` is a broken mess, the CLI safely aborts and restores their backup, preventing the heart-attack moment of "I broke my IDE". The UX is solid.
