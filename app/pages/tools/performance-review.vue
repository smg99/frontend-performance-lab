<template>
  <div class="flex flex-col h-full w-full">
    <!-- Header -->
    <div class="bg-background-base border-b border-border-subtle p-4 px-6">
      <h1 class="text-2xl font-bold text-foreground-primary tracking-tight flex items-center gap-2">
        <span class="text-primary">⚡️</span> AI Performance Review
      </h1>
      <p class="text-sm text-foreground-muted mt-1">
        Paste your code below to receive a static analysis review powered by the lab's knowledge
        base.
      </p>
    </div>

    <!-- Workspace -->
    <PerformanceReviewWorkspace />
  </div>
</template>

<script setup lang="ts">
import PerformanceReviewWorkspace from '~/components/tools/performance-review/PerformanceReviewWorkspace.vue'

definePageMeta({
  layout: 'default'
})
</script>
