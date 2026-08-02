<template>
  <section class="py-24 max-w-7xl mx-auto px-4 border-b border-border-subtle-subtle">
    <div class="flex flex-col lg:flex-row gap-16 items-center">
      <div class="flex-1 space-y-6">
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-foreground-primary">
          Why Frontend Performance Lab?
        </h2>
        <div class="space-y-4 text-lg">
          <p class="text-foreground-muted">Traditional AI assistants understand code.</p>
          <p class="text-foreground-primary font-bold text-xl">
            Frontend Performance Lab understands frontend performance.
          </p>
        </div>
        <p class="text-foreground-muted leading-relaxed max-w-xl">
          It provides your IDE with a massive, specialized knowledge graph dedicated entirely to
          making browsers render frames faster and consume less memory.
        </p>
      </div>

      <div
        class="flex-1 w-full bg-background-surface/50 border border-border-subtle-subtle rounded-2xl p-8 sm:p-10 shadow-sm relative overflow-hidden group"
      >
        <div
          class="absolute -right-16 -top-16 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none"
        >
          <ZapIcon class="w-64 h-64" />
        </div>

        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 relative z-10">
          <li
            v-for="item in features"
            :key="item"
            class="flex items-center gap-3 text-foreground-primary font-medium"
          >
            <div
              class="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary"
            >
              <CheckIcon class="w-3.5 h-3.5" />
            </div>
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { CheckIcon, ZapIcon } from 'lucide-vue-next'

const features = [
  'Browser APIs',
  'Rendering',
  'Virtualization',
  'Layout',
  'Reactivity',
  'Rendering Pipelines',
  'Recipes',
  'Performance Knowledge Graph'
]
</script>
