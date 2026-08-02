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
  <Card
    class="relative p-6 flex flex-col gap-4 group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary overflow-hidden"
  >
    <!-- Subtle radial glow on hover -->
    <div
      class="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
    />

    <div class="relative z-10 flex flex-col gap-4 h-full">
      <div class="flex items-center gap-3">
        <div
          v-if="icon"
          class="p-2.5 bg-background-base rounded-lg text-primary shadow-sm border border-border-subtle-subtle group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
        >
          <component
            :is="icon"
            class="w-5 h-5 transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <h3 class="font-bold text-lg text-foreground-primary leading-tight">{{ title }}</h3>
      </div>

      <!-- Slot for badges like Difficulty/Category -->
      <div v-if="$slots.badges" class="flex flex-wrap gap-2">
        <slot name="badges" />
      </div>

      <p class="text-foreground-muted text-sm leading-relaxed flex-grow">
        {{ description }}
      </p>

      <div class="mt-2 flex items-center justify-between">
        <div
          class="text-sm font-medium text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-[-10px] group-hover:translate-x-0"
        >
          <slot name="action">Learn more &rarr;</slot>
        </div>

        <div v-if="$slots.meta" class="text-xs font-medium text-foreground-muted">
          <slot name="meta" />
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.bg-radial-gradient {
  background-image: radial-gradient(
    circle at 50% 120%,
    var(--tw-gradient-from) 0%,
    var(--tw-gradient-to) 70%
  );
}
</style>
