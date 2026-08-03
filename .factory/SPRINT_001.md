# Sprint 001: MCP AST Performance Analyzer Tool (Outside-In)

## Sprint Goal

Deliver the `analyze_file_performance` MCP tool to production incrementally, optimizing for demonstrable customer value after every slice.

## Definition of Done

- Every slice leaves the product in a usable, releasable state.
- Every slice is demoable and passes CI tests.

---

## Vertical Slice 1: MCP Tool Shell & Schema

### Business Value

Proves IDE integration immediately. The AI assistant can discover and call the tool, establishing the contract and UX before any complex logic is built.

### Demo Scenario

Developer asks AI "Audit my component". The AI calls `analyze_file_performance` with a path. The AI receives a mocked response containing a deterministic layout thrashing violation, which the AI then explains to the developer.

### Acceptance Criteria

- `analyze_file_performance` tool is registered in `mcp/server.ts`.
- Tool accepts a Zod schema (`path` or `sourceCode`).
- Tool returns hardcoded, valid AST violation JSON.
- Tool is visible in the MCP `tools/list`.

### Rollback Strategy

Remove the tool registration from the MCP server.

### Tests

- Integration test checking if tool appears in `tools/list` and returns the expected mocked JSON schema.

---

## Vertical Slice 2: In-Memory Source Analysis

### Business Value

Validates that the AST analyzer can successfully process AI-provided code payloads without the risk of file system vulnerabilities or path resolution bugs.

### Demo Scenario

Developer pastes Vue code into the chat and asks "Is this fast?". The AI calls the tool, passing the source code string. The tool runs the real AST analyzer and returns genuine performance insights.

### Acceptance Criteria

- The tool accepts a `sourceCode` string parameter.
- The mock data is replaced by a direct call to the existing AST analyzer engine.
- Returns actual AST violations found in the provided string.

### Rollback Strategy

Revert the AST engine binding and return to the mocked data from Slice 1.

### Tests

- Unit test passing a known bad code string and expecting the correct AST violation ID.

---

## Vertical Slice 3: Secure Local File Reading

### Business Value

Eliminates the friction of copy-pasting code. The AI can autonomously read files directly from the workspace, dramatically improving developer experience.

### Demo Scenario

Developer opens `HeavyList.vue` and asks "Audit this file." The AI passes `{ path: "HeavyList.vue" }` to the tool. The server safely resolves the path, reads the file, and runs the AST analyzer, returning genuine local insights.

### Acceptance Criteria

- Tool accepts a `path` parameter instead of just `sourceCode`.
- Server strictly validates the path against the `WORKSPACE_ROOT`.
- Server enforces a file size limit (e.g., max 1MB).
- Valid files are read and passed to the AST analyzer.

### Rollback Strategy

Disable file reading and revert to accepting only `sourceCode` strings (revert to Slice 2).

### Tests

- Security tests: path traversal attempts (`../../`), reading excessively large files.
- Integration test: End-to-end analysis of a fixture file.

---

## Vertical Slice 4: Recipe Mapping

### Business Value

Elevates the tool from a mere bug finder to an educational platform. The AI doesn't just explain the issue; it links the developer directly to interactive FPL experiments and robust solutions.

### Demo Scenario

Following an audit, the AI's response includes "For a step-by-step fix, see FPL Recipe: Optimizing Large List Reactivity." The user gets a full educational payload alongside the code patch.

### Acceptance Criteria

- Analyzer violations are intercepted and mapped to `shared/registry` recipes.
- The final MCP JSON response includes both violations and their corresponding educational recipes.

### Rollback Strategy

Remove the mapping layer and return raw AST violations only.

### Tests

- Unit tests validating that specific AST violation IDs correctly resolve to existing registry recipes, and unknown IDs fallback gracefully.

---

## Vertical Slice 5: Polish & Production Readiness

### Business Value

Ensures long-term reliability and gives us visibility into how the tool performs in the wild.

### Demo Scenario

A user attempts to analyze an unsupported `.py` file. Instead of a silent failure, the AI gracefully responds: "I can only analyze Vue/React/JS files with FPL."

### Acceptance Criteria

- Comprehensive try/catch blocks translating internal errors into clean JSON-RPC errors.
- Basic telemetry/logging for tool execution duration and success rates.
- Documentation updated to include example prompts and tool capabilities.

### Rollback Strategy

Revert specific non-critical polish commits if they introduce unexpected regressions.

### Tests

- E2E tests simulating malformed JSON inputs, unsupported file types, and other edge cases.
