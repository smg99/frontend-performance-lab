<div align="center">
  <h1>🔬 Frontend Performance Lab</h1>
  <p><strong>The Definitive Interactive Engineering Playground for Browser Internals & AI Assistance</strong></p>

  <p>
    <a href="https://github.com/smg99/frontend-performance-lab/actions"><img src="https://img.shields.io/github/actions/workflow/status/smg99/frontend-performance-lab/ci.yml?branch=main&label=Build&style=for-the-badge" alt="Build Status" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Coverage->94%25-brightgreen.svg?style=for-the-badge" alt="Coverage" /></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge" alt="License" /></a>
    <a href="#"><img src="https://img.shields.io/badge/Node->=18.0.0-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node Version" /></a>
    <a href="https://nuxt.com/"><img src="https://img.shields.io/badge/Nuxt-4.x-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white" alt="Nuxt Version" /></a>
    <a href="./mcp"><img src="https://img.shields.io/badge/MCP-Ready-8A2BE2?style=for-the-badge&logo=ai&logoColor=white" alt="MCP Ready" /></a>
  </p>
</div>

---

## 📖 Project Overview

Modern frontend development is abstracted behind layers of frameworks. Developers often don't realize when they trigger forced synchronous layouts, memory leaks, or main-thread blocking operations until their Lighthouse score crashes. 

**Frontend Performance Lab** exists to demystify the browser rendering pipeline. It provides a visual, interactive sandbox paired with a professional-grade AST analyzer to catch performance bugs *before* they hit production.

**Who It Is For:**
- **Frontend Beginners:** Looking to visually understand foundational concepts (e.g., layout thrashing vs. paint flashing).
- **Mid/Senior Engineers:** Needing a sandbox to experiment with virtualized lists, web workers, and AST-based performance reviews.
- **AI Coding Assistants:** Leveraging the **Model Context Protocol (MCP)** to bring deep diagnostic knowledge directly into the IDE.

---

## 🗺️ Product Tour

Take a look at what you can do with the Frontend Performance Lab. 

### 1. The Homepage
A premium SaaS-grade dashboard providing immediate access to the analyzer, recipes, and learning paths.
> ![Homepage Demo](docs/assets/homepage.gif)

### 2. AST Analyzer
Drag, drop, and analyze. A professional Monaco-powered workspace that scans your React and Vue code for layout thrashing, massive re-renders, and memory leaks.
> ![Analyzer Demo](docs/assets/analyzer.gif)

### 3. MCP Hub
Discover all available AI tools and prompts natively. The Hub bridges the gap between local tooling and your favorite AI IDEs.
> ![MCP Hub Demo](docs/assets/mcp-hub.gif)

### 4. MCP Install
Step-by-step guidance on connecting the AST Analyzer directly to Cursor, Claude Code, and Windsurf securely via local stdio.
> ![MCP Install Demo](docs/assets/mcp-install.gif)

### 5. Browser APIs
Educational breakdowns of modern, critical APIs like `requestAnimationFrame` and `IntersectionObserver`.
> ![Browser APIs Demo](docs/assets/browser-apis.gif)

### 6. Recipes
Structured tutorials for specific optimizations, directly combating the issues caught by our AST Analyzer.
> ![Recipes Demo](docs/assets/recipes.gif)

### 7. Interactive Experiments
Live, interactive Vue components demonstrating performance bottlenecks in real-time.
> ![Experiments Demo](docs/assets/experiments.gif)

---

## ⚡ 5-Minute Quick Start

### 1. Installation

You will need Node `18.x` or higher.

```bash
# Clone the repository
git clone https://github.com/smg99/frontend-performance-lab.git

# Enter the directory
cd frontend-performance-lab

# Install dependencies
npm install
```

### 2. Start the Development Server

To explore the UI, experiments, and the visual Analyzer:

```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Analyze Your First Component

1. Navigate to **Quick Actions -> Analyze Code** in the web dashboard.
2. Drag and drop any `.vue`, `.jsx`, or `.js` file into the editor.
3. Press `Cmd + Enter` to run the analysis.
4. Watch the pipeline timeline flag layout thrashing, massive DOM rendering, or memory leaks!

---

## 🤖 Install MCP (AI Assistant Integration)

Bring the power of the Frontend Performance Lab directly into **Cursor, Claude Code, Windsurf, or VS Code**.

**[Read the Full MCP Setup Guide](./docs/mcp/getting-started.md)**

### Local MCP Setup (Quick)

The MCP server runs locally to ensure it has secure, instantaneous access to your AST and filesystem.

1. Ensure you have cloned the repo and run `npm install`.
2. Grab the absolute path to your cloned repository.
3. Configure your IDE. For example, in **Cursor**, add a new MCP Server:
   - **Type:** `command`
   - **Command:** `npx tsx /absolute/path/to/frontend-performance-lab/mcp/server.ts`

### Supported IDEs
- **Cursor**
- **Claude Code CLI**
- **VS Code (via Cline/Roo)**
- **Windsurf**
- **Continue.dev**
- **Gemini CLI**

---

## 🏗️ Architecture

```mermaid
graph TD
    A[Browser / Developer] --> B(Nuxt 3 Frontend)
    C[AI Assistant / IDE] --> D(MCP Server - stdio)
    
    B --> E{Shared Core}
    D --> E
    
    E --> F[AST Analyzer Engine]
    E --> G[Knowledge Graph]
    E --> H[Browser API Registry]
    
    F --> I[(Local File System)]
```

*The core logic is completely shared between the Nuxt UI and the MCP Server, meaning your AI sees exactly what the web dashboard sees.*

---

## 📜 Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the Nuxt 3 frontend development server. |
| `npm run mcp:start` | Runs the MCP server in `stdio` mode for IDEs. |
| `npm run validate:analyzer` | Runs the Vitest regression suite and updates coverage. |
| `npm run test` | Runs the standard unit tests. |
| `npm run build` | Builds the Nuxt application for production. |
| `npm run lint` | Runs ESLint and Prettier formatting. |

---

## 🚀 Release Philosophy & Performance Goals

This is treated as a commercial-grade SaaS product, not just a demo.
- **Maintainability over speed:** Clean architecture and zero-duplication between MCP and UI.
- **Strict TDD:** Every bug fix in the AST analyzer must first be a regression test.
- **Performance SLA:** The analyzer guarantees execution in < 500ms for files up to 5,000 LOC.

---

## 🗺️ Roadmap

- **Phase 1 (Complete):** UI Design System, Core AST MVP, and MCP Hub.
- **Phase 2 (In Progress):** Cross-file ProjectGraph AST analysis.
- **Phase 3 (Coming Soon):** Visual Dependency Graphs and Performance Budget Gauges.
- **Hosted MCP (Future):** Support for `SSE` (Server-Sent Events) for remote AI clients.

---

## 🤝 Contributing & Licensing

We welcome contributions! Please follow our testing policy:
- No commits without matching regression tests.
- Verify `npm run validate:analyzer` passes.
- Adhere to the glassmorphic Tailwind design system.

**License**: MIT License. Created to push the boundaries of AI-assisted frontend engineering.
