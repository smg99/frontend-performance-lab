# Ecosystem Architecture

Frontend Performance Lab (FPL) is designed as a long-term, scalable npm ecosystem. While it began as a single Nuxt application, it is transitioning into a modular monorepo workspace to support a suite of developer tools, CLI utilities, AI context providers (MCP), and IDE extensions.

This document outlines the architectural roadmap for the `@frontend-performance-lab` organization ecosystem.

---

## 1. Package Layout

### Current State (Transitional)

The repository currently houses the Nuxt frontend application at the root, tightly coupled with the core analyzer and MCP server.

- `/` - Nuxt Application & Root Workspace
- `/packages/cli` - Initial extraction of the CLI & MCP server (Phase 1 Workspace)
- `/shared` - Tightly coupled core logic awaiting extraction.

### Future State (Target Architecture)

The repository will adopt a pure npm workspace model with clearly defined boundaries. The Nuxt app remains at the root, while reusable packages live in `/packages/` and integrations live in `/integrations/`.

```
frontend-performance-lab/
├── package.json (Workspace Root & Nuxt App)
├── packages/
│   ├── cli/            # @frontend-performance-lab/cli
│   ├── core/           # @frontend-performance-lab/core
│   └── knowledge/      # @frontend-performance-lab/knowledge
├── integrations/
│   ├── eslint-plugin/  # eslint-plugin-frontend-performance
│   ├── vscode/         # VS Code Extension
│   └── github-action/  # FPL GitHub Action
└── mcp/                # Extracted MCP handlers (or bundled into CLI)
```

---

## 2. Package Responsibilities

### Public Packages

These are published to the public npm registry for end-user consumption.

| Package       | Name                                  | Responsibility                                                                                                                                              |
| ------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **CLI**       | `@frontend-performance-lab/cli`       | The primary developer entry point. Exposes the `fpl` binary for installation, analysis (`fpl analyze`), and the MCP server (`fpl mcp`).                     |
| **Core**      | `@frontend-performance-lab/core`      | The headless AST analyzer engine. Extracts the babel traversal logic so it can be consumed by the CLI, Nuxt app, and ESLint plugin without UI dependencies. |
| **Knowledge** | `@frontend-performance-lab/knowledge` | The structured knowledge graph (Recipes, Browser APIs, Experiments). Exposes an SDK for querying the knowledge base programmatically.                       |
| **ESLint**    | `eslint-plugin-frontend-performance`  | Real-time editor feedback based on the Core analyzer.                                                                                                       |

### Internal Packages

These are not published to npm; they are consumed strictly within the repository.

| Package            | Responsibility                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Web App** (Root) | The interactive playground, visualizer, and documentation site built with Nuxt. Consumes `@core` and `@knowledge`. |
| **VS Code**        | IDE Extension providing native UI panels for the analyzer.                                                         |
| **GitHub Action**  | CI pipeline tool to run `fpl analyze` against Pull Requests.                                                       |

---

## 3. Dependency Graph

The architecture relies on a strict unidirectional dependency flow to prevent circular dependencies and bloated bundle sizes.

```mermaid
graph TD
    UI[Nuxt Web App]
    CLI[@fpl/cli]
    ESL[eslint-plugin]
    VSC[VS Code Extension]
    GHA[GitHub Action]

    CORE[@fpl/core]
    KNOW[@fpl/knowledge]

    UI --> CORE
    UI --> KNOW

    CLI --> CORE
    CLI --> KNOW

    ESL --> CORE

    VSC --> CLI
    VSC --> CORE

    GHA --> CLI
```

_Note: The CLI bundles the MCP Server, which uses `@fpl/knowledge` to provide AI context and `@fpl/core` to provide analysis tools._

---

## 4. Versioning Strategy

### Semantic Versioning (SemVer)

All public packages follow strict Semantic Versioning (`MAJOR.MINOR.PATCH`).

- **MAJOR**: Incompatible API changes (e.g., rewriting the CLI commands, breaking changes to the core AST analyzer signature).
- **MINOR**: Backward-compatible functionality additions (e.g., new analyzer rules, new CLI subcommands, new MCP tools).
- **PATCH**: Backward-compatible bug fixes (e.g., fixing an AST parsing bug, updating knowledge graph content).

### Independent vs. Fixed Versioning

The ecosystem will use **Independent Versioning**.
Because `@fpl/knowledge` might update daily with new recipes (Patch/Minor), it should not force a version bump on `@fpl/core` or `@fpl/cli` unless those packages also change. This reduces publish fatigue and keeps changelogs highly relevant to specific domains.

---

## 5. Publishing Strategy & Release Workflow

### Automated Publishing via CI

Publishing is fully automated via GitHub Actions utilizing **Changesets** (or equivalent tooling).

1. **Development**: Contributors open PRs. If a PR modifies a workspace package, they include a changeset (`npx changeset`).
2. **Merging**: When merged to `main`, a "Release PR" is automatically created/updated summarizing all pending changesets.
3. **Publishing**: When a maintainer merges the Release PR, the CI pipeline automatically bumps versions, generates `CHANGELOG.md` files, tags the release in Git, and publishes to the npm registry.

### Backward Compatibility Policy

- **CLI Flags & Commands**: Once a command is published in a major version, it cannot be removed or its fundamental behavior changed without a deprecation warning lasting at least one minor release cycle, followed by a major version bump.
- **Core API**: Internal package interfaces (like the Core AST engine) guarantee stability for minor/patch releases. Types exported via TypeScript are considered part of the stable public API.
- **Node.js Support**: The ecosystem supports the Active LTS and Maintenance LTS versions of Node.js. Dropping a Node.js version requires a MAJOR version bump.
