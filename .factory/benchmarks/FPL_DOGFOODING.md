# FPL Dogfooding Benchmarks

## Slice 1: MCP Tool Shell

- **Date:** 2026-08-03
- **Task:** Introduce `performance_audit` MCP tool shell with mock data.
- **Time:** ~15 mins
- **Commands Used:** `replace_file_content`, `npm run lint`, `npm run typecheck`, `npm run build`, `npm run test`
- **Pain Points:** Zod schema syntax requires careful handling within the MCP framework.
- **Ideas:** The mock data could be dynamically generated to cycle through different performance issues for more realistic IDE integration testing.
