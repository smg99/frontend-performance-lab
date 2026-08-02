<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-6"
  >
    <div
      class="flex items-center gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-foreground-primary mb-1">Long Task Monitor</h4>
        <p class="text-xs text-foreground-muted">
          Detects JavaScript tasks exceeding 50ms using the PerformanceObserver API.
        </p>
      </div>
      <div class="flex gap-2">
        <button
          class="px-3 py-1.5 bg-warning/10 text-warning border border-warning/30 rounded text-sm hover:bg-warning/20 transition-colors"
          @click="simulateLongTask(60)"
        >
          60ms Task
        </button>
        <button
          class="px-3 py-1.5 bg-danger/10 text-danger border border-danger/30 rounded text-sm hover:bg-danger/20 transition-colors"
          @click="simulateLongTask(150)"
        >
          150ms Task
        </button>
        <button
          class="px-3 py-1.5 bg-background border border-border-subtle text-foreground-muted rounded text-sm hover:text-foreground-primary transition-colors"
          @click="clearTasks"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Long Tasks List -->
    <div class="bg-background-surface border border-border-subtle rounded-lg p-0 overflow-hidden">
      <table class="w-full text-left text-sm">
        <thead class="bg-background-base border-b border-border-subtle">
          <tr>
            <th class="px-4 py-3 font-semibold text-foreground-muted w-24">Timestamp</th>
            <th class="px-4 py-3 font-semibold text-foreground-muted w-32">Duration</th>
            <th class="px-4 py-3 font-semibold text-foreground-muted">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(task, i) in longTasks"
            :key="i"
            class="border-b border-border-subtle last:border-0 hover:bg-background transition-colors"
          >
            <td class="px-4 py-3 font-mono text-foreground-muted">
              {{ task.startTime.toFixed(0) }}ms
            </td>
            <td
              class="px-4 py-3 font-mono font-bold"
              :class="task.duration > 100 ? 'text-danger' : 'text-warning'"
            >
              {{ task.duration.toFixed(1) }} ms
            </td>
            <td class="px-4 py-3">
              <span
                v-if="task.duration > 100"
                class="inline-flex items-center gap-1 text-danger text-xs font-bold bg-danger/10 px-2 py-0.5 rounded"
              >
                CRITICAL JANK
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 text-warning text-xs font-bold bg-warning/10 px-2 py-0.5 rounded"
              >
                MINOR JANK
              </span>
            </td>
          </tr>
          <tr v-if="longTasks.length === 0">
            <td colspan="3" class="px-4 py-8 text-center text-foreground-muted italic">
              No long tasks detected yet. Click the buttons above to block the main thread.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface LongTaskEntry {
  startTime: number
  duration: number
}

const longTasks = ref<LongTaskEntry[]>([])
let observer: PerformanceObserver | null = null

onMounted(() => {
  if (typeof PerformanceObserver !== 'undefined') {
    try {
      observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          longTasks.value.unshift({
            startTime: entry.startTime,
            duration: entry.duration
          })

          // Keep only last 10 for UI
          if (longTasks.value.length > 10) {
            longTasks.value.pop()
          }
        }
      })

      observer.observe({ entryTypes: ['longtask'] })
    } catch {
      console.warn('Long Tasks API not supported in this browser.')
    }
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

const simulateLongTask = (ms: number) => {
  // Use setTimeout to allow Vue to re-render the button click effect before freezing
  setTimeout(() => {
    const start = performance.now()
    while (performance.now() - start < ms) {
      // Synchronous block
    }
  }, 50)
}

const clearTasks = () => {
  longTasks.value = []
}
</script>
