<template>
  <div
    class="bg-background-surface border border-border-subtle-subtle rounded-xl p-4 shadow-sm flex flex-wrap items-center gap-4 text-sm divide-x divide-border-subtle-subtle"
  >
    <div class="flex items-center gap-2 pl-4 first:pl-0 first:border-l-0">
      <span class="font-bold text-foreground-primary">Frontend Performance Lab Server</span>
    </div>
    <div class="flex items-center gap-2 pl-4">
      <div class="w-2 h-2 rounded-full" :class="loading ? 'bg-warning' : 'bg-success'"></div>
      <span class="text-foreground-primary">{{ loading ? 'Connecting...' : 'Healthy' }}</span>
    </div>
    <div class="flex items-center gap-2 pl-4">
      <span class="text-foreground-muted">Version</span>
      <span class="text-foreground-primary">{{ status?.Server?.Version || '1.0.0' }}</span>
    </div>
    <div class="flex items-center gap-2 pl-4">
      <span class="text-foreground-primary font-medium"
        >{{ status?.Tools?.TotalToolCount || 8 }} Tools</span
      >
    </div>
    <div class="flex items-center gap-2 pl-4">
      <span class="text-foreground-primary font-medium"
        >{{ status?.Experiments?.TotalExperiments || 5 }} Experiments</span
      >
    </div>
    <div class="flex items-center gap-2 pl-4 hidden md:flex">
      <span class="text-foreground-primary font-medium"
        >{{ status?.BrowserAPIs?.Count || 5 }} APIs</span
      >
    </div>
    <div class="flex items-center gap-2 pl-4 hidden lg:flex">
      <span class="text-foreground-primary font-medium"
        >{{ status?.Recipes?.Count || 5 }} Recipes</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const status = ref<Record<string, any> | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const response = await fetch('/api/mcp/status')
    if (response.ok) {
      status.value = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch MCP status', error)
  } finally {
    loading.value = false
  }
})
</script>
