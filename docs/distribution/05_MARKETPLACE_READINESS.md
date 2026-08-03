# Marketplace Readiness

To publish on an official MCP Marketplace or as a standardized package:

1. **Universal Binary**: Must be bundled with `esbuild` or `tsup` into a single, zero-dependency executable (`bin/fpl`) to prevent node_modules resolution issues in varying environments.
2. **Schema Export**: Must export the standardized `manifest.json`.
3. **Stateless Execution**: The server must not assume write access to the filesystem except for `/tmp`.
4. **Telemetry Opt-out**: Any telemetry (if added later) must be strictly opt-in or easily disabled via `FPL_TELEMETRY=0` to comply with enterprise security boundaries.
5. **Security Scanning**: Automated supply chain checks via Dependabot/Snyk before every release.
