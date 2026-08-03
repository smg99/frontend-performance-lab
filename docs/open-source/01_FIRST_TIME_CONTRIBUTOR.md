# First Time Contributor Guide

Welcome to Frontend Performance Lab! If you've never contributed to open-source or to an MCP server before, you're in the right place.

## How to Get Started

1. **Fork & Clone:** Fork the repository on GitHub and clone it locally.
2. **Install Dependencies:** Run `npm install`. We use Node >= 18.
3. **Run the Tests:** Ensure your environment is set up correctly by running `npm run test`. You should see a sea of green.
4. **Understand the Architecture:** Read `03_ARCHITECTURE_OVERVIEW.md`.
5. **Pick an Issue:** Head to the GitHub issues tab and look for the `good first issue` label.

## Writing Your First AST Rule

The most impactful way to contribute is adding a new diagnostic rule:

1. Create a file in `shared/utils/analyzer/rules/`
2. Define the AST traversal logic.
3. Add the corresponding human-readable mapping in `shared/diagnostics/rules/`.
4. Register it in `shared/diagnostics/mapper.ts`.
5. Write a benchmark fixture in `test/fixtures/` and add the test to `test/unit/benchmark.test.ts`.

## Asking for Help

If you get stuck, jump into our GitHub Discussions or Discord. There are no stupid questions!
