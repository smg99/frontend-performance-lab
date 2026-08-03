# Installation Strategy

## The Goal: "One Command Setup"

The goal is to allow a developer to install and configure Frontend Performance Lab (FPL) across any supported IDE with a single, reliable command:

```bash
npx fpl setup
```

## Architecture (Implemented in MVP)

The `fpl setup` CLI command is an interactive, idempotent installation script located in `packages/cli/src/setup/`.

### Key Responsibilities

1. **System Discovery**: `EnvironmentDetector` and `IDEFinder` identify the OS and installed IDEs (Claude Desktop, Cursor, VSCode, Antigravity).
2. **Global Installation**: Install FPL binaries globally (or prompt to run via npx dynamically).
3. **Configuration Injection**: Safely patch each IDE's specific MCP configuration file to register the `fpl` MCP server.
4. **Validation**: Test the server execution and verify MCP handshake.
5. **Rollback**: Safely remove configuration changes if validation fails.

### Zero Configuration Approach

FPL should require zero manual configuration upon installation. It should intelligently detect workspace parameters (Vue vs. React, TypeScript configs) at runtime rather than requiring setup prompts.
