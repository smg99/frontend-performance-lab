# Architectural Decisions

This document records all significant technical and architectural choices made in the project.

---

## 1. Why Nuxt 3 / Vue 3

**Context:** Need a robust full-stack framework with SSR capabilities for SEO and performance.
**Decision:** Selected Nuxt 3.
**Alternatives Considered:** Next.js (React), SvelteKit.
**Reason:** The primary maintainer's expertise and the excellent Vue ecosystem for building lightweight performance experiments.
**Tradeoffs:** Analyzer AST parsing had to be explicitly designed to be framework agnostic rather than locking into Vue.

## 2. Why Monaco Editor

**Context:** Needed a professional IDE-like code editor for the Analyzer Phase 1.
**Decision:** Selected `@guolao/vue-monaco-editor`.
**Alternatives Considered:** CodeMirror, basic textarea.
**Reason:** Unmatched syntax highlighting, folding, minimap, and developer familiarity out-of-the-box.
**Tradeoffs:** Large bundle size. Must be client-only rendered to avoid SSR crashes.

## 3. Why Framework-Agnostic Analyzer

**Context:** We need to parse Vue, React, and Vanilla JS for performance bugs.
**Decision:** The Analyzer core (`shared/utils/analyzer`) accepts raw ASTs and uses visitor patterns rather than relying on Vue-specific compilers everywhere.
**Alternatives Considered:** Vue-only analyzer.
**Reason:** Broadens the target audience.
**Tradeoffs:** Requires maintaining multiple parsers (Babel for React/JS, Vue compiler for `.vue`).

## 4. Why MCP stdio

**Context:** How should the AI assistant communicate with the MCP server?
**Decision:** Standard `stdio`.
**Alternatives Considered:** SSE (Server-Sent Events) over HTTP.
**Reason:** Stdio is the default, most native, and lowest-latency transport for local agents like Cursor or Claude Code.
**Tradeoffs:** Requires the server to run as a child process rather than a standalone daemon easily queried by the browser.

## 5. Why Pure CSS Animations (Timeline)

**Context:** The Analyzer pipeline needed an animated visualization.
**Decision:** Used pure CSS keyframes and transitions.
**Alternatives Considered:** Framer Motion, GSAP.
**Reason:** We are a performance lab; adding heavy JS animation libraries contradicts our core mission of keeping the main thread free.
**Tradeoffs:** Slightly more verbose CSS configuration.

# Architectural Decisions

This document summarizes the key architectural choices made during the development of this project.

## Why No Monorepo Yet?

While the long-term vision requires a monorepo (npm workspaces, multiple apps, multiple packages), introducing it immediately would hinder rapid iteration and contributor onboarding. Instead, we use a modular single-project architecture with strict path aliases (`@shared`, `@content`) that perfectly mimics a monorepo, allowing for a seamless migration later. The migration path is documented in [ARCHITECTURE.md](./ARCHITECTURE.md#future-monorepo-migration).

## Why a Manual Registry?

For a project with < 50 experiments, writing a CLI script to auto-generate the registry introduces unnecessary build complexity. A manual `shared/registry/index.ts` is simple, explicit, and easy to debug. This decision will be revisited when the experiment count exceeds 20.

## Why Framework-Independent Content?

Educational data must survive frontend framework rewrites. By keeping all content in `shared/content/` as pure TypeScript objects, we can easily build a React, Angular, or Astro frontend in the future without re-writing the knowledge base.

## Why MCP?

The Model Context Protocol (MCP) transforms this project from a standard web app into an AI-first knowledge platform. By exposing an MCP server, developers can connect their IDEs (Cursor, VS Code) to this project and their AI assistant will instantly understand how to write highly performant frontend code based on our curated guidelines.
