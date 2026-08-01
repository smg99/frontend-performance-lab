# Architectural Decisions

This document summarizes the key architectural choices made during the development of this project.

## Why No Monorepo Yet?
While the long-term vision requires a monorepo (npm workspaces, multiple apps, multiple packages), introducing it immediately would hinder rapid iteration and contributor onboarding. Instead, we use a modular single-project architecture with strict path aliases (`@shared`, `@content`) that perfectly mimics a monorepo, allowing for a seamless migration later. (See ADR 001).

## Why a Manual Registry?
For a project with < 50 experiments, writing a CLI script to auto-generate the registry introduces unnecessary build complexity. A manual `shared/registry/index.ts` is simple, explicit, and easy to debug. (See ADR 002).

## Why Framework-Independent Content?
Educational data must survive frontend framework rewrites. By keeping all content in `shared/content/` as pure TypeScript objects, we can easily build a React, Angular, or Astro frontend in the future without re-writing the knowledge base.

## Why MCP?
The Model Context Protocol (MCP) transforms this project from a standard web app into an AI-first knowledge platform. By exposing an MCP server, developers can connect their IDEs (Cursor, VS Code) to this project and their AI assistant will instantly understand how to write highly performant frontend code based on our curated guidelines.
