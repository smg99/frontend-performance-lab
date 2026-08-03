# Backlog

## High Priority

- **Complete Monorepo Migration**: The architecture outlines an ongoing transition to a full npm workspace monorepo. `app/` needs to move to `apps/web/`, `shared/` needs to split into `packages/shared-types`, `packages/content`, and `packages/core`. `mcp/` needs to move to an appropriate app directory.
- **AST Analyzer Extensibility**: Create comprehensive documentation and a plugin or hook system for developers to easily add custom AST analyzer rules for their own specific use cases or frameworks.

## Medium Priority

- **CLI Enhancements**: Expand `packages/cli/` to manage local workspace configurations and allow developers to toggle specific performance rules on or off within their projects.
- **MCP Server Hardening**: Enhance the MCP server with more granular queries and add detailed parameter validation and error handling for robust IDE integrations.
  - _Status:_ `performance_audit` tool shell is implemented (Sprint 001 Slice 1). Real AST integration pending.

## Low Priority

- **Additional Framework Support**: Expand the AST analyzer, which currently focuses heavily on Vue and React paradigms, to cover performance pitfalls specific to Svelte and Angular.
- **Automated Deployments**: Further streamline the CI/CD pipeline to automate deployments of the Nuxt 4 web app via Vercel integration or GitHub Pages on every release tag.
