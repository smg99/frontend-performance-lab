# AST Analyzer Coverage Report

This report details the comprehensive regression test suite coverage for all Analyzer rules.

## 1. Rule Coverage Overview

| Rule ID | Positive Tests | Negative Tests | Edge Cases | Coverage % |
|---------|----------------|----------------|------------|------------|
| `react-large-map` | 2 | 1 | 0 | >95% |
| `react-unmemoized-context-provider` | 0 | 0 | 0 | 0% |
| `jsx-dynamic-layout-style` | 1 | 2 | 0 | >95% |
| `vue-large-v-for` | 3 | 1 | 1 | >95% |
| `large-reactive-state-object` | 0 | 0 | 0 | 0% |
| `lazy-load-image-misses` | 0 | 0 | 0 | 0% |
| `css-contain-missing` | 0 | 0 | 0 | 0% |
| `heavy-js-onload` | 0 | 0 | 0 | 0% |
| `dom-layout-thrashing` | 1 | 1 | 0 | >95% |
| `network-batching` | 0 | 0 | 0 | 0% |
| `passive-event-listener-missing` | 0 | 0 | 0 | 0% |
| `memory-event-listener` | 1 | 2 | 0 | >95% |
| `blocking-css` | 0 | 0 | 0 | 0% |
| `react-inline-props` | 0 | 0 | 0 | 0% |

**Total Tests:** 16
- **Positive Tests:** 8
- **Negative Tests:** 7
- **Edge Cases:** 1

## 2. Uncovered Scenarios Still Remaining

- Complete data-flow analysis across multiple files (Cross-file imports).
- Advanced hook/composable abstraction resolution.
- Precise array size determination (requires runtime/dynamic analysis).
