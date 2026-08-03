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
