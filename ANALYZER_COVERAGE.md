# AST Analyzer Coverage Report

This report guarantees the maturity, coverage, and performance limitations of the AST Engine.

## 1. Implemented Rules

| Rule ID | Title | Severity | Maturity | Supported Frameworks |
|---------|-------|----------|----------|----------------------|
| `vue-large-v-for` | Large v-for without Virtualization | Critical | Stable | vue, nuxt |
| `react-large-map` | Large .map() without Virtualization | Critical | Stable | react |
| `dom-layout-thrashing` | Layout Thrashing | Critical | Stable | vanilla, vue, react, nuxt |
| `memory-event-listener` | Global Event Listener Leak | Critical | Stable | vanilla, vue, react |

## 2. Fixture Coverage

- **good**: 4 fixtures
- **bad**: 4 fixtures
- **edge-cases**: 1 fixtures
- **real-world**: 1 fixtures
- **performance**: 4 fixtures

## 3. Performance SLA Baseline

- **< 500ms** total traversal and execution time guaranteed for file sizes up to **5,000 LOC**.
- Validated via strict Vitest benchmarking tests.

## 4. Known Limitations

- **Single-File Scope**: The AST engine currently does not resolve cross-file imports. It cannot trace variables passed between components.
- **Heuristic AST**: Some rules use structural heuristics (e.g., detecting '.map()' returning JSX) rather than full type-checking.
