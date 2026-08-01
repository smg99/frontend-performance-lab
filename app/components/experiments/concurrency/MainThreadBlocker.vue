<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-6">
    <!-- Visualizers -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <!-- CSS Animation -->
      <div class="bg-surface border border-border rounded-lg p-6 flex flex-col items-center">
        <h4 class="text-sm font-bold text-text-secondary mb-6">CSS Thread</h4>
        <div class="w-16 h-16 rounded-full border-4 border-t-primary border-r-primary border-b-border border-l-border shadow-lg animate-[spin_1s_linear_infinite]"/>
        <p class="text-xs text-text-secondary mt-6 text-center">CSS animations might keep running (if composited) but usually jank when the main thread blocks.</p>
      </div>

      <!-- JS Animation (rAF) -->
      <div class="bg-surface border border-border rounded-lg p-6 flex flex-col items-center overflow-hidden">
        <h4 class="text-sm font-bold text-text-secondary mb-6">JS Thread (rAF)</h4>
        <div class="w-full h-16 relative bg-background rounded border border-border">
          <div 
            class="absolute top-2 w-12 h-12 bg-success rounded shadow-lg"
            :style="{ left: `${boxPosition}px` }"
          />
        </div>
        <div class="mt-6 font-mono text-xl font-bold" :class="fps < 30 ? 'text-danger' : 'text-success'">
          {{ fps }} FPS
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col gap-4 bg-surface p-4 rounded-lg border border-border">
      <div class="flex justify-between items-center">
        <div>
          <h4 class="font-bold text-text-primary">Synchronous Workload</h4>
          <p class="text-xs text-text-secondary">Runs directly on the Main Thread</p>
        </div>
        <button 
          :disabled="isRunning"
          class="px-4 py-2 bg-danger text-white rounded-lg font-medium transition-colors shadow-subtle disabled:opacity-50"
          @click="runHeavyTask"
        >
          {{ isRunning ? 'Freezing UI...' : 'Calculate 3M Primes' }}
        </button>
      </div>

      <div v-if="lastResult" class="bg-background border border-border rounded p-3 text-sm font-mono flex flex-col gap-1">
        <div class="flex justify-between">
          <span class="text-text-secondary">Execution Time (Blocked):</span>
          <span class="text-danger font-bold">{{ lastResult.time.toFixed(2) }} ms</span>
        </div>
        <div class="flex justify-between">
          <span class="text-text-secondary">Primes Found:</span>
          <span class="text-primary font-bold">{{ lastResult.count.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { calculatePrimes } from '~/workers/heavy.worker'

const boxPosition = ref(0)
const direction = ref(1)
const fps = ref(60)
const isRunning = ref(false)
const lastResult = ref<{ time: number, count: number } | null>(null)

let frameId: number
let frameCount = 0
let lastFpsUpdate = performance.now()

const updateFrame = () => {
  const now = performance.now()
  frameCount++
  
  if (now - lastFpsUpdate >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastFpsUpdate = now
  }
  
  // Bounce animation logic
  const containerWidth = 300 // Approximation since we can't reliably read DOM widths during jank
  boxPosition.value += 3 * direction.value
  
  if (boxPosition.value >= containerWidth - 48 || boxPosition.value <= 0) {
    direction.value *= -1
  }

  frameId = requestAnimationFrame(updateFrame)
}

onMounted(() => {
  frameId = requestAnimationFrame(updateFrame)
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
})

const runHeavyTask = () => {
  isRunning.value = true
  lastResult.value = null
  
  // We use setTimeout so Vue can update the button state to "Running"
  // BEFORE we completely freeze the thread
  setTimeout(() => {
    const start = performance.now()
    
    // This synchronously blocks the main thread for several seconds
    const primes = calculatePrimes(3000000) 
    
    const end = performance.now()
    
    lastResult.value = {
      time: end - start,
      count: primes.length
    }
    isRunning.value = false
  }, 50)
}
</script>
