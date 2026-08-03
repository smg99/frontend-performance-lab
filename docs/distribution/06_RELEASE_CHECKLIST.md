# Release Checklist

Before tagging a public release on npm or the MCP Marketplace, complete the following:

- [ ] **Tests Pass**: `npm run test` reports 100% pass rate across core and CLI packages.
- [ ] **Build Succeeds**: `npm run build` produces the bundled binary without warnings.
- [ ] **Dogfooding Metrics Met**: False Positive Rate < 5% in `DOGFOODING_RESULTS.md`.
- [ ] **Changelog Updated**: Add release notes for new rules or framework support.
- [ ] **Manifest Validated**: `manifest.json` matches the build version.
- [ ] **E2E Installation Tested**: Run `npx fpl setup` in an isolated environment against dummy `.cursor` and `.vscode` configs to ensure it doesn't corrupt JSON.
- [ ] **Performance Profiled**: Ensure AST parser memory ceiling does not exceed 1GB on large enterprise mono-repos.
