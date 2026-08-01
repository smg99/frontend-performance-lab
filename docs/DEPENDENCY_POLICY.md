# Dependency Update Policy

This repository uses [Dependabot](https://docs.github.com/en/code-security/dependabot) to keep dependencies up-to-date and secure, while ensuring that the build remains stable and PR spam is kept to a minimum.

## How Dependabot is Configured

Dependabot runs **weekly on Mondays at 09:00 UTC**. It checks both `npm` dependencies and `github-actions`.
To reduce PR spam, updates are grouped together where possible, and there is a limit of **5 open pull requests** at any given time.
Major version updates are ignored automatically by Dependabot configuration to avoid massive breaking changes being introduced without planning.

## Auto-Merge Policy

To balance security and productivity, we automatically merge low-risk updates. A GitHub Actions workflow (`.github/workflows/dependabot-auto-merge.yml`) handles this.

An update is **auto-merged** ONLY IF it meets ALL of the following criteria:

1. The author is `dependabot[bot]`.
2. The pull request is not in a draft state.
3. The update type is a **patch** release (e.g., `1.2.3` -> `1.2.4`).
4. All mandatory CI checks (linting, type checking, tests, build) pass successfully.
5. The package is **not** on the Protected Packages list.

## Manual Review Policy

Updates that do NOT meet the auto-merge criteria require manual review. This includes:

- **Major updates:** (currently ignored by configuration, but would require manual review if enabled)
- **Minor updates:** New features often introduce subtle regressions.
- **Protected Packages:** Core framework and build tools.

### Protected Packages

The following packages are deemed critical to the architecture and build pipeline. They will **never** be auto-merged, regardless of whether the update is a patch. They require human oversight and thorough testing:

- `nuxt`
- `vue`
- `vite`
- `typescript`
- `@modelcontextprotocol/sdk`
- `@vue/compiler-sfc`
- `@babel/*` (all Babel packages)
- `radix-vue`

**Why are framework updates manual?**
Core frameworks (Vue, Nuxt, Vite) and compilation targets (TypeScript, Babel) are deeply integrated into the codebase. Even patch versions can introduce upstream regressions in module resolution, hydration, or AST parsing (in the case of the Performance Analyzer). Manual review ensures these updates are monitored for performance or build regressions.
