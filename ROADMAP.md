# Roadmap

## ✅ Phase 1: Foundation (Complete)

- [x] Initial Nuxt Application
- [x] Educational Framework UI (`LearningSummaryCard`)
- [x] Shared TypeScript Schemas
- [x] Content Extraction & Decoupling
- [x] MCP Server Implementation
- [x] Design System & Component Library
- [x] AST Analyzer Engine (4 rules)
- [x] CI/CD Pipeline (lint, typecheck, test, build, validate)

## 🔄 Phase 2: Knowledge Expansion (In Progress)

- [x] Search Engine
- [x] Browser API Registry (IntersectionObserver, rAF, Web Workers, ResizeObserver, requestIdleCallback)
- [x] Recipes (Large Data Table, Dashboard Rendering, Background Processing, Layout Thrashing, Memory Leaks)
- [ ] Add 10+ performance experiments (currently 5)
- [ ] Cross-file ProjectGraph AST analysis

## 📋 Phase 3: Monorepo Migration

- [ ] Convert repository to `npm workspaces`
- [ ] Move UI to `apps/web`
- [ ] Split `shared/` into `packages/content`, `packages/core`, and `packages/shared-types`
- [ ] Extract `benchmark-engine` into a dedicated package

_Trigger: when experiment count exceeds 20_

## 🌐 Phase 4: Multi-Framework & Hosted MCP

- [ ] Create `apps/docs` (Documentation site)
- [ ] Implement `examples/react` and `examples/angular`
- [ ] Hosted MCP endpoint via SSE (knowledge graph only — no local file access)

---

Want to help? Check out issues labeled [`good first issue`](https://github.com/smg99/frontend-performance-lab/labels/good%20first%20issue) or read the [Contributing Guide](./CONTRIBUTING.md).
