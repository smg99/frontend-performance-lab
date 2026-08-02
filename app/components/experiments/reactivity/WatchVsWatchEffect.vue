<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-6"
  >
    <div
      class="flex items-center gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex flex-col">
        <label class="text-xs text-foreground-muted font-semibold uppercase mb-1"
          >Search Query</label
        >
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Type to search..."
          class="bg-background border border-border-subtle text-sm rounded px-3 py-1.5 outline-none focus:border-primary text-foreground-primary w-64"
        />
      </div>
      <div class="flex flex-col">
        <label class="text-xs text-foreground-muted font-semibold uppercase mb-1"
          >Filter Type</label
        >
        <select
          v-model="filterType"
          class="bg-background border border-border-subtle text-sm rounded px-3 py-1.5 outline-none focus:border-primary text-foreground-primary"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div class="flex-1" />
      <button
        class="px-4 py-2 bg-background-surface hover:bg-border/50 border border-border-subtle text-foreground-primary rounded-lg font-medium transition-colors shadow-subtle text-sm flex items-center gap-2"
        @click="triggerUnrelated"
      >
        Trigger Unrelated State
        <span class="bg-primary/20 text-primary px-2 py-0.5 rounded text-xs font-bold">{{
          unrelatedState
        }}</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- watch() -->
      <div class="space-y-4">
        <div class="flex justify-between items-center border-b border-border-subtle pb-2">
          <h4 class="text-lg font-bold text-primary flex items-center gap-2">
            watch()
            <span
              class="text-xs bg-background-surface border border-border-subtle px-2 py-0.5 rounded font-mono font-normal text-foreground-muted"
              >Explicit dependencies</span
            >
          </h4>
        </div>

        <div
          class="bg-background-surface p-4 rounded-lg border border-border-subtle space-y-3 font-mono text-sm"
        >
          <div class="flex justify-between items-center">
            <span class="text-foreground-muted">Execution Count:</span>
            <span ref="watchExecCountNode" class="font-bold text-primary">0</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-foreground-muted">Cleanup Executions:</span>
            <span ref="watchCleanupCountNode" class="font-bold text-warning">0</span>
          </div>
          <div class="mt-4 pt-4 border-t border-border-subtle">
            <div class="text-foreground-muted mb-1">Latest Event:</div>
            <div ref="watchLogNode" class="text-xs text-foreground-primary break-all">
              Waiting...
            </div>
          </div>
        </div>
      </div>

      <!-- watchEffect() -->
      <div class="space-y-4">
        <div class="flex justify-between items-center border-b border-border-subtle pb-2">
          <h4 class="text-lg font-bold text-success flex items-center gap-2">
            watchEffect()
            <span
              class="text-xs bg-background-surface border border-border-subtle px-2 py-0.5 rounded font-mono font-normal text-foreground-muted"
              >Automatic tracking</span
            >
          </h4>
        </div>

        <div
          class="bg-background-surface p-4 rounded-lg border border-border-subtle space-y-3 font-mono text-sm"
        >
          <div class="flex justify-between items-center">
            <span class="text-foreground-muted">Execution Count:</span>
            <span ref="effectExecCountNode" class="font-bold text-success">0</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-foreground-muted">Cleanup Executions:</span>
            <span ref="effectCleanupCountNode" class="font-bold text-warning">0</span>
          </div>
          <div class="mt-4 pt-4 border-t border-border-subtle">
            <div class="text-foreground-muted mb-1">Latest Event:</div>
            <div ref="effectLogNode" class="text-xs text-foreground-primary break-all">
              Waiting...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue'

defineProps<{ advanced?: boolean }>()

const searchQuery = ref('')
const filterType = ref('all')
const unrelatedState = ref(0)

const triggerUnrelated = () => {
  unrelatedState.value++
}

// DOM Nodes for performance tracking (bypassing reactivity loops)
const watchExecCountNode = ref<HTMLElement | null>(null)
const watchCleanupCountNode = ref<HTMLElement | null>(null)
const watchLogNode = ref<HTMLElement | null>(null)

const effectExecCountNode = ref<HTMLElement | null>(null)
const effectCleanupCountNode = ref<HTMLElement | null>(null)
const effectLogNode = ref<HTMLElement | null>(null)

// Non-reactive metrics
let watchCount = 0
let watchCleanups = 0
let effectCount = 0
let effectCleanups = 0

const updateNodes = () => {
  if (import.meta.client) {
    if (watchExecCountNode.value) watchExecCountNode.value.textContent = watchCount.toString()
    if (watchCleanupCountNode.value)
      watchCleanupCountNode.value.textContent = watchCleanups.toString()
    if (effectExecCountNode.value) effectExecCountNode.value.textContent = effectCount.toString()
    if (effectCleanupCountNode.value)
      effectCleanupCountNode.value.textContent = effectCleanups.toString()
  }
}

const logWatch = (msg: string) => {
  if (import.meta.client && watchLogNode.value) watchLogNode.value.textContent = msg
}

const logEffect = (msg: string) => {
  if (import.meta.client && effectLogNode.value) effectLogNode.value.textContent = msg
}

// 1. watch() - Explicit dependency array
// Only tracks searchQuery and filterType, ignores unrelatedState
watch(
  [searchQuery, filterType],
  ([newQuery, newFilter], [_oldQuery, _oldFilter], onCleanup) => {
    watchCount++
    logWatch(`Triggered by explicitly watched deps. Query: "${newQuery}", Filter: "${newFilter}"`)

    // Simulate cleanup (like aborting a fetch request)
    onCleanup(() => {
      watchCleanups++
      logWatch('Cleanup triggered before next execution.')
    })

    Promise.resolve().then(updateNodes)
  },
  { immediate: true } // Manually opt-in to immediate execution
)

// 2. watchEffect() - Automatic dependency collection
// Automatically tracks whatever is read synchronously during execution
watchEffect(onCleanup => {
  effectCount++

  // By reading these values, they become dependencies automatically
  const query = searchQuery.value
  const filter = filterType.value

  // Demonstrating the danger/feature of watchEffect:
  // Because we read unrelatedState here, watchEffect will now re-run
  // every time the button is clicked, unlike watch()!
  const unrelated = unrelatedState.value

  logEffect(
    `Triggered by tracked deps. Query: "${query}", Filter: "${filter}", Unrelated: ${unrelated}`
  )

  onCleanup(() => {
    effectCleanups++
    logEffect('Cleanup triggered before next execution.')
  })

  Promise.resolve().then(updateNodes)
})
</script>
