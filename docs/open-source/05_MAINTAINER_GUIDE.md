# Maintainer Guide

As an FPL maintainer, your job is to enforce stability.

## PR Reviews

- Reject PRs that try to implement heuristic "guessing" in the AST engine.
- Require robust test cases for every new rule. If a PR adds a rule without a fixture, ask for one.
- Protect the `core.ts` abstractions. Do not let AST logic bleed into the MCP layer.

## Issue Triage

- Label issues diligently (see `07_GITHUB_LABELS.md`).
- Acknowledge all bug reports within 48 hours.
- For false positives, ask the reporter to provide the snippet of code that triggered it.
