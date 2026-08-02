<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-6"
  >
    <div
      class="flex items-center gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-foreground-primary mb-1">Detached DOM Leak</h4>
        <p class="text-xs text-foreground-muted">
          If you remove a DOM node from the document, but keep a JavaScript reference to it, the
          browser cannot garbage collect it. This is a "Detached DOM" memory leak.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Controls -->
      <div class="flex flex-col gap-4">
        <div
          class="bg-background-surface border border-border-subtle p-4 rounded-lg flex flex-col gap-3"
        >
          <h5 class="font-bold text-sm text-foreground-primary">Leak Mechanism</h5>
          <button
            class="px-4 py-2 bg-danger text-white rounded font-medium transition-colors hover:bg-danger/80 text-sm"
            @click="createLeak"
          >
            Create 10,000 Detached Nodes
          </button>
          <div
            v-pre
            class="bg-background p-3 rounded font-mono text-xs border border-border-subtle mt-2"
          >
            const detachedNodes = [];<br /><br />
            function leak() {<br />
            &nbsp;&nbsp;const div = document.createElement('div');<br />
            &nbsp;&nbsp;detachedNodes.push(div); // Retained!<br />
            }
          </div>
        </div>

        <div
          class="bg-background-surface border border-border-subtle p-4 rounded-lg flex flex-col gap-3"
        >
          <h5 class="font-bold text-sm text-foreground-primary">Fix Mechanism</h5>
          <button
            class="px-4 py-2 bg-success text-white rounded font-medium transition-colors hover:bg-success/80 text-sm"
            @click="fixLeak"
          >
            Clear References (Fix Leak)
          </button>
          <div
            v-pre
            class="bg-background p-3 rounded font-mono text-xs border border-border-subtle mt-2"
          >
            detachedNodes.length = 0; // Cleared!<br />
            // GC can now sweep them away.
          </div>
        </div>
      </div>

      <!-- Live Heap Graph Simulation -->
      <div
        class="bg-background-surface border border-border-subtle p-4 rounded-lg flex flex-col h-[350px]"
      >
        <div class="flex justify-between items-center mb-4">
          <h5 class="font-bold text-sm text-foreground-primary">Simulated Heap Growth</h5>
          <div
            class="text-xs font-mono font-bold"
            :class="nodeCount > 50000 ? 'text-danger' : 'text-foreground-muted'"
          >
            Nodes: {{ nodeCount.toLocaleString() }}
          </div>
        </div>

        <div
          class="flex-1 bg-background border border-border-subtle rounded relative flex items-end p-2 gap-1 overflow-hidden"
        >
          <div
            v-for="(point, i) in history"
            :key="i"
            class="w-4 bg-primary transition-all duration-300 rounded-t"
            :class="point > 50000 ? 'bg-danger' : point > 20000 ? 'bg-warning' : 'bg-success'"
            :style="{ height: `${Math.min((point / 100000) * 100, 100)}%` }"
          />
          <div
            v-if="history.length === 0"
            class="absolute inset-0 flex items-center justify-center text-foreground-muted text-xs italic"
          >
            Waiting for allocations...
          </div>
        </div>

        <div class="mt-4 text-[10px] text-foreground-muted text-center">
          In a real application, you can view this exact graph in Chrome DevTools -> Memory ->
          Allocation timeline.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// We will ACTUALLY leak them in memory for authenticity, but clear them on unmount!
const leakedNodes = ref<HTMLElement[]>([])
const nodeCount = ref(0)
const history = ref<number[]>([])

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    // Record history every second
    history.value.push(nodeCount.value)
    if (history.value.length > 20) {
      history.value.shift() // keep last 20 ticks
    }
  }, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
  leakedNodes.value = [] // Prevent actual memory leak in our SPA
})

const createLeak = () => {
  // Create 10,000 actual DOM nodes, but NEVER append them to the document.
  // Because `leakedNodes` array holds a reference, they cannot be garbage collected.
  for (let i = 0; i < 10000; i++) {
    const el = document.createElement('div')
    el.className = 'leaked-node-demo'
    leakedNodes.value.push(el)
  }
  nodeCount.value = leakedNodes.value.length
}

const fixLeak = () => {
  // Clearing the array removes the Javascript reference to the DOM nodes.
  // The next time the Garbage Collector runs, it will reclaim this memory.
  leakedNodes.value = []
  nodeCount.value = 0
}
</script>
