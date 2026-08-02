# Migration Guide

Frontend Performance Lab is transitioning from a repository-based tool into a standalone, installable CLI & MCP package (`@smg99/frontend-performance-lab-cli`).

If you previously cloned the repository to run the MCP server locally, you can now transition to the npm package.

## 1. Remove the local clone (Optional)

If you were only using the repository to run the MCP server in your IDE, you can safely delete the cloned directory:

```bash
rm -rf frontend-performance-lab
```

## 2. Install the CLI Package

Install the new CLI globally on your system:

```bash
npm install -g @smg99/frontend-performance-lab-cli
```

## 3. Run Setup

Let the CLI configure your environment and IDEs for you:

```bash
fpl setup
```

This will detect your installed IDEs (Cursor, Claude, VS Code, Windsurf) and generate the updated MCP configuration.

## 4. Verify Installation

Ensure the CLI is working properly:

```bash
fpl doctor
fpl info
```

## Updated IDE Configuration

If you prefer to configure your IDE manually, update your configuration from the old `node` path to use `npx`:

```json
{
  "mcpServers": {
    "frontend-performance-lab": {
      "command": "npx",
      "args": ["-y", "@smg99/frontend-performance-lab-cli", "mcp"]
    }
  }
}
```
