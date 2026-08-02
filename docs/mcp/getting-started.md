# MCP Setup & Getting Started

The Model Context Protocol (MCP) enables your AI assistant to directly access the Frontend Performance Lab's AST Analyzer, Knowledge Graph, and Recipes natively inside your IDE.

## 1. Quick Start (Recommended)

The easiest way to get started is by using the official CLI.

```bash
npm install -g @smg99/frontend-performance-lab-cli
fpl setup
fpl doctor
```

The `fpl setup` wizard will automatically detect your installed IDEs (Cursor, Claude Code, VS Code, Windsurf) and configure the MCP server for you. Restart your IDE afterward, and you will be ready to go!

---

## 2. Advanced Manual Configuration

If you prefer not to use the automated `fpl setup` wizard, you can manually configure your IDE to point to the global npx package.

### Cursor

1. Open Cursor Settings (`Cmd + Shift + J`).
2. Navigate to **Features > MCP**.
3. Click **+ Add New MCP Server**.
4. Set the following:
   - **Name:** `Frontend Performance Lab`
   - **Type:** `command`
   - **Command:** `npx -y @smg99/frontend-performance-lab-cli mcp`

### Claude Code

Open your terminal and run the Claude Code CLI tool:

```bash
claude mcp add frontend-performance-lab npx -y @smg99/frontend-performance-lab-cli mcp
```

### VS Code (via Cline/Roo)

Open your MCP settings JSON file and append:

```json
{
  "mcpServers": {
    "frontend-performance-lab": {
      "command": "npx",
      "args": ["-y", "@smg99/frontend-performance-lab-cli", "mcp"],
      "env": {}
    }
  }
}
```

### Windsurf

Open your global `~/.codeium/windsurf/mcp_config.json` (or workspace-specific config) and append the same JSON configuration as above.

### Continue.dev

Open your `~/.continue/config.json` and append to the `mcpServers` array:

```json
{
  "name": "frontend-performance-lab",
  "command": "npx",
  "args": ["-y", "@smg99/frontend-performance-lab-cli", "mcp"]
}
```

---

## Troubleshooting & Expected Output

### Expected Output

When configured correctly, the server connects silently via `stdio`. Your IDE should show a "Connected" green status indicator next to the server name in its respective MCP settings panel.

### Common Issues

If your IDE cannot connect:

1. Ensure you have Node.js >= 18.x installed.
2. Run `fpl doctor` to verify your environment health.
3. Test the server independently using the official inspector:
   ```bash
   npx @modelcontextprotocol/inspector npx -y @smg99/frontend-performance-lab-cli mcp
   ```

For detailed error resolution, see our [Troubleshooting Guide](../troubleshooting.md).
