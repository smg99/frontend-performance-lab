# MCP Server

This directory contains the Model Context Protocol (MCP) server for the Frontend Performance Lab.

## Setup

See the **[Full MCP Setup Guide →](../docs/mcp/getting-started.md)** for complete installation instructions for all supported IDEs (Cursor, Claude Code, VS Code, Windsurf, Continue.dev, Gemini CLI).

## Available Tools

| Tool                 | Description                                  |
| -------------------- | -------------------------------------------- |
| `list_experiments`   | List all available performance experiments   |
| `get_experiment`     | Fetch a specific experiment or section       |
| `list_browser_apis`  | List all browser APIs in the registry        |
| `get_browser_api`    | Fetch a specific browser API                 |
| `list_recipes`       | List all performance recipes                 |
| `get_recipe`         | Fetch a specific recipe                      |
| `search`             | Full-text search across the knowledge base   |
| `system_diagnostics` | Health report of the MCP server and registry |
| `performance_audit`  | Run AST-based performance analysis on code   |

## Available Resources

| URI                               | Description              |
| --------------------------------- | ------------------------ |
| `performance://experiments/{id}`  | Full experiment manifest |
| `performance://browser-apis/{id}` | Browser API details      |
| `performance://recipes/{id}`      | Recipe details           |
| `performance://checklists/{id}`   | Performance checklists   |

## Available Prompts

| Prompt               | Description                                           |
| -------------------- | ----------------------------------------------------- |
| `review_performance` | Ask the AI to review your code against lab guidelines |

## Quick Test

```bash
npm run mcp:start
```

If the server starts without errors, it is ready. Test connectivity with the [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npx @modelcontextprotocol/inspector npx tsx /absolute/path/to/mcp/server.ts
```
