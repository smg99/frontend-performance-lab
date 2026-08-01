<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-6">
    <div class="flex items-center gap-4 bg-surface p-4 rounded-lg border border-border">
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-text-primary mb-1">Reactivity Lifecycle Timeline</h4>
        <p class="text-xs text-text-secondary">Simulates the micro-task queue and render pipeline for a single reactive update.</p>
      </div>
      <button 
        :disabled="isRunning" 
        class="px-4 py-2 bg-primary text-white rounded-lg font-medium transition-colors shadow-subtle text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        @click="runSimulation"
      >
        {{ isRunning ? 'Simulating...' : 'Simulate Update' }}
      </button>
    </div>

    <!-- Timeline View -->
    <div class="relative pl-6 border-l-2 border-border py-4 font-mono text-sm space-y-4">
      <transition-group name="timeline" tag="div" class="space-y-4">
        <div 
          v-for="event in events" 
          :key="event.id" 
          class="relative flex items-center gap-4"
        >
          <!-- Timeline Dot -->
          <div 
            class="absolute -left-[31px] w-3 h-3 rounded-full border-2 border-surface"
            :class="getEventColor(event.type)"
          />
          
          <!-- Time -->
          <div class="w-16 text-right font-bold" :class="getEventTextColor(event.type)">
            {{ event.time.toFixed(1) }} ms
          </div>
          
          <!-- Arrow -->
          <div class="text-text-secondary text-xs">→</div>
          
          <!-- Label -->
          <div class="flex-1 bg-surface border border-border px-4 py-2 rounded-lg text-text-primary">
            {{ event.label }}
          </div>
        </div>
      </transition-group>
      
      <div v-if="events.length === 0" class="text-text-secondary text-xs italic">
        Waiting for simulation to start...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ advanced?: boolean }>()

type EventType = 'mutate' | 'track' | 'invalidate' | 'effect' | 'render' | 'patch' | 'paint'

interface TimelineEvent {
  id: number
  time: number
  type: EventType
  label: string
}

const events = ref<TimelineEvent[]>([])
const isRunning = ref(false)
let eventIdCounter = 0

const SIMULATION_STEPS: Omit<TimelineEvent, 'id' | 'time'>[] = [
  { type: 'mutate', label: 'State Changed (count.value++)' },
  { type: 'track', label: 'Dependency Tracked (Proxy set)' },
  { type: 'invalidate', label: 'Computed Invalidated (dirty = true)' },
  { type: 'effect', label: 'Watch Triggered (Job added to Queue)' },
  { type: 'render', label: 'Render Scheduled (Microtask)' },
  { type: 'patch', label: 'DOM Patched (Virtual DOM Diff)' },
  { type: 'paint', label: 'Paint Complete (Browser Render)' }
]

const getEventColor = (type: EventType) => {
  switch (type) {
    case 'mutate': return 'bg-primary'
    case 'track': return 'bg-[#3B82F6]'
    case 'invalidate': return 'bg-warning'
    case 'effect': return 'bg-[#8B5CF6]'
    case 'render': return 'bg-danger'
    case 'patch': return 'bg-success'
    case 'paint': return 'bg-border'
    default: return 'bg-border'
  }
}

const getEventTextColor = (type: EventType) => {
  switch (type) {
    case 'mutate': return 'text-primary'
    case 'track': return 'text-[#3B82F6]'
    case 'invalidate': return 'text-warning'
    case 'effect': return 'text-[#8B5CF6]'
    case 'render': return 'text-danger'
    case 'patch': return 'text-success'
    case 'paint': return 'text-text-secondary'
    default: return 'text-text-secondary'
  }
}

const runSimulation = () => {
  if (isRunning.value) return
  
  isRunning.value = true
  events.value = []
  
  const startTime = performance.now()
  let stepIndex = 0
  
  const processNext = () => {
    if (stepIndex >= SIMULATION_STEPS.length) {
      isRunning.value = false
      return
    }
    
    const step = SIMULATION_STEPS[stepIndex]
    const currentTime = performance.now()
    
    events.value.push({
      id: eventIdCounter++,
      time: currentTime - startTime,
      type: step.type,
      label: step.label
    })
    
    stepIndex++
    
    // Random delay between 50ms and 200ms to simulate work, except paint which takes longer
    const delay = step.type === 'patch' ? 300 : Math.random() * 150 + 50
    setTimeout(processNext, delay)
  }
  
  processNext()
}
</script>

<style scoped>
.timeline-enter-active,
.timeline-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.timeline-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.timeline-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
