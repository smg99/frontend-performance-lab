<template>
  <div class="h-full overflow-y-auto w-full absolute inset-0">
    <div v-for="item in items" :key="item.id">
      <VirtualListItem :item="item" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{
    id: number
    name: string
    description: string
    avatar: string
  }>
}>()
</script>
