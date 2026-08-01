<script setup lang="ts">
import { cn } from '../../utils/cn'

interface Props {
  title: string
  description?: string
  class?: string
}

defineProps<Props>()
</script>

<template>
  <header :class="cn('flex flex-col gap-2 mb-8', $props.class)">
    <h1 class="text-3xl font-bold tracking-tight text-foreground-primary">{{ title }}</h1>
    <p v-if="description" class="text-lg text-foreground-muted max-w-2xl">{{ description }}</p>
    <div class="mt-4 flex items-center gap-4">
      <slot name="actions" />
    </div>
  </header>
</template>
