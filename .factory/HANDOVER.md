# Handover Notes

## To New Senior Engineers

Welcome to the **Frontend Performance Lab**! This project serves as an AI-powered performance engine, exposing specialized knowledge to AI assistants via MCP and providing a local AST-based static analyzer.

### Key Concepts

1. **The AST Analyzer:** We don't just lint code; we perform static performance analysis. The core engine uses `@babel/parser` and `@babel/traverse`. If you need to detect new performance bottlenecks, you'll be writing Babel traversal visitors in `shared/utils/analyzer/`.
2. **MCP Integration:** `mcp/server.ts` is the bridge to the outside world. It exposes our knowledge graph to AI agents like Claude, Cursor, and Windsurf via stdio. It also provides the `performance_audit` tool, which leverages the AST analyzer for in-memory source strings.
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
