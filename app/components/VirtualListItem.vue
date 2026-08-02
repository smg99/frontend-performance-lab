<template>
  <div
    class="flex items-center space-x-4 p-4 border-b border-border-subtle hover:bg-background-surface transition-colors bg-background"
  >
    <img
      :src="item.avatar"
      alt="Avatar"
      class="w-12 h-12 rounded-full border border-border-subtle"
      loading="lazy"
    />
    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-semibold text-foreground-primary truncate">{{ item.name }}</h4>
      <p class="text-sm text-foreground-muted truncate">{{ item.description }}</p>
    </div>
    <div class="text-xs text-foreground-muted font-mono">ID: {{ item.id }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  item: {
    id: number
    name: string
    description: string
    avatar: string
  }
}>()
</script>
