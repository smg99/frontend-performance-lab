# Plugin Strategy

## Philosophy

Frontend Performance Lab is designed as a platform.

The core should remain intentionally small.

Everything else should be extensible through plugins.

The long-term success of FPL depends more on its ecosystem than its core repository.

---

# Plugin First

Whenever a new capability can reasonably exist as a plugin, it should.

The core should only contain:

- deterministic analysis engine
- diagnostics engine
- reporting engine
- plugin runtime
- SDK
- common infrastructure

Everything else belongs in plugins.

---

# Types of Plugins

FPL supports multiple categories of plugins.

## Analyzer Plugins

Introduce new deterministic analysis rules.

Examples:

- Vue
- React
- Angular
- Svelte
- Solid
- Astro
- Nuxt
- Next.js

---

## Diagnostics Plugins

Enrich analyzer findings.

Examples:

- educational explanations
- confidence improvements
- architecture guidance
- company best practices

---

## Reporting Plugins

Generate custom outputs.

Examples:

- Markdown
- HTML
- PDF
- SARIF
- GitHub PR comments
- Slack summaries

---

## AI Plugins

Allow different AI providers.

Examples:

- Claude
- OpenAI
- Gemini
- Local LLMs
- Ollama

No provider receives privileged treatment.

---

## IDE Plugins

Native integrations.

Examples:

- VS Code

- Cursor

- Claude Desktop

- Claude Code

- Windsurf

- Zed

- JetBrains

- Antigravity

---

## Marketplace Plugins

Community-created extensions.

Examples:

- accessibility

- security

- bundle optimization

- animation performance

- design systems

- custom enterprise rules

---

# Plugin Quality

Every plugin should be:

- deterministic where possible
- independently testable
- versioned
- documented
- benchmarked

---

# Backwards Compatibility

Plugins should continue working across multiple core releases whenever practical.

Breaking plugin APIs should be extremely rare.

---

# Success

The platform succeeds when the majority of innovation happens outside the core repository.

The core should become increasingly stable.

The ecosystem should become increasingly powerful.
