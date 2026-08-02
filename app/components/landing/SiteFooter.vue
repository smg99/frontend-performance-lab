<template>
  <footer class="py-16 border-t border-border-subtle-subtle bg-background-surface">
    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <!-- Platform -->
        <div>
          <h4 class="font-semibold text-foreground-primary mb-4">Platform</h4>
          <ul class="space-y-3 text-sm text-foreground-muted">
            <li>
              <NuxtLink to="/install" class="hover:text-primary transition-colors"
                >Install CLI</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/tools/performance-review" class="hover:text-primary transition-colors"
                >Analyzer</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/experiments/virtualization"
                class="hover:text-primary transition-colors"
                >Experiments</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/recipes/large-data-table" class="hover:text-primary transition-colors"
                >Recipes</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/browser-apis/request-animation-frame"
                class="hover:text-primary transition-colors"
                >Browser APIs</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/mcp" class="hover:text-primary transition-colors">MCP Hub</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h4 class="font-semibold text-foreground-primary mb-4">Resources</h4>
          <ul class="space-y-3 text-sm text-foreground-muted">
            <li>
              <a
                href="https://github.com/smg99/frontend-performance-lab#architecture"
                target="_blank"
                class="hover:text-primary transition-colors"
              >
                Architecture
              </a>
            </li>
            <li>
              <NuxtLink to="/design-system" class="hover:text-primary transition-colors">
                Design System
              </NuxtLink>
            </li>
            <li>
              <a
                href="https://github.com/smg99/frontend-performance-lab#roadmap"
                target="_blank"
                class="hover:text-primary transition-colors"
              >
                Roadmap
              </a>
            </li>
            <li>
              <a
                href="https://github.com/smg99/frontend-performance-lab/blob/main/CONTRIBUTING.md"
                target="_blank"
                class="hover:text-primary transition-colors"
              >
                Contributing
              </a>
            </li>
            <li>
              <a
                href="https://github.com/smg99/frontend-performance-lab/releases"
                target="_blank"
                class="hover:text-primary transition-colors"
              >
                Changelog
              </a>
            </li>
          </ul>
        </div>

        <!-- Community -->
        <div>
          <h4 class="font-semibold text-foreground-primary mb-4">Community</h4>
          <ul class="space-y-3 text-sm text-foreground-muted">
            <li>
              <a
                href="https://github.com/smg99/frontend-performance-lab"
                target="_blank"
                class="hover:text-primary transition-colors"
                >GitHub</a
              >
            </li>
            <li>
              <a
                href="https://github.com/smg99/frontend-performance-lab/issues"
                target="_blank"
                class="hover:text-primary transition-colors"
                >Issues</a
              >
            </li>
            <li>
              <a
                href="https://github.com/smg99/frontend-performance-lab/discussions"
                target="_blank"
                class="hover:text-primary transition-colors"
                >Discussions</a
              >
            </li>
            <li>
              <a
                href="https://github.com/smg99/frontend-performance-lab/releases"
                target="_blank"
                class="hover:text-primary transition-colors"
                >Releases</a
              >
            </li>
          </ul>
        </div>

        <!-- Developer -->
        <div>
          <h4 class="font-semibold text-foreground-primary mb-4">Developer</h4>
          <ul class="space-y-3 text-sm text-foreground-muted">
            <li><span class="text-foreground-primary">Built by Sumit G</span></li>
            <li>
              <a
                href="https://linkedin.com/in/sumitgajjar"
                target="_blank"
                class="hover:text-primary transition-colors"
                >LinkedIn</a
              >
            </li>
            <li>
              <a
                href="https://github.com/smg99"
                target="_blank"
                class="hover:text-primary transition-colors"
                >GitHub Profile</a
              >
            </li>
            <li><span class="opacity-70">MIT License</span></li>
          </ul>
        </div>
      </div>

      <div
        class="pt-8 border-t border-border-subtle-subtle flex flex-col items-center sm:items-start gap-4"
      >
        <p class="text-sm font-medium text-foreground-primary">Frontend Performance Lab</p>
        <p
          class="text-xs text-foreground-muted flex flex-wrap items-center justify-center sm:justify-start gap-2"
        >
          <span>Powered by:</span>
          <span class="px-2 py-0.5 rounded bg-background-base border border-border-subtle-subtle"
            >Nuxt</span
          >
          <span class="px-2 py-0.5 rounded bg-background-base border border-border-subtle-subtle"
            >Vue</span
          >
          <span class="px-2 py-0.5 rounded bg-background-base border border-border-subtle-subtle"
            >TypeScript</span
          >
          <span class="px-2 py-0.5 rounded bg-background-base border border-border-subtle-subtle"
            >AST</span
          >
          <span class="px-2 py-0.5 rounded bg-background-base border border-border-subtle-subtle"
            >MCP</span
          >
        </p>
      </div>
    </div>
  </footer>
</template>
