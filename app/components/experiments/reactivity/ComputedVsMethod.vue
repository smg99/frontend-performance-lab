<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-6"
  >
    <!-- Controls -->
    <div
      class="flex items-center gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex flex-col">
        <label class="text-xs text-foreground-muted font-semibold uppercase mb-1"
          >Dataset Size</label
        >
        <select
          v-model="datasetSize"
          class="bg-background border border-border-subtle text-sm rounded px-3 py-1.5 outline-none focus:border-primary text-foreground-primary"
        >
          <option :value="10">10 items</option>
          <option :value="100">100 items</option>
          <option :value="1000">1,000 items</option>
          <option :value="10000">10,000 items</option>
          <option :value="100000">100,000 items</option>
        </select>
      </div>
      <div class="flex-1" />
      <button
        class="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-subtle flex items-center gap-2"
        @click="unrelatedState++"
      >
        <span>Trigger Unrelated Re-render</span>
        <span class="bg-white/20 px-2 py-0.5 rounded text-xs">{{ unrelatedState }}</span>
      </button>
    </div>

    <!-- Comparison -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Method -->
      <div class="space-y-4">
        <h4 class="text-lg font-bold text-danger flex items-center gap-2">
          Method <span>()</span>
        </h4>
        <div class="bg-background-surface p-4 rounded-lg border border-border-subtle space-y-3">
          <div class="flex justify-between items-center text-sm">
            <span class="text-foreground-muted">Execution Count:</span>
            <span ref="methodExecCountNode" class="font-mono font-bold">0</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-foreground-muted">Last Execution Time:</span>
            <span ref="methodLastTimeNode" class="font-mono">0.00 ms</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-foreground-muted">Total Time Wasted:</span>
            <span ref="methodTotalTimeNode" class="font-mono text-danger">0.00 ms</span>
          </div>
        </div>
        <div
          class="text-xs text-foreground-muted font-mono p-3 bg-background-surface/50 rounded border border-border-subtle"
        >
          Result (sum): {{ calculateSumMethod() }}
        </div>
      </div>

      <!-- Computed -->
      <div class="space-y-4">
        <h4 class="text-lg font-bold text-success flex items-center gap-2">
          Computed <span>()</span>
        </h4>
        <div class="bg-background-surface p-4 rounded-lg border border-border-subtle space-y-3">
          <div class="flex justify-between items-center text-sm">
            <span class="text-foreground-muted">Execution Count:</span>
            <span ref="computedExecCountNode" class="font-mono font-bold text-success">0</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-foreground-muted">Last Execution Time:</span>
            <span ref="computedLastTimeNode" class="font-mono">0.00 ms</span>
          </div>
          <div class="flex justify-between items-center text-sm">
            <span class="text-foreground-muted">Total Time:</span>
            <span ref="computedTotalTimeNode" class="font-mono text-success">0.00 ms</span>
          </div>
        </div>
        <div
          class="text-xs text-foreground-muted font-mono p-3 bg-background-surface/50 rounded border border-border-subtle"
        >
          Result (sum): {{ calculateSumComputed }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

defineProps<{ advanced?: boolean }>()

const datasetSize = ref(1000)
const dataset = ref<number[]>([])
const unrelatedState = ref(0)

const generateDataset = () => {
  dataset.value = Array.from({ length: datasetSize.value }, () => Math.random() * 100)
}
watch(datasetSize, generateDataset)

onMounted(() => {
  generateDataset()
})

// Metrics nodes
const methodExecCountNode = ref<HTMLElement | null>(null)
const methodLastTimeNode = ref<HTMLElement | null>(null)
const methodTotalTimeNode = ref<HTMLElement | null>(null)

const computedExecCountNode = ref<HTMLElement | null>(null)
const computedLastTimeNode = ref<HTMLElement | null>(null)
const computedTotalTimeNode = ref<HTMLElement | null>(null)

// Metrics values
let methodExecCount = 0
let methodLastTime = 0
let methodTotalTime = 0

let computedExecCount = 0
let computedLastTime = 0
let computedTotalTime = 0

// Reset metrics on dataset change
watch(datasetSize, () => {
  methodExecCount = 0
  methodTotalTime = 0
  computedExecCount = 0
  computedTotalTime = 0
  updateNodes()
})

const updateNodes = () => {
  if (import.meta.client) {
    if (methodExecCountNode.value)
      methodExecCountNode.value.textContent = methodExecCount.toString()
    if (methodLastTimeNode.value)
      methodLastTimeNode.value.textContent = methodLastTime.toFixed(2) + ' ms'
    if (methodTotalTimeNode.value)
      methodTotalTimeNode.value.textContent = methodTotalTime.toFixed(2) + ' ms'

    if (computedExecCountNode.value)
      computedExecCountNode.value.textContent = computedExecCount.toString()
    if (computedLastTimeNode.value)
      computedLastTimeNode.value.textContent = computedLastTime.toFixed(2) + ' ms'
    if (computedTotalTimeNode.value)
      computedTotalTimeNode.value.textContent = computedTotalTime.toFixed(2) + ' ms'
  }
}

const calculateSumMethod = () => {
  if (!import.meta.client) return '0.00'

  const start = performance.now()
  methodExecCount++

  // Heavy computation simulation
  let sum = 0
  for (let i = 0; i < dataset.value.length; i++) {
    sum += dataset.value[i]
    // Artificial slowdown for small datasets to make it measurable
    if (datasetSize.value <= 1000) {
      for (let j = 0; j < 1000; j++) {
        /* busy wait */
      }
    }
  }

  const end = performance.now()
  const time = end - start
  methodLastTime = time
  methodTotalTime += time

  // Schedule DOM update for next tick to avoid infinite render loops
  Promise.resolve().then(updateNodes)

  return sum.toFixed(2)
}

const calculateSumComputed = computed(() => {
  if (!import.meta.client) return '0.00'

  const start = performance.now()
  computedExecCount++

  let sum = 0
  for (let i = 0; i < dataset.value.length; i++) {
    sum += dataset.value[i]
    if (datasetSize.value <= 1000) {
      for (let j = 0; j < 1000; j++) {
        /* busy wait */
      }
    }
  }

  const end = performance.now()
  const time = end - start
  computedLastTime = time
  computedTotalTime += time

  // eslint-disable-next-line vue/no-async-in-computed-properties
  Promise.resolve().then(updateNodes)

  return sum.toFixed(2)
})
</script>
