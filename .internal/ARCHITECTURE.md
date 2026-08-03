# Architecture Discovery

## Major Modules

- **`app/`**: Nuxt 4 frontend presentation layer. Contains purely UI components, layouts, and pages.
- **`shared/`**: The core domain logic, separated from the UI:
  - `schemas/`: Strict TypeScript interfaces.
  - `content/`: Raw educational data and Markdown (single source of truth).
  - `registry/`: Manual registry exporting content.
  - `utils/analyzer/`: Babel-powered AST static analysis engine for performance bottlenecks.
- **`mcp/`**: Standalone Node.js script implementing the Model Context Protocol (MCP) server.
- **`packages/cli/`**: CLI tool (`fpl`) for setting up and verifying the developer environment.

## Folder Structure

- `/app`: Nuxt 4 web dashboard.
- `/packages/cli`: CLI package workspace.
- `/mcp`: MCP server integration.
- `/shared`: Core schemas, knowledge graph, and AST analyzer.
- `/public`, `/assets`: Static assets.
- `/test`, `/tests`: Test suites (Vitest, Playwright).

## Entry Points

- **Web App:** Nuxt entry (`nuxt.config.ts`, `app/app.vue`).
- **MCP Server:** `mcp/server.ts`.
- **CLI:** `packages/cli/` source code.
- **Testing/Linting:** Managed via `package.json` scripts (`npm run test`, `npm run lint`).

## Performance-Related Code

The entire purpose of the repository is performance tooling. The core engine is located in `shared/utils/analyzer/`, leveraging `@babel/parser` and `@babel/traverse` to statically identify reactivity pitfalls and DOM manipulation issues in frontend components.

## Existing Technical Debt

- **Incomplete Monorepo Migration:** The repository is transitioning to a full npm workspace monorepo. While `packages/cli/` is isolated, `app/`, `shared/`, and `mcp/` are still at the root level. They need to be migrated into `apps/web/`, `packages/core/`, etc., to fully realize the architecture outlined in `ARCHITECTURE.md`.
- **Internal Coupling Constraints:** Strict path aliases must be maintained manually until the workspace migration is complete, to prevent `app/` from directly importing from `shared/content/`.

## Missing Documentation

- **Analyzer API Docs:** No explicit documentation on how to author or extend custom AST analyzer rules.
- **MCP Tool Definitions:** Missing detailed external documentation covering the available MCP tools and their expected payloads beyond the source schemas.
