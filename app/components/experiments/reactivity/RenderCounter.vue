<template>
  <div class="fixed bottom-4 right-4 bg-card border border-border p-4 rounded-xl shadow-subtle-dark z-50 flex items-center gap-4">
    <div class="flex flex-col">
      <span class="text-xs text-text-secondary uppercase font-semibold">Global Renders</span>
      <span ref="countNode" class="text-xl font-bold font-mono text-primary">0</span>
    </div>
    <div class="h-8 w-px bg-border"/>
    <div class="flex flex-col">
      <span class="text-xs text-text-secondary uppercase font-semibold">Last Render</span>
      <span ref="timeNode" class="text-sm font-mono text-success">0.0 ms</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUpdated, onMounted } from 'vue'

const countNode = ref<HTMLElement | null>(null)
const timeNode = ref<HTMLElement | null>(null)

let count = 0
let time = 0
let lastUpdate = 0

onUpdated(() => {
  const now = performance.now()
  time = now - lastUpdate
  lastUpdate = now
  count++
  
  if (countNode.value) countNode.value.textContent = count.toString()
  if (timeNode.value) {
    timeNode.value.textContent = `${time.toFixed(1)} ms`
    timeNode.value.className = `text-sm font-mono ${time > 16 ? 'text-danger' : 'text-success'}`
  }
})

onMounted(() => {
  lastUpdate = performance.now()
})
</script>
