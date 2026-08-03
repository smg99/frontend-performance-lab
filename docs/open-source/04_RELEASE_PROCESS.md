# Release Process

FPL maintains a rigid release pipeline to protect users' IDEs from crashes.

## Pre-Release (Alpha/Beta)

1. Ensure all new AST rules have at least 1 benchmark fixture (clean and violation).
2. Validate `npm run test` is completely green.
3. Review `manifest.json` versions.
4. Dogfood the release locally against a real repository to check for false positives.

## Stable Release

1. Update `CHANGELOG.md` detailing new rules, fixes, and framework changes.
2. Bump version using `npm version <major|minor|patch>`.
3. Push to `main` with the tag.
4. GitHub Actions will build the `esbuild` binary and publish to npm / MCP Marketplace.
