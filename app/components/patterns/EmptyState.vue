<script setup lang="ts">
import { cn } from '../../utils/cn'

interface Props {
  title: string
  description?: string
  icon?: unknown
  class?: string
}

defineProps<Props>()
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border-strong bg-background-surface/50',
        $props.class
      )
    "
  >
    <div v-if="icon" class="mb-4 p-4 rounded-full bg-background-hover text-foreground-muted">
      <component :is="icon" class="w-8 h-8" />
    </div>
    <h3 class="text-lg font-semibold text-foreground-primary">{{ title }}</h3>
    <p v-if="description" class="mt-2 text-sm text-foreground-muted max-w-sm">{{ description }}</p>
    <div class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>
