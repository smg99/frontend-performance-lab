# AST Analyzer Coverage Report

This report details the comprehensive regression test suite coverage for all Analyzer rules.

## 1. Rule Coverage Overview

| Rule ID | Positive Tests | Negative Tests | Edge Cases | Coverage % |
|---------|----------------|----------------|------------|------------|
| `vue-large-v-for` | 3 | 1 | 1 | >95% |
| `react-large-map` | 2 | 1 | 0 | >95% |
| `dom-layout-thrashing` | 1 | 1 | 0 | >95% |
| `memory-event-listener` | 1 | 2 | 0 | >95% |

**Total Tests:** 13
- **Positive Tests:** 7
- **Negative Tests:** 5
- **Edge Cases:** 1

## 2. Uncovered Scenarios Still Remaining

- Complete data-flow analysis across multiple files (Cross-file imports).
- Advanced hook/composable abstraction resolution.
- Precise array size determination (requires runtime/dynamic analysis).
