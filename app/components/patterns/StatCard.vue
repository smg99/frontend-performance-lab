<script setup lang="ts">
import Card from '../ui/Card.vue'

interface Props {
  title: string
  value: string | number
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
  }
}

defineProps<Props>()
</script>

<template>
  <Card
    class="p-6 flex flex-col gap-2 group hover:border-border-strong hover:shadow-md transition-all duration-200"
  >
    <h3 class="text-sm font-medium text-foreground-muted">{{ title }}</h3>
    <div class="flex items-baseline gap-2">
      <span class="text-3xl font-semibold tracking-tight text-foreground-primary">{{ value }}</span>
      <span
        v-if="trend"
        class="text-xs font-medium px-1.5 py-0.5 rounded-md"
        :class="{
          'bg-success-bg text-success': trend.direction === 'up',
          'bg-danger-bg text-danger': trend.direction === 'down',
          'bg-background-hover text-foreground-muted': trend.direction === 'neutral'
        }"
      >
        {{ trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→' }}
        {{ trend.value }}
      </span>
    </div>
  </Card>
</template>
