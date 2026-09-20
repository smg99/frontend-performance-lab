# Autonomous Frontend Performance Lab Master Plan

This is the canonical implementation roadmap for evolving Frontend Performance Lab (FPL) into a governed, continuously improving performance-intelligence product.

## Product outcome

FPL continuously discovers trustworthy frontend-performance knowledge, detects gaps in its own knowledge and analyzer, proposes measurable improvements, validates every proposal, and publishes only changes allowed by explicit policy.

The product must improve three connected surfaces:

1. **Knowledge:** browser APIs, recipes, experiments, compatibility and references.
2. **Analysis:** rules, confidence, framework coverage, fixes and project-level reasoning.
3. **Product quality:** FPL's own speed, reliability, accessibility, freshness and discoverability.

## Operating principles

- Autonomous discovery is allowed; autonomous trust is not.
- Evidence, provenance and reproducibility are required for every promoted change.
- Generated changes enter through pull requests. Direct production mutation is out of scope.
- Content-only changes may graduate to policy-based auto-merge after the validation system is certified.
- Analyzer rules and executable fixes require human approval until precision, recall and rollback targets are met over a sustained evaluation window.
- No user source code, telemetry or repository content is collected without explicit opt-in and documented retention controls.
- Prefer deterministic pipelines and small vertical slices over a general-purpose agent platform.
- Never describe fixture counts, heuristics or generated prose as measured accuracy.

## Success metrics

### Trust

- 100% of published knowledge entries have source provenance and a verification timestamp.
- 100% of analyzer rules have executable positive, negative and malformed-input tests.
- No generated change can bypass required CI, policy or review gates.
- Every autonomous change has an audit record containing inputs, evidence, model/tool version, validation results and final disposition.

### Analyzer quality

- Precision and recall are measured against a versioned evaluation corpus.
- No analyzer release lowers an established quality threshold without an explicit approved exception.
- Suggested performance gains are benchmark-derived or clearly labelled as unmeasured.

### Product growth

- Freshness backlog, published updates and organic landing-page coverage are measurable.
- New content is linked into the knowledge graph and has a stable, indexable page.
- Search traffic is treated as an outcome, never as permission to generate thin or duplicative content.

### Operations

- Scheduled runs are idempotent, observable, retryable and protected by concurrency limits.
- A kill switch can disable discovery, proposal generation, merging or publishing independently.
- Failed runs preserve enough evidence for diagnosis without exposing secrets or user code.

## Autonomy levels

| Level | Capability                       | Publication policy                                                    |
| ----- | -------------------------------- | --------------------------------------------------------------------- |
| L0    | Observe and report gaps          | Automatic reports only                                                |
| L1    | Generate proposals               | Draft pull requests; human review required                            |
| L2    | Merge low-risk metadata/content  | Policy-approved changes only                                          |
| L3    | Propose analyzer rules and fixes | Human review plus quality gates                                       |
| L4    | Promote proven analyzer changes  | Future scope; requires sustained corpus evidence and instant rollback |

FPL starts at L0/L1. Higher levels must be earned independently for each change class.

## System boundaries

### Trusted inputs

- Allowlisted primary documentation and standards sources
- Browser and framework release feeds
- Repository issues and maintainer-authored requests
- Versioned public evaluation repositories
- Explicitly opted-in, minimized and anonymized product feedback (future)

### Pipeline

`collect -> normalize -> deduplicate -> assess gap -> create candidate -> validate -> evaluate policy -> open PR -> review/merge -> publish -> observe`

Every stage writes a typed artifact. A later stage must not infer missing evidence.

### Change classes

- **Metadata:** compatibility, dates, verified links and source annotations
- **Knowledge:** recipes, API entries and experiments
- **Analyzer:** rules, confidence changes and fixers
- **Platform:** application, pipeline and infrastructure changes

Each class has separate validation and promotion policy.

## Delivery roadmap

### S0 — Truthful baseline and source-of-truth reset (CERTIFIED)

Goal: establish a trustworthy baseline before automation is added.

Deliverables:

- [x] Inspect repository architecture, current roadmap, CI and Git state.
- [x] Identify placeholder content validation and misleading fixture-based coverage claims.
- [x] Ensure every fixture represented as a test is executed; label all other fixtures as inventory only.
- [x] Report executable coverage separately from fixture inventory.
- [x] Replace the content-validation stub with runtime schema and relationship validation.
- [x] Make analyzer reports deterministic for identical inputs.
- [x] Distinguish benchmark-derived estimates from unmeasured heuristics.
- [x] Add content and analyzer validation to CI.
- [x] Record baseline test, typecheck, lint and build evidence.

Certification gates:

- Every registered rule is classified as tested or explicitly uncovered.
- Positive and negative fixtures are executed, not merely counted.
- Invalid content causes validation to fail.
- Generated reports are reproducible and CI detects drift.

Certification evidence (2026-09-20):

- Analyzer suite: 16 files and 110 tests passed; measured analyzer line coverage 89.86%.
- Full suite: 32 files and 256 tests passed; measured repository line coverage 84.18%.
- Runtime content validation passed for 5 experiments, 8 browser APIs, 5 recipes and 16 rules.
- Typecheck, lint, production build and `git diff --check` passed.
- Analyzer findings are deterministic for identical ordered input, and unbenchmarked impact values are explicitly labelled as unmeasured heuristics.

### S1 — Provenance-ready knowledge model

Goal: make every knowledge claim traceable and freshness-aware.

Deliverables:

- Typed provenance: canonical URL, publisher, retrieved date, verified date and evidence type.
- Freshness policy by source and content class.
- Relationship integrity and duplicate-ID validation.
- Migration of existing manifests without weakening required fields.
- Provenance and freshness surfaced in the UI and MCP responses.

Certification gates:

- Missing or invalid provenance blocks new autonomous content.
- Broken relationships, duplicate IDs and stale required sources fail validation.
- Existing content is migrated and remains renderable.

### S2 — Autonomous discovery at L0

Goal: discover useful changes without modifying product content.

Deliverables:

- Allowlisted source catalog with licensing and rate-limit notes.
- Scheduled collectors with conditional requests, backoff and content hashing.
- Normalized discovery records with immutable source snapshots or hashes.
- Deduplication and relevance scoring.
- A human-readable discovery report and backlog.

Certification gates:

- Re-running unchanged inputs creates no duplicate candidates.
- A failed or compromised source cannot silently publish content.
- Each candidate links to the exact evidence that caused its creation.

### S3 — Evidence-bearing content proposals at L1

Goal: turn a verified discovery into a safe draft pull request.

Deliverables:

- Candidate schemas for metadata, browser APIs, recipes and experiments.
- Generation constrained by existing templates and project principles.
- Citation, link, schema, relationship, duplication and originality checks.
- Pull-request template containing evidence, uncertainty, validation and rollback notes.
- Idempotency key preventing duplicate PRs for the same source change.

Certification gates:

- End-to-end fixture: source change to validated draft PR payload.
- Unsupported claims and missing citations block proposal creation.
- No workflow has permission to push directly to the protected branch.

### S4 — Continuous product self-audit

Goal: let FPL continuously measure its own quality.

Deliverables:

- Scheduled Lighthouse and accessibility checks on representative routes.
- Bundle-size, broken-link, content-freshness and build-time budgets.
- Analyzer latency and crash-rate benchmarks.
- Regression issues with deduplication, ownership and automatic closure after recovery.
- Trend reports based on stored measured results.

Certification gates:

- Seeded regressions reliably create one actionable report.
- Recovery closes or updates the existing report rather than creating noise.
- Measurements include environment and version metadata.

### S5 — Analyzer evaluation corpus

Goal: measure analyzer quality before generating analyzer changes.

Deliverables:

- Versioned positive, negative, edge-case and real-project corpus.
- Expected findings with file, rule and location.
- Precision, recall, crash rate and runtime reporting per rule and framework.
- Baseline thresholds and regression comparison.
- Safe handling of parse failures and unsupported frameworks.

Certification gates:

- Every built-in rule meets its declared threshold or is marked experimental.
- A seeded false positive and false negative are detected by the evaluation pipeline.
- Reports are deterministic and reproducible locally and in CI.

### S6 — Analyzer proposals at L3

Goal: allow autonomous generation of rule improvements without autonomous trust.

Deliverables:

- Gap-to-rule proposal format.
- Generated rule, positive/negative fixtures, explanation, provenance and benchmark plan.
- Sandboxed evaluation with resource and network limits.
- Diff-risk classification and mandatory human approval.
- Fixers disabled by default unless separately certified.

Certification gates:

- A candidate cannot be proposed without executable fixtures.
- Quality thresholds, security checks and runtime budgets block regressions.
- Generated code never receives repository secrets.

### S7 — Feedback and outcome learning

Goal: improve prioritization using privacy-safe outcomes.

Deliverables:

- Opt-in feedback contract and privacy/retention documentation.
- Aggregate rule acceptance, dismissal and confirmed-fix outcomes.
- Minimum sample sizes and anti-gaming controls.
- Ranking adjustments as versioned proposals, not silent model behavior.

Certification gates:

- No source code or identifying repository data is collected by default.
- Low-volume or ambiguous signals cannot automatically change rule behavior.
- Users can inspect and disable collection.

### S8 — Policy-based low-risk promotion at L2

Goal: auto-merge a narrow set of proven low-risk changes.

Deliverables:

- Policy-as-code evaluator for permitted files, fields and evidence.
- Required checks, branch protection, signed provenance and audit log.
- Independent kill switches and rollback workflow.
- Canary publication and post-deploy verification.

Certification gates:

- Adversarial and out-of-scope diffs are rejected.
- Rollback is tested end to end.
- Analyzer, dependency, executable-code and infrastructure changes remain human-gated.

### S9 — Growth and knowledge distribution

Goal: turn verified improvements into durable audience value.

Deliverables:

- Stable pages, canonical metadata, structured data and internal linking.
- Topic and framework coverage maps driven by genuine knowledge gaps.
- MCP/API freshness metadata and changelog feeds.
- Outcome dashboard for useful pages, returning users and search discovery.

Certification gates:

- No thin, duplicate or source-paraphrase-only pages are published.
- Search-facing output matches the validated knowledge source.
- Growth metrics cannot influence technical truth or bypass review policy.

### S10 — Operational hardening and end-to-end certification

Goal: certify the complete autonomous operating model.

Deliverables:

- Threat model, secret boundaries, permissions audit and dependency policy.
- Queueing, concurrency, retry, timeout and cost controls.
- Disaster recovery, audit retention and operator runbooks.
- Full staged rehearsal from discovery through publication and rollback.

Certification gates:

- Security, reliability, observability and recovery tests pass.
- Operator can pause every stage without redeploying application code.
- Documented behavior matches observed production behavior.

## Current repository audit

| Capability                     | Status  | Evidence                                                                       |
| ------------------------------ | ------- | ------------------------------------------------------------------------------ |
| Structured knowledge manifests | PARTIAL | Typed interfaces exist; runtime validation and provenance are absent.          |
| AST analyzer                   | PARTIAL | Sixteen registered rules; cross-file analysis remains planned.                 |
| Analyzer fixtures              | PARTIAL | Fixtures exist, but the configured analyzer test suite does not execute them.  |
| Analyzer coverage report       | BROKEN  | Fixture presence is currently presented as `>95%` code coverage.               |
| Content validation             | BROKEN  | The script is a success-only placeholder.                                      |
| CI                             | PARTIAL | Test, typecheck, lint and build run; autonomous certification is not wired in. |
| Autonomous discovery           | PLANNED | No collector, source catalog or discovery artifact exists.                     |
| Autonomous proposals           | PLANNED | No candidate schema, policy engine or PR evidence format exists.               |
| Self-observability             | PARTIAL | CI exists; longitudinal quality and performance measurements do not.           |

## Definition of done for every sprint

A sprint is CERTIFIED only when its scoped behavior is implemented, negative cases are tested, realistic runtime evidence is recorded, security and privacy implications are addressed, documentation reflects observed behavior, and the worktree is reviewed for unrelated changes. A checklist alone is not completion evidence.
