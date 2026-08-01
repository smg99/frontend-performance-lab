# Architecture

This document describes the modular single-project architecture of the **Frontend Performance Lab**.

## Folder Responsibilities

- **`app/`**: The Nuxt 4 frontend application. This is a pure presentation layer. It contains UI components, layouts, and pages, but zero hardcoded educational content.
- **`shared/schemas/`**: Strict TypeScript interfaces (e.g. `ExperimentManifest`, `BrowserAPI`, `Recipe`). Enforces type safety across the entire project.
- **`shared/content/`**: The Single Source of Truth. Contains all raw educational data, code examples, benchmarks, and markdown.
- **`shared/registry/`**: A manual registry (`index.ts`, `browser-apis.ts`, `recipes.ts`) exporting all content for easy consumption by the UI and MCP server.
- **`shared/utils/`**: Shared engines for search, fuzzy matching, and ranking.
- **`shared/utils/analyzer/`**: A custom AST-based static analysis engine that parses frontend code to detect performance bottlenecks.
- **`mcp/`**: A standalone Node.js script implementing the Model Context Protocol (MCP) server, allowing AI coding assistants to query the lab's knowledge base.

## Core Systems

### Knowledge Graph

The platform operates as a cohesive knowledge graph. Entities (Experiments, Recipes, Browser APIs) are linked via bidirectional tags and references. The `RelatedKnowledge` component dynamically queries the registry to surface these connections without hardcoded links.

### Performance Analyzer

A Babel-powered AST traversal engine designed to run locally or via the MCP server. It analyzes Vue and React codeframes and cross-references detected issues with the platform's knowledge graph to provide actionable recommendations.

### Model Context Protocol (MCP)

The `mcp/server.ts` exposes the entire educational database directly to AI coding assistants (like Claude or Gemini) via stdio. AI agents can dynamically query `get_experiment`, `search_platform`, and `system_diagnostics`.

## Dependency Flow

1. `shared/schemas` has zero dependencies.
2. `shared/content` depends ONLY on `shared/schemas`.
3. `shared/registry` aggregates `shared/content`.
4. `app/` and `mcp/` depend on `shared/registry` and `shared/utils`.
5. The `app/` UI NEVER directly imports from `shared/content`.

## Future Monorepo Migration

The repository is intentionally designed to evolve into an `npm workspace` monorepo.
Once the project scales beyond 20-50 experiments:

1. `app/` will move to `apps/web/`.
2. `shared/schemas/` will become `packages/shared-types`.
3. `shared/content/` will become `packages/content`.
4. `shared/utils/` and `shared/registry/` will merge into `packages/core`.

Because we enforce strict path aliases (`@shared`, `@content`, `@registry`) today, this future migration will require zero changes to the underlying import logic.
