# Engineering Principles

These principles guide day-to-day engineering decisions.

---

# Build Small

Prefer ten 2-hour improvements over one 20-hour rewrite.

Smaller changes are easier to understand.

Test.

Review.

Deploy.

Rollback.

---

# Optimize For Readability

Code is read more often than it is written.

Future contributors should understand code without reading commit history.

---

# Explicit Beats Clever

Avoid clever implementations.

Prefer code that communicates intent.

---

# Performance Is Part Of Correctness

Slow software is incorrect software.

Performance should be considered during design.

Not after release.

---

# Automation First

If a process is repeated multiple times,

automate it.

Humans should solve problems.

Machines should repeat work.

---

# Everything Is Observable

Systems should expose useful diagnostics.

Failures should explain themselves.

Silent failures destroy trust.

---

# Consistency Matters

Naming.

Architecture.

Testing.

Documentation.

Releases.

Developer experience improves when consistency increases.

---

# Review Before Building

Always ask:

Should this exist?

Could a plugin solve it?

Does it belong in the core?

Will this still matter three years from now?

---

# Build Platforms

Avoid building isolated features.

Create reusable capabilities.

Capabilities enable ecosystems.

---

# Leave Things Better

Every pull request should improve the repository.

Even small improvements compound over time.
