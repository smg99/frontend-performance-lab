# GitHub Copilot Instructions for Frontend Performance Lab (FPL)

## Project Context

Frontend Performance Lab (FPL) is an AI-powered frontend performance analysis platform.

Always prioritize correctness, maintainability, explainability, and measurable performance improvements over clever implementations.

Refer to `AI_CONTEXT.md` for the overall project vision and engineering philosophy.

---

# General Principles

- Understand the existing architecture before making changes.
- Reuse existing modules whenever possible.
- Avoid introducing duplicate logic.
- Keep changes incremental and focused.
- Preserve backward compatibility unless explicitly requested.
- Do not make unrelated refactors in the same change.

---

# Coding Standards

- Use TypeScript with strict typing.
- Never introduce `any` unless absolutely unavoidable.
- Prefer named exports.
- Prefer small, pure functions.
- Prefer early returns over nested conditionals.
- Keep functions focused on a single responsibility.
- Avoid unnecessary abstractions.

---

# Performance Guidelines

Always consider:

- unnecessary re-renders
- layout thrashing
- forced synchronous DOM reads
- expensive watchers
- large bundle size
- duplicated work
- unnecessary allocations

Prefer:

- requestAnimationFrame
- passive event listeners
- IntersectionObserver
- ResizeObserver
- lazy imports
- memoization where appropriate

---

# Architecture Rules

Before creating new code:

1. Search for existing implementations.
2. Extend existing abstractions instead of duplicating them.
3. Prefer composition over inheritance.
4. Keep packages loosely coupled.

---

# Testing

When adding functionality:

- Add or update tests whenever practical.
- Preserve existing behavior.
- Consider edge cases.
- Avoid brittle tests.

---

# Documentation

When introducing non-obvious logic:

- Explain **why**, not **what**.
- Keep comments concise.
- Update documentation if behavior changes.

---

# Pull Request Quality

Every change should be easy to review.

Prefer:

- small commits
- isolated changes
- descriptive names
- minimal side effects

---

# AI Expectations

When proposing code:

- Explain important trade-offs.
- Mention assumptions.
- Highlight potential risks.
- State confidence if uncertain.
- Suggest simpler alternatives when applicable.

Never guess API behavior if it can be inferred from the repository.

Always prefer repository conventions over generic examples.
