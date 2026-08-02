<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-6"
  >
    <!-- Visualizers -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- CSS Animation -->
      <div
        class="bg-background-surface border border-border-subtle rounded-lg p-6 flex flex-col items-center"
      >
        <h4 class="text-sm font-bold text-foreground-muted mb-6">CSS Thread</h4>
        <div
          class="w-16 h-16 rounded-full border-4 border-t-info border-r-info border-b-border border-l-border shadow-lg animate-[spin_1s_linear_infinite]"
        />
        <p class="text-xs text-foreground-muted mt-6 text-center">
          Spins perfectly smoothly because the Main Thread is not blocked.
        </p>
      </div>

      <!-- JS Animation (rAF) -->
      <div
        class="bg-background-surface border border-border-subtle rounded-lg p-6 flex flex-col items-center overflow-hidden"
      >
        <h4 class="text-sm font-bold text-foreground-muted mb-6">JS Thread (rAF)</h4>
        <div class="w-full h-16 relative bg-background rounded border border-border-subtle">
          <div
            class="absolute top-2 w-12 h-12 bg-success rounded shadow-lg"
            :style="{ left: `${boxPosition}px` }"
          />
        </div>
        <div
          class="mt-6 font-mono text-xl font-bold"
          :class="fps < 30 ? 'text-danger' : 'text-success'"
        >
          {{ fps }} FPS
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div
      class="flex flex-col gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex justify-between items-center">
        <div>
          <h4 class="font-bold text-foreground-primary">Asynchronous Workload (Web Worker)</h4>
          <p class="text-xs text-foreground-muted">Offloaded to a background thread</p>
        </div>
        <button
          :disabled="isRunning"
          class="px-4 py-2 bg-info text-white rounded-lg font-medium transition-colors shadow-subtle disabled:opacity-50 flex items-center gap-2"
          @click="runHeavyTask"
        >
          <span
            v-if="isRunning"
            class="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"
          />
          {{ isRunning ? 'Processing in Background...' : 'Calculate 3M Primes' }}
        </button>
      </div>

      <div
        v-if="lastResult"
        class="bg-background border border-border-subtle rounded p-3 text-sm font-mono flex flex-col gap-1"
      >
        <div class="flex justify-between">
          <span class="text-foreground-muted">Execution Time (Background):</span>
          <span class="text-info font-bold">{{ lastResult.time.toFixed(2) }} ms</span>
        </div>
        <div class="flex justify-between">
          <span class="text-foreground-muted">Primes Found:</span>
          <span class="text-success font-bold">{{ lastResult.count.toLocaleString() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import HeavyWorker from '~/workers/heavy.worker?worker'

const boxPosition = ref(0)
const direction = ref(1)
const fps = ref(60)
const isRunning = ref(false)
const lastResult = ref<{ time: number; count: number } | null>(null)

let frameId: number
let frameCount = 0
let lastFpsUpdate = performance.now()
let worker: Worker | null = null
let nextJobId = 0

const updateFrame = () => {
  const now = performance.now()
  frameCount++

  if (now - lastFpsUpdate >= 1000) {
    fps.value = frameCount
    frameCount = 0
    lastFpsUpdate = now
  }

  const containerWidth = 300
  boxPosition.value += 3 * direction.value

  if (boxPosition.value >= containerWidth - 48 || boxPosition.value <= 0) {
    direction.value *= -1
  }

  frameId = requestAnimationFrame(updateFrame)
}

onMounted(() => {
  frameId = requestAnimationFrame(updateFrame)
  worker = new HeavyWorker()
})

onUnmounted(() => {
  cancelAnimationFrame(frameId)
  if (worker) {
    worker.terminate()
  }
})

const runHeavyTask = () => {
  if (!worker || isRunning.value) return

  isRunning.value = true
  lastResult.value = null

  const jobId = nextJobId++

  worker.onmessage = e => {
    if (e.data.id === jobId) {
      lastResult.value = {
        time: e.data.executionTime,
        count: e.data.result.length
      }
      isRunning.value = false
    }
  }

  worker.postMessage({
    id: jobId,
    type: 'primes',
    payload: 3000000
  })
}
</script>
