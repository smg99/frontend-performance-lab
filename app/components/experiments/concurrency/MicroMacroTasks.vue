<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-6"
  >
    <div
      class="flex items-center gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-foreground-primary mb-1">Microtasks vs Macrotasks</h4>
        <p class="text-xs text-foreground-muted">
          Explore how the JavaScript engine prioritizes Promise microtasks over setTimeout
          macrotasks.
        </p>
      </div>
      <div class="flex gap-2">
        <button
          class="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded text-sm hover:bg-purple-500/20 transition-colors"
          @click="queueMicrotask('Promise')"
        >
          + Promise
        </button>
        <button
          class="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded text-sm hover:bg-blue-500/20 transition-colors"
          @click="queueMacrotask('setTimeout')"
        >
          + setTimeout
        </button>
        <button
          :disabled="isFlushing"
          class="px-4 py-1.5 bg-success text-white rounded text-sm font-medium transition-colors hover:bg-success/80 disabled:opacity-50"
          @click="flushQueues"
        >
          Flush Event Loop
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Microtask Queue -->
      <div class="bg-background-surface border border-border-subtle rounded-lg p-4 flex flex-col">
        <h5
          class="text-sm font-bold text-purple-400 mb-3 text-center border-b border-border-subtle pb-2"
        >
          Microtask Queue
        </h5>
        <div class="flex-1 flex flex-col justify-end gap-2 min-h-[150px]">
          <transition-group name="queue">
            <div
              v-for="task in microtasks"
              :key="task.id"
              class="bg-purple-500/20 border border-purple-500/50 text-purple-300 text-xs font-mono p-2 rounded text-center"
            >
              {{ task.name }} #{{ task.id }}
            </div>
          </transition-group>
          <div
            v-if="microtasks.length === 0"
            class="text-foreground-muted text-xs italic text-center py-4"
          >
            Empty
          </div>
        </div>
      </div>

      <!-- Macrotask Queue -->
      <div class="bg-background-surface border border-border-subtle rounded-lg p-4 flex flex-col">
        <h5
          class="text-sm font-bold text-blue-400 mb-3 text-center border-b border-border-subtle pb-2"
        >
          Macrotask Queue
        </h5>
        <div class="flex-1 flex flex-col justify-end gap-2 min-h-[150px]">
          <transition-group name="queue">
            <div
              v-for="task in macrotasks"
              :key="task.id"
              class="bg-blue-500/20 border border-blue-500/50 text-blue-300 text-xs font-mono p-2 rounded text-center"
            >
              {{ task.name }} #{{ task.id }}
            </div>
          </transition-group>
          <div
            v-if="macrotasks.length === 0"
            class="text-foreground-muted text-xs italic text-center py-4"
          >
            Empty
          </div>
        </div>
      </div>
    </div>

    <!-- Execution Log -->
    <div class="bg-background-surface border border-border-subtle rounded-lg p-4">
      <h5 class="text-sm font-bold text-foreground-muted mb-3">Execution Log</h5>
      <div
        class="bg-background border border-border-subtle rounded p-3 h-32 overflow-y-auto font-mono text-xs space-y-1"
      >
        <div v-for="(log, idx) in logs" :key="idx" :class="log.color">> {{ log.message }}</div>
        <div v-if="logs.length === 0" class="text-foreground-muted italic">
          Waiting for execution...
        </div>
      </div>
      <button
        class="mt-2 text-xs text-foreground-muted hover:text-foreground-primary uppercase font-bold tracking-wider"
        @click="logs = []"
      >
        Clear Log
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const microtasks = ref<{ id: number; name: string }[]>([])
const macrotasks = ref<{ id: number; name: string }[]>([])
const logs = ref<{ message: string; color: string }[]>([])
const isFlushing = ref(false)

let taskId = 1

const queueMicrotask = (name: string) => {
  microtasks.value.push({ id: taskId++, name })
}

const queueMacrotask = (name: string) => {
  macrotasks.value.push({ id: taskId++, name })
}

const flushQueues = async () => {
  if (isFlushing.value) return
  if (microtasks.value.length === 0 && macrotasks.value.length === 0) return

  isFlushing.value = true
  logs.value.push({ message: '--- Event Loop Tick Start ---', color: 'text-foreground-muted' })

  // Create static copies to animate processing
  const currentMicro = [...microtasks.value]
  const currentMacro = [...macrotasks.value]

  microtasks.value = []
  macrotasks.value = []

  // Simulate execution time visually
  for (const task of currentMicro) {
    await new Promise(resolve => setTimeout(resolve, 300))
    logs.value.push({
      message: `Executed Microtask: ${task.name} #${task.id}`,
      color: 'text-purple-400'
    })
  }

  if (currentMicro.length > 0) {
    logs.value.push({
      message: 'Microtask queue empty. Moving to Macrotasks.',
      color: 'text-foreground-muted'
    })
  }

  for (const task of currentMacro) {
    await new Promise(resolve => setTimeout(resolve, 500))
    logs.value.push({
      message: `Executed Macrotask: ${task.name} #${task.id}`,
      color: 'text-blue-400'
    })
  }

  logs.value.push({ message: '--- Tick Complete ---', color: 'text-success' })
  isFlushing.value = false
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
