# Contributing to Frontend Performance Lab

Welcome! This project is designed as an AI-first, framework-independent knowledge platform.

## Architectural Philosophy

1. **Single Source of Truth**: All educational content lives in `shared/content/`.
2. **Framework Agnostic**: The `shared/` directory must contain ZERO Nuxt, Vue, or DOM imports. It is pure TypeScript.
3. **Strongly Typed**: Every experiment must adhere to the `ExperimentManifest` schema defined in `shared/schemas/`.

## Repository Structure

- `packages/` - Standalone npm packages, like the official CLI.
- `shared/` - Core AST analyzer, knowledge graph, and schemas (framework-independent).
- `app/` - The Nuxt 4 web application and dashboard.
- `mcp/` - The Model Context Protocol (stdio) server logic.
- `docs/` - Architecture decisions, checklists, and migration guides.

## Development Workflow

To contribute to the core analyzer rules, MCP server, or documentation, you will need to clone the repository:

```bash
git clone https://github.com/smg99/frontend-performance-lab.git
cd frontend-performance-lab
npm install
npm run dev
npm run validate
npm test
npm run build
```

## Pull Request Requirements

We maintain an enterprise-grade CI/CD pipeline. Your PR will not merge unless it passes all automated quality gates:

1. **Linting**: Must pass `npm run lint` (Prettier and ESLint are enforced).
2. **Type Checking**: Must pass `npm run typecheck` (Vue-TSC).
3. **Tests**: Must pass `npm run test` (Vitest).
4. **Validation Scripts**:
   - `npm run validate:mcp` (Ensures the MCP server correctly starts and registries are loaded).
   - `npm run validate:analyzer` (Ensures tests pass, coverage is generated, and `ANALYZER_COVERAGE.md` is synced).

To format and lint your code automatically before committing, we have configured `husky` and `lint-staged`.

## How to Add Content

### Experiments

To ensure consistency, we use a template system for new experiments.

1. Copy the template folder: `cp -r shared/templates/experiment-template shared/content/experiments/your-experiment-name`
2. Fill out the TypeScript files (`manifest.ts`, `examples.ts`, etc.)
3. Register it manually in `shared/registry/index.ts`.

### Browser APIs & Recipes

1. Add the metadata to `shared/content/browser-apis/` or `shared/content/recipes/`.
2. Register the exported object in `shared/registry/browser-apis.ts` or `shared/registry/recipes.ts`.
