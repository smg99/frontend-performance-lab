# Project Summary: Frontend Performance Lab

## Purpose

An AI-powered performance engine for modern frontend teams. It statically detects performance bottlenecks (like layout thrashing, memory leaks, and forced synchronous layouts) using an AST-based analyzer, and exposes a specialized knowledge graph to AI coding assistants (like Claude, Cursor, Windsurf) via the Model Context Protocol (MCP).

## Tech Stack & Tooling

- **Frameworks:** Nuxt 4, Vue 3, Vue Router
- **Languages:** TypeScript, Node.js
- **Build Tools:** Nuxt CLI, Vite, PostCSS, TailwindCSS, Babel, TSX
- **Testing:** Vitest, Playwright, Vue Test Utils
- **Performance Tooling:** Custom Babel AST Performance Analyzer
- **Package Manager:** npm (utilizing npm workspaces)
- **Deployment Strategy:** Vercel (indicated by `vercel.json`), with GitHub Actions for CI/CD and npm package publishing (`publish.yml`).
