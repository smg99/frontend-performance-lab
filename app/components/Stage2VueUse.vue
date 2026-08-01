<template>
  <div class="h-full w-full absolute inset-0">
    <div v-bind="containerProps" class="h-full w-full rounded-b-xl overflow-y-auto bg-background">
      <div v-bind="wrapperProps">
        <div v-for="item in list" :key="item.data.id">
          <VirtualListItem :item="item.data" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'
import { toRef } from 'vue'

const props = defineProps<{
  items: Array<{
    id: number
    name: string
    description: string
    avatar: string
  }>
}>()

const itemsRef = toRef(props, 'items')

const { list, containerProps, wrapperProps } = useVirtualList(itemsRef, {
  // Approximate height of the item (81px based on paddings + content)
  itemHeight: 81,
  overscan: 10
})
</script>
