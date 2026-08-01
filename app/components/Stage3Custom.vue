<template>
  <div ref="container" class="h-full w-full absolute inset-0 bg-background overflow-y-auto" @scroll.passive="onScroll">
    <!-- The scrollable ghost element to maintain scrollbar height -->
    <div :style="{ height: totalHeight + 'px' }" class="relative w-full">
      <!-- The inner positioned elements -->
      <div 
        class="absolute left-0 right-0"
        :style="{ transform: `translateY(${offsetY}px)` }"
      >
        <div v-for="item in visibleItems" :key="item.id">
          <VirtualListItem :item="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  items: Array<{
    id: number
    name: string
    description: string
    avatar: string
  }>
}>()

// --- Custom Virtualization Engine ---

// 1. Visible window calculation
const container = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const containerHeight = ref(800) // Fallback

// 2. Buffer management & Overscan
const itemHeight = 81 // Fixed height for this demo, dynamic height would require a ResizeObserver per item + a position cache
const overscan = 5 // Render items outside the viewport to prevent flickering when scrolling fast

const onScroll = () => {
  if (container.value) {
    scrollTop.value = container.value.scrollTop
  }
}

// 3. Scroll offset & Item positioning
const totalHeight = computed(() => props.items.length * itemHeight)

const startIndex = computed(() => {
  const start = Math.floor(scrollTop.value / itemHeight)
  return Math.max(0, start - overscan)
})

const endIndex = computed(() => {
  const visibleCount = Math.ceil(containerHeight.value / itemHeight)
  const end = startIndex.value + visibleCount + (overscan * 2)
  return Math.min(props.items.length - 1, end)
})

const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value + 1)
})

// Calculate the Y offset to push the visible items down visually inside the scrollable container
const offsetY = computed(() => startIndex.value * itemHeight)

// Update container height on resize to recalculate visible window
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (container.value) {
    containerHeight.value = container.value.clientHeight
    
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerHeight.value = entry.contentRect.height
      }
    })
    resizeObserver.observe(container.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver && container.value) {
    resizeObserver.unobserve(container.value)
  }
})

// Reset scroll on item change
watch(() => props.items, () => {
  if (container.value) {
    container.value.scrollTop = 0
  }
})
</script>

<style scoped>
/* DOM recycling note: Vue's v-for with :key automatically handles DOM node recycling efficiently for us in this structure. */
</style>
