# Diagnostics Registry

The Diagnostics Registry transforms internal AnalyzerEngine rule IDs into rich, human-friendly, educational diagnostic objects.

## Why is this separated from the AnalyzerEngine?

The `AnalyzerEngine`'s sole responsibility is **detection**. It operates on AST nodes, checks logic, and outputs simple violations (`ruleId`, `line`).
By keeping the engine decoupled from educational content, we ensure:

1. The engine remains lightweight, fast, and easy to test.
2. The educational content (the "Why", "Impact", and "How to Fix") can be updated without touching core AST traversal logic.
3. We can easily localize or tailor explanations for different audiences (e.g., junior vs. senior developers) in the future.

## How to add a new diagnostic

1. Create a new file in `shared/diagnostics/rules/` (e.g., `my-new-rule.ts`).
2. Define the diagnostic using the `DiagnosticDefinition` type.
3. Export it and add it to `DiagnosticsRegistry` in `shared/diagnostics/mapper.ts`.

## Required Metadata

Every diagnostic MUST contain the following fields:

- `id`: The exact rule ID emitted by the AST analyzer.
- `title`: A human-readable title.
- `category`: Grouping category (e.g., "DOM Performance").
- `severity`: high/medium/low
- `confidence`: high/medium/low
- `summary`: A 1-sentence overview.
- `why`: Detailed explanation of the underlying mechanism.
- `impact`: What happens if this is ignored.
- `howToVerify`: Steps to reproduce/prove the bottleneck using DevTools.
- `recommendedFix`: Explicit instructions on how to solve it.
- `references`: Array of URLs to authoritative sources (e.g., web.dev, React Docs).
- `framework`: The target framework (e.g., 'vue', 'react', 'vanilla').
- `ruleVersion`: API versioning.
