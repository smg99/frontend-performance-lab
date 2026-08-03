# Performance Reporting

The `PerformanceReportBuilder` converts rich diagnostic arrays into deterministic, human-readable engineering markdown reports.

## Why is Reporting Separated?

The architecture decouples responsibilities:

1. **AnalyzerEngine**: Detects rule violations using AST logic.
2. **DiagnosticsMapper**: Maps bare rule IDs into rich educational definitions.
3. **PerformanceReportBuilder**: Aggregates diagnostics, sorts them, and formats them for human consumption.

By isolating reporting:

- We can easily unit test the markdown structure without needing an AST parser.
- Future LLM integrations can be fed a perfectly structured, deterministic report, reducing hallucination risk and focusing the AI solely on generating code fixes rather than explaining the problem.

## How to add sections

Modify `shared/reporting/builder.ts` to append new sections to the output markdown buffer. Be sure to add corresponding unit tests in `test/unit/reporting.test.ts`.
