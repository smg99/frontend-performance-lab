<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div
      v-for="(stat, index) in statsList"
      :key="index"
      class="bg-background-surface border border-border-subtle-subtle rounded-xl p-5 shadow-sm"
    >
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-sm font-medium text-foreground-muted">{{ stat.label }}</h4>
        <div
          v-if="stat.status"
          :class="['w-2 h-2 rounded-full', stat.status === 'ok' ? 'bg-success' : 'bg-warning']"
        />
      </div>
      <div class="text-2xl font-bold text-foreground-primary">{{ stat.value }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const status = ref<Record<string, unknown> | null>(null)
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

const statsList = computed(() => {
  if (!status.value) {
    return [
      {
        label: 'Status',
        value: loading.value ? 'Loading...' : 'Unavailable',
        status: loading.value ? '' : 'warning'
      },
      { label: 'Tools', value: '-' },
      { label: 'Experiments', value: '-' },
      { label: 'Health Score', value: '-' }
    ]
  }

  return [
    { label: 'Version', value: status.value.Server?.Version || '1.0.0', status: 'ok' },
    { label: 'Registered Tools', value: status.value.Tools?.TotalToolCount || 0 },
    { label: 'Resources', value: status.value.Resources?.TotalResourceCount || 0 },
    {
      label: 'Health Score',
      value: `${status.value.Overall?.HealthScore || 0}/100`,
      status: status.value.Overall?.HealthScore === 100 ? 'ok' : 'warning'
    },
    { label: 'Experiments', value: status.value.Experiments?.TotalExperiments || 0 },
    { label: 'Browser APIs', value: status.value.BrowserAPIs?.Count || 0 },
    { label: 'Recipes', value: status.value.Recipes?.Count || 0 },
    { label: 'Prompts', value: status.value.Prompts?.TotalPromptCount || 0 }
  ]
})
</script>
