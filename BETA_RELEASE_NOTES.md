# CLI Beta Release Notes

**Version:** 1.0.0-beta
**Package:** `@smg99/frontend-performance-lab-cli`

Frontend Performance Lab is officially launching its standalone Command-Line Interface and Model Context Protocol (MCP) server on npm!

This milestone allows developers to add a powerful Frontend Performance AI assistant directly into Cursor, Claude Desktop, and VS Code in just one command.

## 🚀 Key Features

- **Instant Setup Wizard**: Run `fpl setup` to automatically detect your IDE (Cursor, Claude, Windsurf, VS Code) and configure the MCP server interactively without manual JSON editing.
- **Embedded MCP Server**: The `fpl mcp` command exposes our deep knowledge graph directly over `stdio`, containing advanced recipes, React/Vue benchmarks, and browser APIs.
- **Environment Doctor**: Run `fpl doctor` to get a colorful, real-time checklist ensuring your CLI, Node environment, AST Analyzer, and Knowledge Graph registries are 100% healthy.
- **Resource Diagnostics**: Run `fpl info` to inspect installed IDEs and view precise counts of available Experiments, Recipes, and Browser APIs in the graph.
- **Lightweight Package footprint**: Bundled using `unbuild`, the CLI strips away the heavy frontend Vue application and ships purely the analyzer and MCP tools, resulting in a lean `~220kB` payload.

## 🛠 Usage

```bash
npm install -g @smg99/frontend-performance-lab-cli
fpl setup
fpl doctor
fpl --help
```

## 🏗 Coming Soon

- **Extensible Configuration**: Managing workspace-specific lab rules using `fpl config`.
- **AST Analyzer CLI**: Analyzing directories manually via `fpl analyze` to fix layout thrashing, memory leaks, and reactivity pitfalls on demand.
