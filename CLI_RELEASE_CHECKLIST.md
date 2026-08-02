# CLI Release Checklist

Before running `npm publish --access public`, review this final checklist.

## 1. Documentation & Onboarding

- [x] Does `fpl --help` look clean, formatted, and provide a clear banner/description?
- [x] Does `fpl setup` use an interactive `@clack/prompts` wizard?
- [x] Does `fpl setup` successfully find IDE configuration paths?
- [x] Does the root `README.md` recommend `npx @frontend-performance-lab/cli setup`?
- [x] Is the Migration plan (`docs/MIGRATION.md`) clear for existing repository users?

## 2. System Verification

- [x] Does `fpl doctor` execute properly and use colored output/warnings?
- [x] Does `fpl info` output the Node version and IDE detection correctly?
- [x] Does `fpl --version` match the `package.json` version?

## 3. Package Validation

- [x] Is the package name `@frontend-performance-lab/cli`?
- [x] Are heavy dependencies (Nuxt, Vue, Playwright) successfully excluded from the build output and runtime dependencies?
- [x] Are the `homepage`, `bugs`, `repository`, and `keywords` metadata fields filled out in `packages/cli/package.json`?
- [x] Did `npm pack` generate a lightweight tarball (under 500KB)?
- [x] Have you tested a local installation from the tarball? (`npm install -g ./frontend-performance-lab-cli-1.0.0.tgz`)

## 4. MCP Subsystem

- [x] Does `fpl mcp` successfully start the stdio server?
- [x] Is the knowledge graph properly bundled and accessible when the server boots?

**If all checkboxes are marked, the package is ready for publishing!**
