# AST Analyzer Coverage Report

This report separates executable test coverage from fixture inventory. A fixture is not a test unless an executable test loads it and asserts the expected analyzer result.

## 1. Executable Rule Coverage

| Rule ID                             | Test file | Measured line coverage | Positive fixtures | Negative fixtures | Edge fixtures |
| ----------------------------------- | --------- | ---------------------: | ----------------: | ----------------: | ------------: |
| `react-large-map`                   | Yes       |                 95.12% |                 2 |                 1 |             0 |
| `react-unmemoized-context-provider` | Yes       |                 96.96% |                 3 |                 1 |             0 |
| `jsx-dynamic-layout-style`          | Yes       |                100.00% |                 1 |                 2 |             0 |
| `vue-large-v-for`                   | Yes       |                 80.43% |                 3 |                 1 |             1 |
| `large-reactive-state-object`       | Yes       |                 96.07% |                 4 |                 0 |             0 |
| `lazy-load-image-misses`            | Yes       |                100.00% |                 2 |                 0 |             0 |
| `css-contain-missing`               | Yes       |                 75.00% |                 2 |                 0 |             0 |
| `heavy-js-onload`                   | Yes       |                 95.29% |                 2 |                 0 |             0 |
| `dom-layout-thrashing`              | Yes       |                 81.69% |                 1 |                 1 |             0 |
| `network-batching`                  | Yes       |                 89.83% |                 2 |                 0 |             0 |
| `passive-event-listener-missing`    | Yes       |                 95.00% |                 1 |                 0 |             0 |
| `memory-event-listener`             | Yes       |                 91.37% |                 1 |                 2 |             0 |
| `blocking-css`                      | Yes       |                100.00% |                 2 |                 0 |             0 |
| `react-inline-props`                | Yes       |                 95.00% |                 1 |                 0 |             0 |
| `console-performance`               | Yes       |                100.00% |                 2 |                 1 |             0 |
| `img-missing-dimensions`            | Yes       |                 96.66% |                 0 |                 0 |             0 |

- **Registered rules:** 16
- **Rules with executable test files:** 16
- **Declared fixture files:** 39
  - Positive: 29
  - Negative: 9
  - Edge/handling: 1

## 2. Interpretation

- Measured line coverage comes from Vitest's V8 coverage output for the executable analyzer suite.
- Fixture counts are inventory only and make no accuracy or coverage claim.
- Precision and recall remain unmeasured until the versioned evaluation corpus is implemented.
- A rule test file does not by itself prove production accuracy; it only confirms that executable assertions exist.

## 3. Known Evaluation Gaps

- Some files named as positive fixtures are placeholders or do not currently trigger their associated rule.
- Complete data-flow analysis across multiple files (cross-file imports).
- Advanced hook/composable abstraction resolution.
- Precise array size determination where runtime data is required.
- Versioned real-project corpus with measured precision, recall and false-positive rate.
