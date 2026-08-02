<template>
  <div
    v-if="isOpen"
    class="fixed bottom-4 left-4 w-80 bg-background-surface/95 backdrop-blur-md border border-border-subtle p-0 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col font-mono text-xs text-foreground-primary"
  >
    <div
      class="flex justify-between items-center bg-background-base border-b border-border-subtle p-2 cursor-move select-none"
    >
      <div class="flex items-center gap-2 text-primary font-bold">
        <span>🔍</span>
        <span>Reactivity Inspector</span>
      </div>
      <button class="text-foreground-muted hover:text-foreground-primary" @click="isOpen = false">
        ✕
      </button>
    </div>

    <div class="p-3 space-y-3 overflow-y-auto max-h-64">
      <!-- Active Effects Count -->
      <div class="flex justify-between items-center border-b border-border-subtle pb-1">
        <span class="text-foreground-muted">Tracked Effects</span>
        <span class="text-success font-bold">14</span>
      </div>

      <div class="flex justify-between items-center border-b border-border-subtle pb-1">
        <span class="text-foreground-muted">Active Watchers</span>
        <span class="text-warning font-bold">4</span>
      </div>

      <div class="flex justify-between items-center border-b border-border-subtle pb-1">
        <span class="text-foreground-muted">Computed Caches</span>
        <span class="text-info font-bold">6</span>
      </div>

      <div class="pt-2">
        <span class="text-foreground-muted uppercase text-[10px] font-bold mb-2 block"
          >Recent Events (Simulated)</span
        >
        <div class="space-y-1">
          <div class="flex gap-2">
            <span class="text-danger">[patch]</span>
            <span class="truncate">RenderCounter.vue</span>
          </div>
          <div class="flex gap-2">
            <span class="text-success">[track]</span>
            <span class="truncate">RefVsReactive</span>
          </div>
          <div class="flex gap-2">
            <span class="text-warning">[trigger]</span>
            <span class="truncate">datasetSize</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <button
    v-else
    class="fixed bottom-4 left-4 bg-background-surface border border-border-subtle p-3 rounded-full shadow-lg z-50 text-xl hover:bg-border/50 transition-colors"
    title="Open Inspector"
    @click="isOpen = true"
  >
    🔍
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)
</script>
