<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-6">
    <div class="flex items-center gap-4 bg-surface p-4 rounded-lg border border-border">
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-text-primary mb-1">Cumulative Layout Shift (CLS)</h4>
        <p class="text-xs text-text-secondary">Measures visual stability. Unexpected shifts (e.g., late-loading images without dimensions) ruin the user experience.</p>
      </div>
      <div class="flex gap-2">
        <button 
          :disabled="isRunning"
          class="px-4 py-1.5 bg-danger text-white rounded text-sm font-medium transition-colors hover:bg-danger/80 disabled:opacity-50"
          @click="loadPage('bad')"
        >
          Load without dimensions
        </button>
        <button 
          :disabled="isRunning"
          class="px-4 py-1.5 bg-success text-white rounded text-sm font-medium transition-colors hover:bg-success/80 disabled:opacity-50"
          @click="loadPage('good')"
        >
          Load with aspects/dims
        </button>
      </div>
    </div>

    <!-- The Sandbox -->
    <div class="flex flex-col md:flex-row gap-6">
      
      <!-- Visual Area -->
      <div class="flex-1 bg-background border border-border rounded-lg p-6 relative overflow-hidden h-[300px]">
        <div class="max-w-sm mx-auto flex flex-col relative" :class="{ 'opacity-50': isRunning && !isLoaded }">
          
          <h1 class="text-xl font-bold mb-4">News Article</h1>
          <p class="text-sm text-text-secondary mb-4">You are reading a very interesting article and are just about to click a link.</p>
          
          <!-- The shifting element -->
          <div 
            class="bg-surface border border-border rounded flex items-center justify-center transition-all duration-75 overflow-hidden"
            :class="[
              isLoaded ? 'h-[150px]' : (mode === 'good' ? 'h-[150px] bg-border/20' : 'h-0 border-0'),
              showShiftOverlay ? 'ring-4 ring-danger bg-danger/10' : ''
            ]"
          >
            <span v-if="isLoaded" class="text-xs font-bold text-text-secondary uppercase">Hero Image Loaded</span>
            <span v-else-if="mode === 'good'" class="text-[10px] text-text-secondary uppercase animate-pulse">Reserving Space...</span>
          </div>

          <!-- The text that gets pushed down -->
          <div class="mt-4 transition-all duration-75" :class="{ 'translate-y-2': showShiftOverlay }">
            <p class="text-sm text-text-secondary mb-2">Here is the link you wanted to click:</p>
            <button class="px-4 py-2 bg-primary text-white rounded text-sm font-bold w-full hover:bg-primary/90">
              Click Me Important Link
            </button>
          </div>

        </div>
      </div>

      <!-- Metrics -->
      <div class="w-48 bg-surface border border-border rounded-lg p-6 flex flex-col items-center justify-center gap-2">
        <h5 class="text-xs font-bold text-text-secondary uppercase tracking-widest mb-2">CLS Score</h5>
        <div class="text-4xl font-bold font-mono" :class="clsScore > 0.1 ? 'text-danger' : 'text-success'">
          {{ clsScore.toFixed(3) }}
        </div>
        <div
class="text-[10px] font-bold px-2 py-1 rounded mt-2 uppercase tracking-widest"
             :class="clsScore === 0 ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'">
          {{ clsScore === 0 ? 'Good' : 'Poor' }}
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isRunning = ref(false)
const isLoaded = ref(false)
const mode = ref<'good' | 'bad' | ''>('')
const clsScore = ref(0)
const showShiftOverlay = ref(false)

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const loadPage = async (type: 'good' | 'bad') => {
  if (isRunning.value) return
  isRunning.value = true
  isLoaded.value = false
  showShiftOverlay.value = false
  mode.value = type
  clsScore.value = 0
  
  await sleep(1000)
  
  // The image "loads"
  isLoaded.value = true
  
  if (type === 'bad') {
    // Layout shifts aggressively
    clsScore.value = 0.450 // Poor CLS
    showShiftOverlay.value = true
    await sleep(500)
    showShiftOverlay.value = false
  } else {
    // No shift! Space was reserved.
    clsScore.value = 0.000 // Perfect CLS
  }
  
  isRunning.value = false
}
</script>
