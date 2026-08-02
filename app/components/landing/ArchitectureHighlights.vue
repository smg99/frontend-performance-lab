<template>
  <section class="py-24 bg-background-surface border-b border-border-subtle-subtle overflow-hidden">
    <div class="max-w-5xl mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold tracking-tight text-foreground-primary mb-4">
          Under the Hood
        </h2>
        <p class="text-lg text-foreground-muted max-w-2xl mx-auto">
          An extensible, AI-first architecture powering static analysis and the knowledge graph.
        </p>
      </div>

      <!-- Architecture Pipeline Visual -->
      <div
        class="relative p-8 md:p-12 rounded-3xl bg-background-base border border-border-subtle-subtle shadow-2xl flex flex-col items-center gap-12 group"
      >
        <!-- Glow -->
        <div
          class="absolute inset-0 bg-radial-gradient from-blue-500/5 to-transparent opacity-100 pointer-events-none"
        ></div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative z-10">
          <!-- Node 1: Web & IDE -->
          <div
            class="flex flex-col items-center text-center p-6 rounded-2xl bg-background-surface/50 border border-border-subtle-subtle backdrop-blur-sm"
          >
            <div
              class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4"
            >
              <MonitorIcon class="w-6 h-6" />
            </div>
            <h3 class="font-bold text-foreground-primary mb-2">Web UI & IDE</h3>
            <p class="text-xs text-foreground-muted">
              Vue 3, Nuxt 4, Tailwind CSS, Cursor, VS Code.
            </p>
          </div>

          <!-- Node 2: MCP Engine -->
          <div
            class="flex flex-col items-center text-center p-6 rounded-2xl bg-primary/5 border border-primary/20 backdrop-blur-sm relative"
          >
            <div
              class="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-4"
            >
              <ServerIcon class="w-6 h-6" />
            </div>
            <h3 class="font-bold text-foreground-primary mb-2">MCP Server</h3>
            <p class="text-xs text-foreground-muted">
              The Model Context Protocol exposing the Knowledge Graph to LLMs.
            </p>

            <!-- Connectors (Desktop) -->
            <div
              class="hidden md:block absolute top-1/2 left-0 -translate-x-full w-8 h-px bg-border-strong dashed-line"
            ></div>
            <div
              class="hidden md:block absolute top-1/2 right-0 translate-x-full w-8 h-px bg-border-strong dashed-line"
            ></div>
          </div>

          <!-- Node 3: Core -->
          <div
            class="flex flex-col items-center text-center p-6 rounded-2xl bg-background-surface/50 border border-border-subtle-subtle backdrop-blur-sm"
          >
            <div
              class="w-12 h-12 rounded-xl bg-success/10 text-success flex items-center justify-center mb-4"
            >
              <DatabaseIcon class="w-6 h-6" />
            </div>
            <h3 class="font-bold text-foreground-primary mb-2">AST & Graph</h3>
            <p class="text-xs text-foreground-muted">
              Babel/Vue compilers for static analysis + shared TS knowledge registry.
            </p>
          </div>
        </div>

        <div class="text-center relative z-10 mt-4">
          <Button
            variant="outline"
            as="a"
            href="https://github.com/smg99/frontend-performance-lab"
            target="_blank"
            class="rounded-full"
          >
            <GithubIcon class="w-4 h-4 mr-2" /> View Source
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { MonitorIcon, ServerIcon, DatabaseIcon, GithubIcon } from 'lucide-vue-next'
import Button from '../ui/Button.vue'
</script>

<style scoped>
.bg-radial-gradient {
  background-image: radial-gradient(
    circle at 50% 50%,
    var(--tw-gradient-from) 0%,
    var(--tw-gradient-to) 100%
  );
}
.dashed-line {
  background-image: linear-gradient(90deg, var(--border-strong) 50%, transparent 50%);
  background-size: 8px 1px;
  background-color: transparent;
}
</style>
