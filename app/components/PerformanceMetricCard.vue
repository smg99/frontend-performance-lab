<template>
  <div
    class="bg-background-base border border-border-subtle rounded-xl p-5 shadow-subtle dark:shadow-subtle-dark"
  >
    <div class="flex items-center justify-between mb-2">
      <h3 class="text-sm font-medium text-foreground-muted">{{ title }}</h3>
      <div v-if="icon" class="text-foreground-muted">
        <!-- SVG icon placeholder -->
        <span class="text-xs">{{ icon }}</span>
      </div>
    </div>
    <div class="flex items-baseline space-x-2">
      <span class="text-2xl font-bold text-foreground-primary">{{ value }}</span>
      <span v-if="unit" class="text-sm text-foreground-muted">{{ unit }}</span>
    </div>
    <div
      v-if="trend"
      class="mt-2 text-xs flex items-center space-x-1"
      :class="trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-foreground-muted'"
    >
      <span>{{ trend > 0 ? '↑' : trend < 0 ? '↓' : '→' }}</span>
      <span>{{ Math.abs(trend) }}% from last run</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  unit?: string
  trend?: number
  icon?: string
}>()
</script>
