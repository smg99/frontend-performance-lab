# AI Context – Frontend Performance Lab (FPL)

## Project Mission

Frontend Performance Lab (FPL) is an AI-powered frontend performance analysis platform.

The primary objective is to help developers automatically detect, explain, prioritize, and fix frontend performance problems using measurable data instead of assumptions.

---

# Engineering Philosophy

Measure first.

Never optimize blindly.

Every recommendation should be backed by evidence.

Performance is a user experience problem before it is a technical problem.

Business impact matters as much as technical severity.

---

# Primary Goals

- Detect frontend performance issues automatically.
- Explain why the issue exists.
- Estimate user impact.
- Estimate business impact.
- Recommend fixes.
- Link every issue to reusable recipes.
- Make every recommendation explainable.

---

# Architecture Principles

Prefer reusable modules.

Avoid duplicated logic.

Prefer composition over inheritance.

Keep packages loosely coupled.

Every detector should have a single responsibility.

Prefer pure functions.

Favor deterministic outputs.

---

# Code Standards

TypeScript Strict Mode.

Avoid `any`.

Prefer early returns.

Keep functions small.

Avoid deep nesting.

Prefer named exports.

Use descriptive naming.

---

# Performance Principles

Never trigger unnecessary re-renders.

Avoid forced synchronous layouts.

Batch DOM writes.

Prefer passive listeners.

Prefer requestAnimationFrame.

Use ResizeObserver and IntersectionObserver where appropriate.

Lazy-load expensive features.

Minimize bundle size.

---

# AI Behaviour

When making changes:

1. Understand existing architecture first.
2. Reuse existing code whenever possible.
3. Avoid introducing duplicate abstractions.
4. Explain major design decisions.
5. Include confidence when uncertain.
6. Mention trade-offs.
7. Keep changes incremental.

---

# Preferred Workflow

Understand

↓

Plan

↓

Implement

↓

Test

↓

Explain

---

# Repository Priority

Correctness

↓

Maintainability

↓

Developer Experience

↓

Performance

↓

New Features

---

# Long-Term Vision

FPL should become the reference platform for AI-assisted frontend performance engineering.

Every detector, recipe, benchmark, experiment, and recommendation should be reusable by both humans and AI systems.
