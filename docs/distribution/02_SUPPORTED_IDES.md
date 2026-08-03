# Supported IDEs & Clients

This document details how `npx fpl setup` integrates with each supported IDE/Client.
_Note: As of MVP Version 1, only Cursor, Claude Desktop, VSCode, and Antigravity are actively implemented. Others remain planned._

## Common Architecture

- **Validation Strategy (All):** Run a health check subprocess against the modified config to ensure JSON is valid and the CLI command resolves.
- **Rollback Strategy (All):** Maintain a `.bak` backup of the configuration file before editing. If validation fails, restore the backup immediately.

---

### 1. Cursor

- **Configuration location:** `~/.cursor/mcp.json` or OS-specific roaming app data.
- **Detection strategy:** Check for existence of the `~/.cursor` directory or the Cursor app binary.
- **Common failure modes:** Invalid JSON syntax breaking the Cursor MCP loader.

### 2. Claude Desktop

- **Configuration location:** `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac), `%APPDATA%\Claude\claude_desktop_config.json` (Windows).
- **Detection strategy:** Check for the Claude config directory.
- **Common failure modes:** Requires Claude Desktop restart to pick up changes.

### 3. Claude Code

- **Configuration location:** Uses global MCP registry or `.claude.json` in the workspace.
- **Detection strategy:** Detect global `claude` CLI installation.
- **Common failure modes:** Path resolution issues for global node modules.

### 4. VSCode

- **Configuration location:** `~/.vscode/mcp.json` (via compatible MCP extensions).
- **Detection strategy:** Look for `.vscode` and standard MCP extensions (like VSCode MCP).
- **Common failure modes:** Extension might not be installed even if VSCode is.

### 5. Antigravity

- **Configuration location:** `~/.gemini/config/plugins/` (requires creating an MCP config/plugin).
- **Detection strategy:** Look for `~/.gemini/config`.
- **Common failure modes:** Strict plugin schemas failing to load the raw MCP config.

### 6. Windsurf

- **Configuration location:** `~/.codeium/windsurf/mcp_config.json`.
- **Detection strategy:** Look for the `.codeium/windsurf` directory.
- **Common failure modes:** Conflicts with existing Codeium performance tools.

### 7. Continue.dev

- **Configuration location:** `~/.continue/config.json`.
- **Detection strategy:** Check for `~/.continue` directory.
- **Common failure modes:** Mixing `mcpServers` object with legacy tool configurations.

### 8. Cline

- **Configuration location:** `~/.vscode/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json` (VSCode global storage).
- **Detection strategy:** Look for the specific globalStorage extension folder.
- **Common failure modes:** Settings overwritten by the extension UI concurrently.

### 9. RooCode

- **Configuration location:** `~/.vscode/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json`.
- **Detection strategy:** Look for the RooCode extension folder.
- **Common failure modes:** Similar to Cline, concurrent UI overwrites.

### 10. JetBrains

- **Configuration location:** IDE specific settings directories (e.g., `~/Library/Application Support/JetBrains/.../mcp.json`) via MCP plugins.
- **Detection strategy:** Glob search `~/Library/Application Support/JetBrains/` for MCP plugin configs.
- **Common failure modes:** Multiple JetBrains IDEs installed (WebStorm, IntelliJ) requiring multiple injections.

### 11. Zed

- **Configuration location:** `~/.config/zed/mcp.json` or embedded in `settings.json`.
- **Detection strategy:** Check for `~/.config/zed` directory.
- **Common failure modes:** Incompatible settings schema or missing experimental flags for MCP.
