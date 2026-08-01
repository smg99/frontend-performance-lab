<script setup lang="ts">
import Card from '../ui/Card.vue'

interface Props {
  title: string
  description: string
  icon?: unknown
}

defineProps<Props>()
</script>

<template>
  <Card class="p-6 flex flex-col gap-4 group hover:border-border-strong hover:shadow-md">
    <div class="flex items-center gap-3">
      <div
        v-if="icon"
        class="p-2 bg-background-surface rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
      >
        <component :is="icon" class="w-5 h-5" />
      </div>
      <h3 class="font-semibold text-lg">{{ title }}</h3>
    </div>
    <p class="text-foreground-muted text-sm leading-relaxed flex-grow">
      {{ description }}
    </p>
    <div
      class="mt-2 text-sm font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
    >
      <slot name="action">Learn more &rarr;</slot>
    </div>
  </Card>
</template>
