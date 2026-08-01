<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-6">
    <div class="flex items-center gap-4 bg-surface p-4 rounded-lg border border-border">
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-text-primary mb-1">requestAnimationFrame vs requestIdleCallback</h4>
        <p class="text-xs text-text-secondary">Compare how the browser schedules visual updates (rAF) vs background low-priority work (rIC).</p>
      </div>
      <div class="flex gap-2">
        <button 
          :disabled="isRAFRunning"
          class="px-3 py-1.5 bg-success/10 text-success border border-success/30 rounded text-sm hover:bg-success/20 transition-colors disabled:opacity-50"
          @click="startRAF"
        >
          {{ isRAFRunning ? 'Running rAF...' : 'Start rAF' }}
        </button>
        <button 
          :disabled="isRICRunning"
          class="px-3 py-1.5 bg-info/10 text-info border border-info/30 rounded text-sm hover:bg-info/20 transition-colors disabled:opacity-50"
          @click="startRIC"
        >
          {{ isRICRunning ? 'Running rIC...' : 'Start rIC' }}
        </button>
        <button 
          class="px-3 py-1.5 bg-danger text-white rounded text-sm hover:bg-danger/80 transition-colors"
          @click="blockThread"
        >
          Block Thread (200ms)
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- rAF Box -->
      <div class="bg-surface border border-border rounded-lg p-4 flex flex-col">
        <h5 class="text-sm font-bold text-success mb-3">requestAnimationFrame</h5>
        <div class="text-xs text-text-secondary mb-4 h-12">
          Schedules work to be executed right before the next repaint. Runs smoothly with the display refresh rate (typically 60 times/sec).
        </div>
        <div class="w-full h-12 bg-background border border-border relative overflow-hidden rounded">
          <div 
            class="absolute top-0 bottom-0 w-12 bg-success rounded shadow-[0_0_15px_rgba(34,197,94,0.5)] border-2 border-white/20"
            :style="{ left: `${rafPos}px`, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)' }"
          />
        </div>
        <div class="mt-4 font-mono text-xs text-text-secondary flex justify-between">
          <span>Frames: <strong class="text-text-primary">{{ rafFrames }}</strong></span>
        </div>
      </div>

      <!-- rIC Box -->
      <div class="bg-surface border border-border rounded-lg p-4 flex flex-col">
        <h5 class="text-sm font-bold text-info mb-3">requestIdleCallback</h5>
        <div class="text-xs text-text-secondary mb-4 h-12">
          Schedules work to execute when the main thread is completely idle. Drops significantly when you click "Block Thread".
        </div>
        <div class="w-full h-12 bg-background border border-border relative overflow-hidden rounded">
          <div 
            class="absolute top-0 bottom-0 w-12 bg-info rounded shadow-[0_0_15px_rgba(56,189,248,0.5)] border-2 border-white/20"
            :style="{ left: `${ricPos}px`, backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px)' }"
          />
        </div>
        <div class="mt-4 font-mono text-xs text-text-secondary flex justify-between">
          <span>Callbacks: <strong class="text-text-primary">{{ ricFrames }}</strong></span>
          <span>Time Remaining (last): <strong class="text-text-primary">{{ lastRicTimeRemaining.toFixed(1) }}ms</strong></span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const isRAFRunning = ref(false)
const isRICRunning = ref(false)

const rafPos = ref(0)
const ricPos = ref(0)

const rafFrames = ref(0)
const ricFrames = ref(0)
const lastRicTimeRemaining = ref(0)

let rafId: number | null = null
let ricId: number | null = null

let rafDir = 1
let ricDir = 1

const startRAF = () => {
  if (isRAFRunning.value) return
  isRAFRunning.value = true
  
  const updateRAF = () => {
    rafFrames.value++
    rafPos.value += 2 * rafDir
    if (rafPos.value > 250 || rafPos.value < 0) rafDir *= -1
    
    rafId = requestAnimationFrame(updateRAF)
  }
  
  rafId = requestAnimationFrame(updateRAF)
}

const startRIC = () => {
  if (isRICRunning.value) return
  isRICRunning.value = true
  
  const updateRIC = (deadline: IdleDeadline) => {
    ricFrames.value++
    lastRicTimeRemaining.value = deadline.timeRemaining()
    
    ricPos.value += 2 * ricDir
    if (ricPos.value > 250 || ricPos.value < 0) ricDir *= -1
    
    // Fallback for browsers without requestIdleCallback
    if ('requestIdleCallback' in window) {
      ricId = window.requestIdleCallback(updateRIC) as unknown as number
    } else {
      ricId = setTimeout(() => updateRIC({ timeRemaining: () => 50, didTimeout: false }), 50) as unknown as number
    }
  }
  
  if ('requestIdleCallback' in window) {
    ricId = window.requestIdleCallback(updateRIC) as unknown as number
  } else {
    ricId = setTimeout(() => updateRIC({ timeRemaining: () => 50, didTimeout: false }), 50) as unknown as number
  }
}

const blockThread = () => {
  const start = performance.now()
  while (performance.now() - start < 200) {
    // Block main thread for 200ms
  }
}

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  if (ricId !== null) {
    if ('cancelIdleCallback' in window) window.cancelIdleCallback(ricId)
    else clearTimeout(ricId)
  }
})
</script>
