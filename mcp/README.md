# Frontend Performance Lab MCP Server

This directory contains the Model Context Protocol (MCP) server for the Frontend Performance Lab.
It allows AI coding assistants (like Cursor, Claude Code, and VS Code MCP clients) to directly query our highly-curated frontend performance guidelines, architectural patterns, and code examples.

## Installation

Ensure you have installed the root project dependencies:
```bash
npm install
```

## Configuration

To add this server to an MCP-compatible IDE (e.g., Cursor or Claude Desktop), add the following configuration:

```json
{
  "mcpServers": {
    "frontend-performance-lab": {
      "command": "npm",
      "args": ["run", "mcp:start"]
    }
  }
}
```

## Available Tools

AI agents can execute these tools to lookup information:

- **`search`**: Search the knowledge base.
  - *Example Args*: `{ "query": "layout thrashing", "limit": 3 }`
- **`list_experiments`**: Discover what topics are available.
- **`get_experiment`**: Fetch a specific topic. Supports partial retrieval to save token context.
  - *Example Args*: `{ "id": "reactivity", "section": "examples" }`

## Available Resources

Static URIs that can be directly read by agents or users:

- `performance://experiments/virtualization`
- `performance://experiments/reactivity`
- `performance://checklists/vue`

## Available Prompts

Built-in developer workflows:

- **`review_performance`**: Triggers the AI to review your current open files against the lab's performance guidelines.

## Example Response Format

All tool responses include standard metadata:

```json
{
  "_metadata": {
    "source": "Frontend Performance Lab",
    "version": "1.0.0",
    "lastUpdated": "2024-03-01T12:00:00Z"
  },
  "data": { ... }
}
```
