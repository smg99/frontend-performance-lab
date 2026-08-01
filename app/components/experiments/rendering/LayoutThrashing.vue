<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-6">
    
    <div class="flex items-center gap-4 bg-surface p-4 rounded-lg border border-border">
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-text-primary mb-1">Layout Thrashing vs Batching</h4>
        <p class="text-xs text-text-secondary">Compare a naïve read/write loop vs batched DOM operations across 500 elements.</p>
      </div>
      <div class="flex gap-2">
        <button 
          :disabled="isRunning"
          class="px-4 py-1.5 bg-danger text-white rounded text-sm font-medium transition-colors hover:bg-danger/80 disabled:opacity-50"
          @click="runThrashing"
        >
          Force Thrashing
        </button>
        <button 
          :disabled="isRunning"
          class="px-4 py-1.5 bg-success text-white rounded text-sm font-medium transition-colors hover:bg-success/80 disabled:opacity-50"
          @click="runBatched"
        >
          Batched (FastDOM)
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div v-if="lastRun" class="flex gap-4">
      <div class="bg-surface border border-border rounded px-4 py-3 flex flex-col items-center flex-1">
        <span class="text-xs text-text-secondary uppercase mb-1">Execution Time</span>
        <span class="text-xl font-bold" :class="lastRun.type === 'thrash' ? 'text-danger' : 'text-success'">
          {{ lastRun.time.toFixed(1) }} ms
        </span>
      </div>
      <div class="bg-surface border border-border rounded px-4 py-3 flex flex-col items-center flex-1">
        <span class="text-xs text-text-secondary uppercase mb-1">FPS Drop</span>
        <span class="text-xl font-bold" :class="lastRun.type === 'thrash' ? 'text-danger' : 'text-success'">
          {{ lastRun.fpsDrop ? 'Severe (Jank)' : 'Minimal' }}
        </span>
      </div>
      <div class="bg-surface border border-border rounded px-4 py-3 flex flex-col items-center flex-1">
        <span class="text-xs text-text-secondary uppercase mb-1">Recalculate Style Count</span>
        <span class="text-xl font-bold" :class="lastRun.type === 'thrash' ? 'text-danger' : 'text-success'">
          {{ lastRun.layoutCount }}
        </span>
      </div>
    </div>

    <!-- DOM Elements Container -->
    <div class="bg-background border border-border p-4 rounded-lg">
      <div class="text-xs text-text-secondary mb-2 flex justify-between">
        <span>500 DOM Elements</span>
        <span v-if="isRunning" class="text-warning animate-pulse">Running...</span>
      </div>
      
      <!-- We use a massive grid of small bars -->
      <div ref="container" class="flex flex-wrap gap-1 h-[200px] content-start overflow-hidden">
        <div 
          v-for="i in 500" 
          :key="i"
          class="thrash-item h-2 bg-primary rounded-sm transition-none"
          :style="{ width: `${20 + (i % 20)}px` }"
        />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const container = ref<HTMLElement | null>(null)
const isRunning = ref(false)
const lastRun = ref<{ type: 'thrash' | 'batched', time: number, fpsDrop: boolean, layoutCount: number } | null>(null)

// A hack to track FPS drops
let lastFrameTime = performance.now()
let currentFps = 60

const updateFps = () => {
  const now = performance.now()
  const delta = now - lastFrameTime
  currentFps = 1000 / delta
  lastFrameTime = now
  requestAnimationFrame(updateFps)
}

onMounted(() => {
  requestAnimationFrame(updateFps)
})

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const runThrashing = async () => {
  if (isRunning.value || !container.value) return
  isRunning.value = true
  lastRun.value = null
  
  // Wait a tick so UI updates to "Running..."
  await sleep(50)
  
  const items = container.value.querySelectorAll('.thrash-item') as NodeListOf<HTMLElement>
  
  // Clear any previous inline width styles to reset
  items.forEach(el => el.style.width = '')

  const start = performance.now()
  const startFps = currentFps
  
  // THRASHING LOOP:
  // Read (offsetWidth forces layout) -> Write (style.width invalidates layout)
  // This forces the browser to synchronously recalculate layout 500 times.
  for (let i = 0; i < items.length; i++) {
    const el = items[i]
    // READ (Forces synchronous layout recalculation)
    const currentWidth = el.offsetWidth
    
    // WRITE (Invalidates the layout tree)
    el.style.width = `${currentWidth + (Math.random() * 5)}px`
  }
  
  const end = performance.now()
  
  // We can't actually intercept the browser's internal layout count from JS,
  // so we simulate the metric based on what we know happens structurally.
  lastRun.value = {
    type: 'thrash',
    time: end - start,
    fpsDrop: (startFps - currentFps) > 20 || (end - start) > 50,
    layoutCount: 500 // 500 forced sync layouts
  }
  
  isRunning.value = false
}

const runBatched = async () => {
  if (isRunning.value || !container.value) return
  isRunning.value = true
  lastRun.value = null
  
  await sleep(50)
  
  const items = container.value.querySelectorAll('.thrash-item') as NodeListOf<HTMLElement>
  
  items.forEach(el => el.style.width = '')

  const start = performance.now()
  
  // BATCHED LOOP (FastDOM style):
  // 1. Read all properties first (Browser calculates layout ONCE)
  const widths = new Array(items.length)
  for (let i = 0; i < items.length; i++) {
    // READ ONLY
    widths[i] = items[i].offsetWidth
  }
  
  // 2. Write all properties second (Invalidates layout ONCE)
  for (let i = 0; i < items.length; i++) {
    // WRITE ONLY
    items[i].style.width = `${widths[i] + (Math.random() * 5)}px`
  }
  
  // The layout won't actually be recalculated until the JS thread finishes and hands back to the browser Paint step!
  
  const end = performance.now()
  
  lastRun.value = {
    type: 'batched',
    time: end - start,
    fpsDrop: false, // Too fast to drop a frame
    layoutCount: 1 // Only 1 final layout calculation before paint
  }
  
  isRunning.value = false
}
</script>
