# Implementation Order (Outside-In)

## The Sequence

1. **Vertical Slice 1**: MCP Tool Shell & Schema (Mocked)
2. **Vertical Slice 2**: In-Memory Source Analysis (AST Integration)
3. **Vertical Slice 3**: Secure Local File Reading
4. **Vertical Slice 4**: Recipe Mapping (Educational Context)
5. **Vertical Slice 5**: Polish (Errors, Telemetry, Docs)

## Reasoning

We are adopting an **Outside-In strategy**, optimizing for rapid feedback and demonstrable customer value. By starting at the interface boundary (the MCP server), we prove the IDE-to-Server communication first.

This approach ensures that after _every single slice_, we have a working, releasable piece of software. If the sprint is cut short, the user still gets a functional tool (even if it requires pasting code, or lacks educational recipes), rather than a bunch of perfectly tested but disconnected internal utilities.

---

## Risk Register

### Slice 1: MCP Tool Shell & Schema

- **Technical Risks**: Zod schema incompatibilities causing the IDE client to reject the tool.
- **Rollback Strategy**: Remove tool registration from `mcp/server.ts`.
- **Dependencies**: None.

### Slice 2: In-Memory Source Analysis

- **Technical Risks**: The AST analyzer taking too long to parse complex strings, causing the MCP request to timeout.
- **Rollback Strategy**: Revert to the mocked data from Slice 1.
- **Dependencies**: Slice 1, `@babel/traverse` existing logic.

### Slice 3: Secure Local File Reading

- **Technical Risks**: Path traversal vulnerabilities (`../`); reading massive files leading to OOM crashes.
- **Rollback Strategy**: Disable the `path` param and revert to only `sourceCode` (Slice 2).
- **Dependencies**: Slices 1 and 2.

### Slice 4: Recipe Mapping

- **Technical Risks**: Schema drift between AST output and Registry IDs causing silent failures in mapping.
- **Rollback Strategy**: Strip the mapping layer, return raw violations.
- **Dependencies**: Slices 1, 2, and 3.

### Slice 5: Polish

- **Technical Risks**: Telemetry/logging slowing down the critical path of the tool.
- **Rollback Strategy**: Revert telemetry or error handling changes.
- **Dependencies**: Slices 1, 2, 3, and 4.
