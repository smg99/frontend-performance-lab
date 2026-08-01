<template>
  <footer class="py-12 border-t border-border-subtle bg-background-surface">
    <div
      class="max-w-7xl mx-auto px-4 flex flex-col items-center justify-between gap-8 sm:flex-row"
    >
      <div class="flex flex-col items-center sm:items-start gap-4">
        <p class="text-sm font-medium text-foreground-primary">Frontend Performance Lab</p>
        <p
          class="text-xs text-foreground-muted flex flex-wrap items-center justify-center sm:justify-start gap-2"
        >
          <span>Built with:</span>
          <span class="px-2 py-0.5 rounded bg-background-base border border-border-subtle"
            >Nuxt</span
          >
          <span class="px-2 py-0.5 rounded bg-background-base border border-border-subtle"
            >Vue</span
          >
          <span class="px-2 py-0.5 rounded bg-background-base border border-border-subtle"
            >TypeScript</span
          >
          <span class="px-2 py-0.5 rounded bg-background-base border border-border-subtle"
            >AST</span
          >
          <span class="px-2 py-0.5 rounded bg-background-base border border-border-subtle"
            >MCP</span
          >
          <span class="px-2 py-0.5 rounded bg-background-base border border-border-subtle"
            >Vitest</span
          >
        </p>
      </div>

      <div class="flex items-center gap-6">
        <a
          href="https://github.com/smg99"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-foreground-muted hover:text-foreground-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
        >
          Open Source on GitHub
        </a>
        <a
          href="https://linkedin.com/in/sumitgajjar"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-foreground-muted hover:text-foreground-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
        >
          LinkedIn
        </a>
      </div>
    </div>
  </footer>
</template>
