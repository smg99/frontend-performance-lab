# Beta Release Checklist

Before FPL leaves Alpha and enters Public Beta, the following requirements must be met:

- [ ] **CLI Setup Command**: `npx fpl setup` is fully implemented and tested across Mac/Windows/Linux for at least 3 major IDEs (VSCode, Cursor, Claude Desktop).
- [ ] **Recipe Mapping MVP**: Implement the Recipe Mapping layer so that AST violations provide automated fix suggestions.
- [ ] **Dogfooding Validation**: At least 50 real-world repositories audited with a false positive rate < 5%.
- [ ] **AST Rule Expansion**: Expand from 4 core rules to at least 15 high-value performance rules.
- [ ] **Marketplace Manifest**: Publish `manifest.json` properly configured for the MCP registry.
- [ ] **Documentation**: A complete `README.md` with GIFs showing the developer workflow.
- [ ] **CI/CD Pipeline**: Automated GitHub Actions for linting, testing, and building the executable binary.
