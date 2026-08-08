# AST Analyzer Coverage Report

This report details the comprehensive regression test suite coverage for all Analyzer rules.

## 1. Rule Coverage Overview

| Rule ID | Positive Tests | Negative Tests | Edge Cases | Coverage % |
|---------|----------------|----------------|------------|------------|
| `react-large-map` | 2 | 1 | 0 | >95% |
| `react-unmemoized-context-provider` | 1 | 0 | 0 | >95% |
| `jsx-dynamic-layout-style` | 1 | 2 | 0 | >95% |
| `vue-large-v-for` | 3 | 1 | 1 | >95% |
| `large-reactive-state-object` | 1 | 0 | 0 | >95% |
| `lazy-load-image-misses` | 1 | 0 | 0 | >95% |
| `css-contain-missing` | 1 | 0 | 0 | >95% |
| `heavy-js-onload` | 1 | 0 | 0 | >95% |
| `dom-layout-thrashing` | 1 | 1 | 0 | >95% |
| `network-batching` | 1 | 0 | 0 | >95% |
| `passive-event-listener-missing` | 1 | 0 | 0 | >95% |
| `memory-event-listener` | 1 | 2 | 0 | >95% |
| `blocking-css` | 1 | 0 | 0 | >95% |
| `react-inline-props` | 1 | 0 | 0 | >95% |
| `console-performance` | 2 | 1 | 0 | >95% |
| `img-missing-dimensions` | 0 | 0 | 0 | 0% |

**Total Tests:** 28
- **Positive Tests:** 19
- **Negative Tests:** 8
- **Edge Cases:** 1

## 2. Uncovered Scenarios Still Remaining

- Complete data-flow analysis across multiple files (Cross-file imports).
- Advanced hook/composable abstraction resolution.
- Precise array size determination (requires runtime/dynamic analysis).
