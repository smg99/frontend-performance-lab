# Good First Issues

Looking to contribute? Here are ideas for "Good First Issues" that require minimal architectural knowledge:

1. **New Rule: React Inline Function Props**
   - Add a rule to detect `onClick={() => doSomething()}` as it breaks `React.memo()`.
2. **New Rule: Vue Missing `key` in `v-for`**
   - We already detect large `v-for` lists, but detecting missing `:key` is an easy AST check.
3. **Docs: Typo Fixes in Diagnostics**
   - Review `shared/diagnostics/rules/` for grammatical errors.
4. **Tests: Add more fixtures**
   - Expand `test/fixtures/` with edge-case component structures to harden the parser.
