<template>
  <section class="py-32 bg-background-base relative overflow-hidden">
    <!-- Subtle background effect -->
    <div
      class="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"
    />

    <div class="max-w-4xl mx-auto px-4 relative z-10">
      <div
        class="bg-background-surface border border-border-subtle-strong rounded-3xl p-10 xl:p-16 text-center shadow-xl relative overflow-hidden"
      >
        <!-- Card internal glow -->
        <div
          class="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-primary/20 blur-[100px] pointer-events-none"
        />

        <h2
          class="text-4xl xl:text-5xl font-bold tracking-tight text-foreground-primary mb-6 relative z-10"
        >
          Start optimizing today.
        </h2>
        <p class="text-xl text-foreground-muted mb-10 max-w-2xl mx-auto relative z-10">
          Paste your code, understand the bottlenecks, and implement proven patterns directly from
          your IDE.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Button
            size="lg"
            class="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary-hover shadow-lg hover:shadow-primary/25 transition-all"
            as="NuxtLink"
            href="/tools/performance-review"
          >
            Analyze My Code
          </Button>
          <Button
            variant="outline"
            size="lg"
            class="w-full sm:w-auto text-lg px-8 py-6 rounded-full"
            as="NuxtLink"
            href="/install"
          >
            Install Frontend Performance Lab
          </Button>
          <button
            class="group w-full sm:w-auto flex items-center justify-between gap-3 px-6 py-4 bg-background-base border border-border-subtle-strong rounded-full shadow-sm hover:border-primary hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            @click="openSearch"
          >
            <div
              class="flex items-center gap-2 text-foreground-secondary group-hover:text-foreground-primary transition-colors"
            >
              <SearchIcon class="w-5 h-5" />
              <span class="font-medium text-lg">Command Palette</span>
            </div>
            <div class="flex items-center gap-1 text-foreground-muted">
              <kbd
                class="font-mono text-xs bg-background-surface border border-border-subtle-subtle rounded px-1.5 py-0.5 shadow-sm"
                >⌘K</kbd
              >
            </div>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '../ui/Button.vue'
import { SearchIcon } from 'lucide-vue-next'

const openSearch = () => {
  if (typeof document !== 'undefined') {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
  }
}
</script>
