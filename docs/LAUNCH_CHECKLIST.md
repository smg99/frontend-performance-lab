# Launch Checklist

> Tracking document for all tasks required before the public open source launch of **Frontend Performance Lab**.
> Items are ordered by priority. Check off each item before announcing.

---

## 🔴 Blockers — Must complete before any public announcement

- [ ] **Recipes: Add layout-thrashing recipe** — `shared/content/recipes/dom-layout-thrashing/` mapping to the `dom-layout-thrashing` analyzer rule. Users who get this finding need a recipe to follow.
- [ ] **Recipes: Add memory-leak recipe** — `shared/content/recipes/memory-event-listener/` mapping to the `memory-event-listener` analyzer rule.
- [ ] **Issue Templates: Convert to YAML form** — Replace `bug_report.md` and `feature_request.md` with structured YAML templates. Add a dedicated **MCP Issue** template and a **New Experiment Request** template.
- [ ] **MCP docs: Fix conflicting install command** — `mcp/README.md` shows `npm run mcp:start` as the IDE command; `docs/mcp/getting-started.md` correctly uses the absolute `npx tsx` path. Slim `mcp/README.md` to a pointer to the full guide.
- [ ] **Live demo: Verify GitHub Pages URL** — Confirm `https://smg99.github.io/frontend-performance-lab` is live and not 404ing before the README badge goes public.

---

## 🟡 High Priority — Should complete before launch

- [ ] **README: Add one screenshot of the analyzer** — A single static PNG above the fold showing the Monaco editor + analyzer output dramatically improves conversion. Place in `docs/assets/analyzer-preview.png`.
- [ ] **GitHub Settings: Set repository description** — `Interactive performance playground for Vue & React — AST analyzer, live experiments, and MCP server for AI coding assistants.` (125 chars)
- [ ] **GitHub Settings: Set repository topics** — `vue nuxt typescript performance web-performance ast mcp model-context-protocol frontend devtools layout-thrashing memory-leaks`
- [ ] **GitHub Settings: Add social preview image** — Upload a 1280×640px hero image for link previews (Twitter, Slack, Discord).
- [ ] **Community: Enable GitHub Discussions** — Add a link to it in `SUPPORT.md` and README footer.
- [ ] **Community: Label existing issues** — Tag 3–5 open issues as `good first issue` before announcing publicly.
- [ ] **Docs: Standardize Node version** — `SUPPORT.md` says `>= 22.0.0`; `docs/mcp/getting-started.md` says `>= 18.x`; `docs/troubleshooting.md` says `>= 18.0.0`. Pick one and update all files.
- [ ] **Docs: Fix dead ADR references in `DECISIONS.md`** — Remove "(See ADR 001)" and "(See ADR 002)" or create `docs/adr/` stubs.
- [ ] **MCP docs: Update Available Tools list in `mcp/README.md`** — Currently lists 3 of 7 tools. Add: `list_browser_apis`, `get_browser_api`, `list_recipes`, `get_recipe`, `system_diagnostics`.
- [ ] **CI/CD: Unify Node version** — `gh-pages.yml` uses Node `20`; `ci.yml` uses Node `22`. Align to `22`.
- [ ] **Roadmap: Sync `ROADMAP.md` with README** — Mark Phase 1 as `✅ Complete`. Add contributor CTA linking to `CONTRIBUTING.md`.

---

## 🟠 Nice to Have — Improves quality, not blockers

- [ ] **Add `.nvmrc`** — Create `.nvmrc` with content `22` so contributors using `nvm` get the right Node version automatically.
- [ ] **Add `engines` to `package.json`** — `"engines": { "node": ">=18.0.0" }` makes the Node requirement machine-readable.
- [ ] **Browser APIs: Add `ResizeObserver`** — Explicitly promised in `PROJECT_PRINCIPLES.md`. Add `shared/content/browser-apis/resize-observer/`.
- [ ] **Browser APIs: Add `requestIdleCallback`** — Explicitly promised in `PROJECT_PRINCIPLES.md`. Add `shared/content/browser-apis/request-idle-callback/`.
- [ ] **Testing: Add 1 registry unit test** — Validate that `shared/registry/index.ts` loads without errors and returns all 5 experiments. Prevents "0% coverage" reporting in CI.
- [ ] **Testing: Add 1 E2E smoke test** — Playwright: navigate to `/`, assert page title renders. Prevents E2E suite from being permanently empty.
- [ ] **CI: Add Codecov integration** — Replace hardcoded `>94%` coverage badge with a live Codecov badge. Add `CODECOV_TOKEN` to GitHub Secrets and upload step to `ci.yml`.
- [ ] **ESLint: Scope `no-unused-vars` ignore** — Currently disabled globally for all JS/TS/Vue. Scope it to `shared/utils/analyzer/tests/fixtures/**` only to preserve linting on production code.
- [ ] **MCP: Fix `id` vs `_id` bug in `mcp/server.ts`** — Line 33 destructures `_id` but line 34 uses `id`. This is a latent runtime bug.
- [ ] **Docs: Create `docs/index.md`** — A single navigation page listing all documentation files with one-line descriptions. Add a link to it from `CONTRIBUTING.md`.
- [ ] **Docs: Move `SHOWCASE.md`** — Either delete it (it's empty) or move to `docs/showcase.md` and reference from the roadmap.
- [ ] **Contributing: Verify template path** — Confirm `shared/templates/experiment-template` exists. It's referenced in `CONTRIBUTING.md` but has not been verified.
- [ ] **Contributing: Add "Your First Contribution"** — Add a short section to `CONTRIBUTING.md` with a concrete small task for newcomers and a link to `good first issue` issues.

---

## ✅ Already Complete

- [x] README rewrite with benefit-focused positioning
- [x] Badges updated (flat-square, added Vue/TypeScript/GitHub Pages, removed Node version)
- [x] ESLint lint errors and warnings resolved (`npm run lint` passes cleanly)
- [x] Pre-push hook fixed (duplicate `--passWithNoTests` flag removed)
- [x] Architecture well-documented in `ARCHITECTURE.md`
- [x] Husky + lint-staged pre-commit hooks active
- [x] Dependabot configured with auto-merge policy
- [x] Code of conduct present (`CODE_OF_CONDUCT.md`)
- [x] Security policy present (`SECURITY.md`)
- [x] PR template with project-specific checklist
- [x] MCP server functional with 7 tools, 4 resources, 1 prompt
- [x] AST Analyzer with 4 rules, fixture-based tests, snapshot testing, and performance SLA
- [x] CI pipeline: typecheck → lint → test → coverage → build → validate:mcp → validate:analyzer
- [x] GitHub Pages deployment workflow
- [x] Release workflow (auto-generates changelog on tag push)
- [x] `vercel.json` for Vercel deployment alternative
- [x] Design system documented in `DESIGN_SYSTEM.md`
- [x] `DESIGN_SYSTEM.md` page in the app at `/design-system`

---

## Scoring Reference

| Score | Meaning                                   |
| ----- | ----------------------------------------- |
| 9–10  | Ready for public production               |
| 7–8   | Solid — minor gaps acceptable post-launch |
| 5–6   | Needs attention before launch             |
| 1–4   | Blocking — must be resolved               |

**Current overall score: 7.2 / 10**

> The platform is technically strong and architecturally sound. The primary gaps are content breadth (recipes, browser APIs) and community readiness (issue templates, discussions, social preview). Completing the 🔴 blockers and 🟡 high-priority items would bring the score to approximately **8.5 / 10** — a confident public launch.
