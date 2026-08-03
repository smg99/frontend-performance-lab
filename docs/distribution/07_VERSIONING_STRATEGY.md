# Versioning Strategy

FPL follows strictly semantic versioning (SemVer) with specific meanings for the AST rules:

- **MAJOR (`x.0.0`)**:
  - Breaking changes to the MCP tool schema.
  - Removing a diagnostic rule entirely (changing the expected diagnostics output format).
  - Dropping support for an older Node.js version.
- **MINOR (`0.x.0`)**:
  - Adding a new AST analyzer rule.
  - Adding support for a new framework (e.g., Svelte).
  - Adding support for a new IDE in the `setup` CLI.
- **PATCH (`0.0.x`)**:
  - Bug fixes in existing rules (e.g., fixing a false positive).
  - Updates to the text in the Engineering Report.
  - Dependency bumps.
