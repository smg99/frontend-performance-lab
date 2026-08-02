<script setup lang="ts">
import Card from '../ui/Card.vue'

interface Props {
  title: string
  value: string | number
  description?: string
  icon?: unknown
  trend?: {
    direction: 'up' | 'down' | 'neutral'
    value: string
  }
}

defineProps<Props>()
</script>

<template>
  <Card
    class="relative p-6 flex flex-col gap-3 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary overflow-hidden"
  >
    <!-- Subtle hover glow -->
    <div
      class="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
    />

    <div class="relative z-10 flex items-center justify-between">
      <h3 class="text-sm font-semibold tracking-wide text-foreground-muted uppercase">
        {{ title }}
      </h3>
      <div
        v-if="icon"
        class="p-2 bg-background-base rounded-md border border-border-subtle-subtle text-foreground-secondary group-hover:text-primary transition-colors"
      >
        <component :is="icon" class="w-4 h-4" />
      </div>
    </div>

    <div class="relative z-10 flex flex-col mt-1 gap-1">
      <div class="flex items-baseline gap-2">
        <span class="text-4xl font-bold tracking-tight text-foreground-primary">{{ value }}</span>
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
      <p v-if="description" class="text-xs text-foreground-muted leading-snug mt-2">
        {{ description }}
      </p>
    </div>
  </Card>
</template>

<style scoped>
.bg-radial-gradient {
  background-image: radial-gradient(
    circle at 50% -20%,
    var(--tw-gradient-from) 0%,
    var(--tw-gradient-to) 100%
  );
}
</style>
