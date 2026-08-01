<template>
  <div class="flex items-center space-x-4 p-4 border-b border-border hover:bg-surface transition-colors bg-background">
    <img :src="item.avatar" alt="Avatar" class="w-12 h-12 rounded-full border border-border" loading="lazy" >
    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-semibold text-text-primary truncate">{{ item.name }}</h4>
      <p class="text-sm text-text-secondary truncate">{{ item.description }}</p>
    </div>
    <div class="text-xs text-text-secondary font-mono">
      ID: {{ item.id }}
    </div>
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
