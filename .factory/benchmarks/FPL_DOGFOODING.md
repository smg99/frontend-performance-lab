# FPL Dogfooding Benchmarks

## Slice 1: MCP Tool Shell

- **Date:** 2026-08-03
- **Task:** Introduce `performance_audit` MCP tool shell with mock data.
- **Time:** ~15 mins
- **Commands Used:** `replace_file_content`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test`
- **Pain Points:** Zod schema syntax requires careful handling within the MCP framework.
- **Ideas:** The mock data could be dynamically generated to cycle through different performance issues for more realistic IDE integration testing.

## Slice 2: In-Memory Source Analysis

- **Date:** 2026-08-03
- **Task:** Replaced mocked performance_audit data with actual AST analyzer for in-memory strings.
- **Time:** ~15 mins
- **Commands Used:** `replace_file_content`, `multi_replace_file_content`, `write_to_file`
- **Pain Points:** Needed to refactor the logic into `shared/mcp/core.ts` to make it easily testable.
- **Ideas:** The AST rule detection could map the rule IDs directly to recipes inside `mcpCore`, preparing for Slice 4.

## Slice 3: Secure Workspace File Analysis

- **Date:** 2026-08-03
- **Task:** Upgraded performance_audit to support reading files directly via the `path` argument.
- **Time:** ~10 mins
- **Commands Used:** `write_to_file`, `replace_file_content`, `run_command`
- **Pain Points:** Needed to ensure that the file reading logic was cleanly separated from the MCP handler and the AST analyzer to preserve security invariants.
- **Ideas:** FileAccessService could be extended later to provide directory traversal or glob searching if we want bulk auditing.
