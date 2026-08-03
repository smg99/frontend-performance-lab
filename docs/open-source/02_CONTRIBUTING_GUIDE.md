# Contributing Guide

## Principles

1. **Deterministic Rules Only**: Do not add rules that rely on heuristics or LLM inference inside the AST engine.
2. **Zero False Positives Priority**: A rule must be heavily scoped to prevent noise. We prefer false negatives over false positives.
3. **No Filesystem IO in the Engine**: The `AnalyzerEngine` must accept a string of source code and output data. Filesystem operations are restricted to `FileAccessService`.

## Pull Request Process

1. Ensure your code compiles (`npm run typecheck`).
2. Ensure linting passes (`npm run lint`).
3. Add tests for any new behavior (`npm run test`).
4. Write a descriptive PR title (Conventional Commits formatting preferred, e.g., `feat: add react-large-map rule`).
5. Reference any related issues in the PR body.

## Code of Conduct

Please read and follow `06_COMMUNITY_GUIDELINES.md` to keep our community safe and welcoming.
