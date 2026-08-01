<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-6">
    <div class="flex items-center gap-4 bg-surface p-4 rounded-lg border border-border">
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-text-primary mb-1">Largest Contentful Paint (LCP)</h4>
        <p class="text-xs text-text-secondary">Measures when the largest text block or image element becomes visible within the viewport. Good: &lt; 2.5s.</p>
      </div>
      <div class="flex gap-2">
        <button 
          :disabled="isRunning"
          class="px-4 py-1.5 bg-danger text-white rounded text-sm font-medium transition-colors hover:bg-danger/80 disabled:opacity-50"
          @click="runSimulation('unoptimized')"
        >
          Simulate Unoptimized
        </button>
        <button 
          :disabled="isRunning"
          class="px-4 py-1.5 bg-success text-white rounded text-sm font-medium transition-colors hover:bg-success/80 disabled:opacity-50"
          @click="runSimulation('optimized')"
        >
          Simulate Optimized
        </button>
      </div>
    </div>

    <!-- Timeline View -->
    <div class="bg-surface border border-border p-4 rounded-lg flex flex-col relative overflow-hidden h-[200px]">
      
      <!-- Axis -->
      <div class="flex text-[10px] text-text-secondary font-mono border-b border-border pb-2 mb-4">
        <div class="flex-1">0s (Navigation)</div>
        <div class="flex-1 text-center">1.5s</div>
        <div class="flex-1 text-center text-success">2.5s (Good)</div>
        <div class="flex-1 text-center text-warning">4.0s (Needs Impr.)</div>
        <div class="flex-1 text-right text-danger">Poor</div>
      </div>

      <div class="relative flex-1">
        <!-- Bars -->
        
        <!-- TTFB -->
        <div class="flex items-center mb-3">
          <div class="w-24 text-[10px] uppercase font-bold text-text-secondary">HTML (TTFB)</div>
          <div class="h-4 bg-blue-500 rounded text-[10px] font-bold text-white flex items-center px-2 transition-all duration-[800ms] overflow-hidden whitespace-nowrap" :style="{ width: phases.ttfb + '%' }">
            Network Request
          </div>
        </div>

        <!-- Render Blocking CSS -->
        <div class="flex items-center mb-3">
          <div class="w-24 text-[10px] uppercase font-bold text-text-secondary">CSS / Fonts</div>
          <!-- Starts after TTFB -->
          <div class="h-4 bg-transparent" :style="{ width: phases.ttfb + '%' }"/>
          <div class="h-4 bg-purple-500 rounded text-[10px] font-bold text-white flex items-center px-2 transition-all duration-[800ms] overflow-hidden whitespace-nowrap" :style="{ width: phases.css + '%' }">
            Render Blocking
          </div>
        </div>

        <!-- LCP Image -->
        <div class="flex items-center">
          <div class="w-24 text-[10px] uppercase font-bold text-text-secondary">Hero Image</div>
          <div class="h-4 bg-transparent" :style="{ width: phases.imageStart + '%' }"/>
          <div
class="h-4 rounded text-[10px] font-bold text-white flex items-center px-2 transition-all duration-[800ms] overflow-hidden whitespace-nowrap" 
               :class="lcpScore === 'GOOD' ? 'bg-success' : lcpScore === 'POOR' ? 'bg-danger' : 'bg-warning'"
               :style="{ width: phases.imageDuration + '%' }">
            LCP Element Loads
          </div>
        </div>
      </div>

      <!-- Result Overlay -->
      <div v-if="lcpResult" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border p-4 rounded-xl shadow-xl flex flex-col items-center gap-2 z-20">
        <h2 class="text-3xl font-bold font-mono" :class="lcpScore === 'GOOD' ? 'text-success' : 'text-danger'">
          {{ lcpResult.toFixed(1) }}s
        </h2>
        <div class="text-xs uppercase font-bold tracking-widest text-text-secondary">
          {{ lcpScore }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isRunning = ref(false)
const lcpResult = ref<number | null>(null)

// Percentages of a 5-second total timeline (100% = 5s)
const phases = ref({
  ttfb: 0,
  css: 0,
  imageStart: 0,
  imageDuration: 0
})

const lcpScore = computed(() => {
  if (!lcpResult.value) return ''
  if (lcpResult.value <= 2.5) return 'GOOD'
  if (lcpResult.value <= 4.0) return 'NEEDS IMPROVEMENT'
  return 'POOR'
})

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const runSimulation = async (type: 'unoptimized' | 'optimized') => {
  if (isRunning.value) return
  isRunning.value = true
  lcpResult.value = null
  
  // Reset
  phases.value = { ttfb: 0, css: 0, imageStart: 0, imageDuration: 0 }
  await sleep(100)

  if (type === 'unoptimized') {
    // Unoptimized: TTFB is slow, CSS is huge and render-blocking, Image is discovered late and loads slowly.
    phases.value.ttfb = 20 // 1.0s
    await sleep(800)
    
    phases.value.css = 30 // 1.5s (Starts at 1.0s, ends at 2.5s)
    await sleep(800)
    
    phases.value.imageStart = 50 // Image discovered after CSS parses
    phases.value.imageDuration = 40 // Image takes 2.0s to load
    await sleep(800)
    
    lcpResult.value = 4.5 // Poor!
  } else {
    // Optimized: CDN caching (fast TTFB), critical CSS (fast FCP), and <link rel="preload" as="image"> for the Hero!
    phases.value.ttfb = 10 // 0.5s
    await sleep(400)
    
    // Image starts downloading immediately alongside CSS because of preload!
    phases.value.imageStart = 10 // Discovered at 0.5s
    
    phases.value.css = 10 // 0.5s
    await sleep(400)
    
    phases.value.imageDuration = 20 // 1.0s total load time (WebP optimized)
    await sleep(400)
    
    lcpResult.value = 1.5 // Good!
  }

  isRunning.value = false
}
</script>
