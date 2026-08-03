# MVP Implementation Plan: MCP AST Performance Analyzer Tool

## Executive Summary

Frontend Performance Lab's current MCP server exposes the knowledge graph (recipes, experiments, APIs), but relies on the AI to manually parse and understand a user's code. This MVP implements `analyze_file_performance` as an MCP tool, bridging the custom Babel AST Analyzer directly to the IDE. This allows the AI assistant to instantly run static performance analysis on local files and receive deterministic, high-confidence bottlenecks mapped to FPL recipes.

## Business Value

This is the ultimate "wow moment." Instead of a generic AI hallucinating performance advice, the AI utilizes our specialized AST engine to statically prove layout thrashing or reactivity loops exist, delivering expert-level diagnostics in seconds. It eliminates the friction of copy-pasting code into web dashboards.

## Architecture Impact

- **MCP Layer:** Adds a new tool `analyze_file_performance` to the stdio server.
- **Analyzer Layer:** Updates the AST analyzer to accept local file paths, parse them via `fs`, and return structured JSON reports instead of just console outputs or web UI bindings.
- **Registry Layer:** Maps the analyzer's violation IDs to the `shared/registry` recipes for auto-remediation suggestions.

## Components Affected

- `mcp/server.ts`
- `shared/utils/analyzer/index.ts`
- `shared/registry/index.ts`

## Files Likely Affected

- `mcp/server.ts`
- `shared/utils/analyzer/parser.ts` (or equivalent file handling AST traversal)
- `shared/schemas/analyzer.ts` (defining the MCP response payload)
- `test/mcp/analyzer.test.ts` (new tests)

## Testing Strategy

- **Unit Tests:** Mock file system inputs to the analyzer and verify the AST correctly flags a forced synchronous layout and a missing React `useMemo`/Vue `computed`.
- **Integration Tests:** Spin up the MCP server programmatically and send an `analyze_file_performance` JSON-RPC request to ensure the response correctly maps to a known recipe.

## Demo Scenario

1. Developer installs FPL and connects their IDE (e.g., Cursor).
2. Developer opens `HeavyList.vue` containing a deep, unoptimized watcher and inline object allocations.
3. Developer asks the AI: "Audit this file for performance."
4. The AI calls `analyze_file_performance({ path: 'HeavyList.vue' })`.
5. The tool returns the exact lines causing reactivity overhead, mapped to FPL Recipe #12 ("Optimizing Large List Reactivity").
6. The AI explains the issue and writes the optimized code. Total time: 10 seconds.

## Acceptance Criteria

- [ ] `analyze_file_performance` is registered in the MCP server.
- [ ] Tool accepts an absolute file path and returns structured JSON (lines, violation type, severity, linked recipes).
- [ ] Tool correctly parses `.vue`, `.jsx`, and `.tsx` files.
- [ ] E2E tests pass for at least two major anti-patterns (e.g., forced layout, render loop).

## Risk Analysis

- **Security:** Allowing the MCP server to read arbitrary files from disk could be a path traversal risk. **Mitigation:** Restrict the tool to only read files within the active workspace directory.
- **Performance:** Parsing massive JS bundles could crash the MCP server (OOM). **Mitigation:** Set a strict file size limit (e.g., max 1MB per file).

## Out of Scope

- Auto-fixing the AST directly (the AI assistant will handle generating the fix using the tool's output).
- Adding new AST rules (we will use the existing ones for the MVP).
- Web UI updates for the analyzer dashboard.

## Estimated Effort

- 1 Sprint (approx. 5-7 developer days).
