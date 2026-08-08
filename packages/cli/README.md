# Frontend Performance Lab CLI

The official CLI and MCP Server for **Frontend Performance Lab**.

Configure AI assistants like **Cursor**, **Claude Desktop**, **VS Code (Roo/Cline)**, **Windsurf**, and other MCP‑compatible clients in minutes.

---

### Badges

[![npm version](https://img.shields.io/npm/v/@smg99/frontend-performance-lab-cli.svg?style=flat-square)](https://www.npmjs.com/package/@smg99/frontend-performance-lab-cli)
[![npm downloads](https://img.shields.io/npm/dm/@smg99/frontend-performance-lab-cli.svg?style=flat-square)](https://www.npmjs.com/package/@smg99/frontend-performance-lab-cli)
[![license](https://img.shields.io/npm/l/@smg99/frontend-performance-lab-cli.svg?style=flat-square)](https://github.com/smg99/frontend-performance-lab/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/smg99/frontend-performance-lab.svg?style=flat-square)](https://github.com/smg99/frontend-performance-lab/stargazers)

---

```bash
npm install -g @smg99/frontend-performance-lab-cli
```

Supported platforms: **Node 22+** on macOS, Windows, and Linux.

---

## Two‑Minute Quick Start

### 1️⃣ Install (if you haven’t already)

```bash
npm install -g @smg99/frontend-performance-lab-cli
```

⬇️

### 2️⃣ Configure your IDE

```bash
fpl setup
```

⬇️

> **TIP**
> `fpl setup` automatically detects and configures supported AI assistants (Cursor, Claude Desktop, VS Code, Windsurf, Gemini CLI). No manual steps needed.

### 3️⃣ Restart your IDE

_(Most IDEs pick up the changes on the next launch.)_

⬇️

### 4️⃣ Verify the installation

```bash
fpl doctor
```

---

## Verify Installation

When everything is wired correctly you’ll see output similar to:

```
✔ CLI Installed
✔ Node Compatible
✔ MCP Ready
✔ Analyzer Ready
✔ Knowledge Graph Loaded

Environment is 100% healthy!
```

If any step fails, the message will point you to the missing prerequisite.

---

## Available Commands

| Command       | Description                                                         |
| ------------- | ------------------------------------------------------------------- |
| `fpl setup`   | Interactive wizard that configures supported IDEs and AI assistants |
| `fpl doctor`  | Runs health checks and prints a concise status report               |
| `fpl info`    | Shows environment details (Node version, installed plugins, etc.)   |
| `fpl config`  | Manage CLI and MCP configuration settings                           |
| `fpl mcp`     | Starts the MCP server (stdio transport)                             |
| `fpl analyze` | Analyze code from the terminal                                      |

---

## Supported Clients

- **Cursor**
- **Claude Desktop**
- **VS Code** (Roo/Cline)
- **Windsurf**
- **Gemini CLI**
- _Any MCP‑compatible client_ – the CLI follows the Model Context Protocol, so any tool that implements MCP can talk to it.

---

## What You Get

- ✅ Interactive CLI with guided setup
- ✅ Built‑in MCP server for seamless AI integration
- ✅ Curated **Frontend Performance Knowledge Graph**
- ✅ Browser API reference & performance‑focused recipes
- ✅ Interactive experiments & AST analyzer

---

## Documentation

- 📚 **GitHub Repository** – <https://github.com/smg99/frontend-performance-lab>
- 🐞 **Issues** – <https://github.com/smg99/frontend-performance-lab/issues>
- 💬 **Discussions** – <https://github.com/smg99/frontend-performance-lab/discussions>
- 🌐 **Website / Docs** – <https://smg99.github.io/frontend-performance-lab>

---

## Roadmap (Beta)

**Current** – CLI, MCP server, knowledge graph, browser APIs, recipes, interactive experiments.

**Coming Soon**

- VS Code extension
- ESLint plugin
- Additional analyzer rules and performance metrics

---

## Contributing

We love contributions! If you’d like to help, please read our [contributing guide](https://github.com/smg99/frontend-performance-lab/blob/main/CONTRIBUTING.md) and open a PR or issue.

---

## License

MIT © [Sumit Gajjar](https://github.com/smg99)
