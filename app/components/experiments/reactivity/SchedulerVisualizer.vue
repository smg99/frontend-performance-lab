<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-6">
    <div class="flex items-center gap-4 bg-surface p-4 rounded-lg border border-border">
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-text-primary mb-1">Async Scheduler & Batching</h4>
        <p class="text-xs text-text-secondary">Simulates Vue's nextTick scheduler. Rapid mutations are deduplicated into a single flush cycle.</p>
      </div>
      <button 
        :disabled="isFlushing" 
        class="px-4 py-2 bg-primary text-white rounded-lg font-medium transition-colors shadow-subtle text-sm disabled:opacity-50"
        @click="triggerRapidMutations"
      >
        Fire 5 Mutations
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Queue Status -->
      <div>
        <h5 class="text-sm font-bold text-text-secondary mb-3">Job Queue (Microtasks)</h5>
        <div class="bg-surface border border-border rounded-lg p-4 space-y-2 h-[200px] overflow-hidden flex flex-col justify-end">
          <transition-group name="queue">
            <div 
              v-for="job in queue" 
              :key="job.id" 
              class="bg-warning/20 border border-warning text-warning text-xs font-mono p-2 rounded mb-2 text-center"
            >
              {{ job.name }}
            </div>
          </transition-group>
          <div v-if="queue.length === 0" class="text-text-secondary text-xs italic text-center py-2">
            Queue is empty
          </div>
        </div>
      </div>
      
      <!-- Render/Flush status -->
      <div class="flex flex-col items-center justify-center bg-surface border border-border rounded-lg p-6 relative overflow-hidden">
        <h5 class="text-sm font-bold text-text-secondary mb-6 absolute top-4 left-4">Scheduler Flush</h5>
        
        <div 
          class="w-32 h-32 rounded-full flex items-center justify-center text-center transition-all duration-500 border-4"
          :class="isFlushing ? 'bg-success/20 border-success shadow-[0_0_30px_rgba(34,197,94,0.4)] scale-110' : 'bg-background border-border scale-100'"
        >
          <div class="flex flex-col">
            <span class="font-bold text-lg" :class="isFlushing ? 'text-success' : 'text-text-primary'">
              {{ isFlushing ? 'FLUSHING' : 'IDLE' }}
            </span>
            <span v-if="isFlushing" class="text-xs text-success font-mono mt-1">Render Cycle</span>
          </div>
        </div>
        
        <div class="absolute bottom-4 right-4 text-xs font-mono text-text-secondary">
          Total Renders: <span class="text-primary font-bold">{{ totalRenders }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const queue = ref<{id: number, name: string}[]>([])
const isFlushing = ref(false)
const totalRenders = ref(0)
let jobId = 0

const triggerRapidMutations = () => {
  if (isFlushing.value) return
  
  // Simulate 5 rapid synchronous mutations
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      // Vue deduplicates components in the queue, so we represent it as the same component job
      if (queue.value.length === 0) {
        queue.value.push({ id: jobId++, name: 'ComponentUpdateJob' })
      }
    }, i * 50)
  }
  
  // Simulate microtask flush after sync code runs
  setTimeout(() => {
    isFlushing.value = true
    setTimeout(() => {
      queue.value = []
      totalRenders.value++
      setTimeout(() => {
        isFlushing.value = false
      }, 500)
    }, 600)
  }, 300)
}
</script>

<style scoped>
.queue-enter-active,
.queue-leave-active {
  transition: all 0.3s ease;
}
.queue-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.queue-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
