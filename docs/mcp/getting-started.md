# MCP Setup & Getting Started

The Model Context Protocol (MCP) enables your AI assistant to directly access the Frontend Performance Lab's AST Analyzer, Knowledge Graph, and Recipes natively inside your IDE.

This guide provides setup instructions for all supported clients.

## Architecture Modes

### Local Mode (Recommended)
The server runs directly on your machine. This is **required** for the AST Analyzer to function, as it needs secure read-access to your file system to scan for layout thrashing, memory leaks, and massive DOM renders.

### Hosted Mode
> **Coming Soon**  
> We plan to offer a remote SSE (Server-Sent Events) endpoint. Hosted mode will grant your AI access to our Knowledge Graph and Browser APIs without local installation, but will *not* support local AST code analysis.

---

## 1. General Requirements & Installation

Regardless of your IDE, the server must be installed locally.

**Requirements:**
- Node.js >= 18.x

**Installation:**
```bash
git clone https://github.com/smg99/frontend-performance-lab.git
cd frontend-performance-lab
npm install
```

Make sure you know the absolute path to this cloned repository. You will need it below.

---

## 2. Cursor Configuration

**Configuration:**
1. Open Cursor Settings (`Cmd + Shift + J`).
2. Navigate to **Features > MCP**.
3. Click **+ Add New MCP Server**.
4. Set the following:
   - **Name:** `Frontend Performance Lab`
   - **Type:** `command`
   - **Command:** `npx tsx /YOUR/ABSOLUTE/PATH/TO/frontend-performance-lab/mcp/server.ts`

**Verification:**
Ask Cursor: *"What experiments are available in the Frontend Performance Lab?"*

---

## 3. Claude Code Configuration

**Configuration:**
Open your terminal and run the Claude Code CLI tool:

```bash
claude mcp add frontend-performance-lab npx -y tsx /YOUR/ABSOLUTE/PATH/TO/frontend-performance-lab/mcp/server.ts
```

**Verification:**
Ask Claude Code: *"Use the performance reviewer to analyze my App.vue file."*

---

## 4. VS Code (via Cline/Roo) Configuration

**Configuration:**
1. Install the [Cline](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev) or Roo extension.
2. Open the extension settings and navigate to the MCP configuration file (`mcp_settings.json`).
3. Add the following entry:

```json
{
  "mcpServers": {
    "frontend-performance-lab": {
      "command": "npx",
      "args": ["tsx", "/YOUR/ABSOLUTE/PATH/TO/frontend-performance-lab/mcp/server.ts"],
      "env": {}
    }
  }
}
```

**Verification:**
Ask the VS Code assistant: *"Review my current component for Layout Thrashing."*

---

## 5. Windsurf Configuration

**Configuration:**
1. Open your global `~/.codeium/windsurf/mcp_config.json` (or workspace-specific config).
2. Add the server entry:

```json
{
  "mcpServers": {
    "frontend-performance-lab": {
      "command": "npx",
      "args": ["tsx", "/YOUR/ABSOLUTE/PATH/TO/frontend-performance-lab/mcp/server.ts"]
    }
  }
}
```

**Verification:**
Ask Windsurf: *"List the frontend performance browser APIs available."*

---

## 6. Continue.dev Configuration

**Configuration:**
1. Open your `~/.continue/config.json`.
2. Add the server configuration under the `mcpServers` array/object (depending on extension version):

```json
{
  "mcpServers": [
    {
      "name": "frontend-performance-lab",
      "command": "npx",
      "args": ["tsx", "/YOUR/ABSOLUTE/PATH/TO/frontend-performance-lab/mcp/server.ts"]
    }
  ]
}
```

---

## 7. Gemini CLI Configuration

**Configuration:**
Depending on your Gemini CLI wrapper, you generally export the command. If using a JSON config:

```json
{
  "mcpServers": {
    "frontend-performance-lab": {
      "command": "npx",
      "args": ["tsx", "/YOUR/ABSOLUTE/PATH/TO/frontend-performance-lab/mcp/server.ts"]
    }
  }
}
```

---

## Troubleshooting & Expected Output

### Expected Output
When configured correctly, the server connects silently via `stdio`. Your IDE should show a "Connected" green status indicator next to the server name in its respective MCP settings panel.

### Common Issues
If your IDE cannot connect:
1. Double-check that the path to `/mcp/server.ts` is absolute.
2. Ensure you have run `npm install` in the lab directory.
3. Test the server independently using the official inspector:
   ```bash
   npx @modelcontextprotocol/inspector npx tsx /YOUR/ABSOLUTE/PATH/TO/frontend-performance-lab/mcp/server.ts
   ```

For detailed error resolution, see our [Troubleshooting Guide](../troubleshooting.md).
