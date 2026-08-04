# Troubleshooting Guide

Find solutions to common issues encountered while setting up or using the Frontend Performance Lab.

---

## 1. Node & npm

### Symptom: `SyntaxError` or `Unexpected token` when running commands

**Cause:** You are using an outdated version of Node.js that does not support modern ES modules or syntax.
**Solution:** Upgrade to Node 18.x or higher. We recommend using `nvm`:

```bash
nvm install 22
nvm use 22
```

**Verification:** Run `node -v` to ensure it outputs `>= 18.0.0`.

### Symptom: `npm install` fails with peer dependency errors

**Cause:** Conflicting dependency trees, often related to Vue or Nuxt versions.
**Solution:** Run `npm install --legacy-peer-deps`.

---

## 2. MCP Server & Connectivity

### Symptom: Cursor/VS Code says "Disconnected" or fails to start the server

**Cause 1:** The path to `mcp/server.ts` is incorrect or relative.
**Solution 1:** Ensure you use the absolute, fully qualified path to the repository in your configuration.

**Cause 2:** You forgot to run `npm install` inside the lab repository.
**Solution 2:** Navigate to the repo and run `npm install`.

**Cause 3:** `tsx` is not installed globally or locally.
**Solution 3:** Our recommended command uses `npx tsx mcp/server.ts` to ensure it fetches the runner automatically.

**Verification:**
Run the official inspector tool in your terminal to see if the server crashes on boot:

```bash
npx @modelcontextprotocol/inspector npx tsx /absolute/path/to/mcp/server.ts
```

---

## 3. Analyzer & Monaco UI

### Symptom: "Failed to parse JS/TS/JSX" inside the Analyzer UI

**Cause:** The Monaco editor is passing syntactically invalid code to the AST parser, or you are pasting Vue SFCs into a plain JS parser.
**Solution:** Ensure the dropdown in the UI matches the language of the code you pasted (e.g., select `vue` for `<template>` code).

### Symptom: Monaco Editor does not render, page is blank

**Cause:** SSR (Server-Side Rendering) mismatch. Monaco relies heavily on browser DOM APIs and cannot be rendered on the server.
**Solution:** Ensure the `<CodeEditor>` component is wrapped in `<ClientOnly>` inside your Vue files.

---

## 4. Nuxt, Build, & Deployment

### Symptom: `npm run build` fails with typecheck errors

**Cause:** Strict TypeScript checks are failing (`vue-tsc --noEmit`).
**Solution:** Run `npm run typecheck` locally to see the exact errors. Fix the types in the `shared/` directory.

### Symptom: GitHub Pages deployed site shows a blank page

**Cause:** GitHub Pages requires static generation, but the app might be trying to run SSR features.
**Solution:** Ensure you are running `npm run generate` instead of `npm run build`, and that `ssr: false` is configured in `nuxt.config.ts` if targeting pure static hosting. _(Note: The MCP Hub UI is currently designed for Nuxt dynamic routing)._

---

> If your issue is not listed here, please open an Issue on GitHub with the exact error output and steps to reproduce.
