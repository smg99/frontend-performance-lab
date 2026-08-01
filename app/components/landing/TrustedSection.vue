<template>
  <section class="py-8 border-b border-border-subtle bg-background-base overflow-hidden">
    <div class="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-3 lg:gap-6">
      <Badge
        v-for="badge in badges"
        :key="badge"
        variant="outline"
        class="px-4 py-1.5 text-sm font-medium border-border-strong text-foreground-muted hover:text-foreground-primary transition-colors cursor-default whitespace-nowrap bg-background-surface"
      >
        <span class="text-primary mr-1.5">✓</span> {{ badge }}
      </Badge>
    </div>
  </section>
</template>

<script setup lang="ts">
import Badge from '../ui/Badge.vue'

const badges = [
  'AST Powered',
  'MCP Ready',
  'Browser API Knowledge Graph',
  'Interactive Experiments',
  'Performance Recipes',
  'AI Ready'
]
</script>
