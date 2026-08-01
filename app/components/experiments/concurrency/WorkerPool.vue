<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-6">
    <div class="flex items-center gap-4 bg-surface p-4 rounded-lg border border-border">
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-text-primary mb-1">Web Worker Pool</h4>
        <p class="text-xs text-text-secondary">Distributes heavy calculations across multiple background threads to maximize multi-core CPU utilization.</p>
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <button v-for="n in [1, 2, 4, 8]" :key="n" class="px-3 py-1 bg-background border rounded text-xs transition-colors" :class="poolSize === n ? 'border-primary text-primary font-bold' : 'border-border text-text-secondary hover:text-text-primary'" @click="poolSize = n">
            {{ n }} Worker{{ n > 1 ? 's' : '' }}
          </button>
        </div>
        <button 
          :disabled="isProcessing"
          class="px-4 py-1.5 bg-success text-white rounded text-sm font-medium transition-colors hover:bg-success/80 disabled:opacity-50"
          @click="startProcessing"
        >
          {{ isProcessing ? 'Processing...' : 'Run 20 Heavy Jobs' }}
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div v-if="totalTime > 0" class="flex gap-4">
      <div class="bg-surface border border-border rounded px-4 py-2 flex flex-col items-center flex-1">
        <span class="text-xs text-text-secondary uppercase">Total Time</span>
        <span class="text-xl font-bold text-primary">{{ totalTime.toFixed(0) }} ms</span>
      </div>
      <div class="bg-surface border border-border rounded px-4 py-2 flex flex-col items-center flex-1">
        <span class="text-xs text-text-secondary uppercase">Speedup</span>
        <span class="text-xl font-bold text-success">{{ speedup.toFixed(1) }}x</span>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <!-- Worker Nodes -->
      <div 
        v-for="worker in workers" 
        :key="worker.id"
        class="bg-surface border border-border rounded-lg p-4 flex flex-col relative overflow-hidden"
      >
        <div class="flex justify-between items-center mb-2 z-10 relative">
          <h5 class="text-sm font-bold text-text-secondary flex items-center gap-2">
            Thread #{{ worker.id }}
            <span class="w-2 h-2 rounded-full" :class="worker.isBusy ? 'bg-warning animate-pulse' : 'bg-success'"/>
          </h5>
          <span class="text-xs font-mono" :class="worker.isBusy ? 'text-warning' : 'text-success'">
            {{ worker.isBusy ? `Processing Job ${worker.currentJob}...` : 'Idle' }}
          </span>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-background rounded-full h-1.5 mb-1 z-10 relative overflow-hidden">
          <div 
            class="bg-warning h-1.5 rounded-full transition-all duration-[200ms] ease-linear"
            :style="{ width: `${worker.progress}%` }"
          />
        </div>
        
        <div class="text-[10px] text-text-secondary text-right z-10 relative">
          Completed: {{ worker.completedJobs }}
        </div>
        
        <!-- Busy Background Glow -->
        <div 
          class="absolute inset-0 bg-warning/5 transition-opacity duration-300"
          :class="worker.isBusy ? 'opacity-100' : 'opacity-0'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const poolSize = ref(4)
const isProcessing = ref(false)
const totalTime = ref(0)
const baseTime = ref(0)

interface WorkerState {
  id: number
  isBusy: boolean
  progress: number
  currentJob: number | null
  completedJobs: number
}

const workers = ref<WorkerState[]>([])

// Init workers array visually
watch(poolSize, (size) => {
  if (isProcessing.value) return
  workers.value = Array.from({ length: size }, (_, i) => ({
    id: i + 1,
    isBusy: false,
    progress: 0,
    currentJob: null,
    completedJobs: 0
  }))
}, { immediate: true })

const speedup = computed(() => {
  if (baseTime.value === 0 || totalTime.value === 0) return 1
  return baseTime.value / totalTime.value
})

const startProcessing = async () => {
  if (isProcessing.value) return
  isProcessing.value = true
  
  // Reset stats
  workers.value.forEach(w => {
    w.completedJobs = 0
    w.progress = 0
  })
  
  const jobs = Array.from({ length: 20 }, (_, i) => i + 1)
  const startTime = performance.now()
  
  // Simulated processing function for visual effect
  // In a real implementation, this would send postMessage to real Web Workers
  const processJob = async (worker: WorkerState, jobId: number) => {
    worker.isBusy = true
    worker.currentJob = jobId
    worker.progress = 0
    
    // Simulate heavy calculation time (e.g., 300ms)
    const duration = 300
    const steps = 10
    const stepTime = duration / steps
    
    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepTime))
      worker.progress = (i / steps) * 100
    }
    
    worker.completedJobs++
    worker.isBusy = false
    worker.currentJob = null
    worker.progress = 0
  }

  const runPool = async () => {
    const promises = []
    
    while (jobs.length > 0) {
      // Find idle workers
      const idleWorkers = workers.value.filter(w => !w.isBusy)
      
      if (idleWorkers.length > 0 && jobs.length > 0) {
        const worker = idleWorkers[0]
        const job = jobs.shift()!
        
        // Start job and don't await it here, push to active promises
        const p = processJob(worker, job).then(() => {
          // Promise completed, remove from array
          const idx = promises.indexOf(p)
          if (idx > -1) promises.splice(idx, 1)
        })
        promises.push(p)
      } else {
        // All workers busy, wait a tick and check again
        await new Promise(resolve => setTimeout(resolve, 20))
      }
    }
    
    // Wait for all remaining active promises to finish
    await Promise.all(promises)
  }
  
  await runPool()
  
  const endTime = performance.now()
  totalTime.value = endTime - startTime
  
  // The baseline time is what 1 worker would have taken (20 jobs * 300ms = 6000ms)
  baseTime.value = 6000 
  
  isProcessing.value = false
}
</script>
