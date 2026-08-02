<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-6"
  >
    <div
      class="flex items-center gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-foreground-primary mb-1">Vue 3 Proxy Internals</h4>
        <p class="text-xs text-foreground-muted">
          Simulates how Vue wraps objects in a Proxy to intercept gets/sets for tracking.
        </p>
      </div>
      <button
        class="px-3 py-1.5 bg-info/10 text-info border border-info/30 rounded text-sm hover:bg-info/20 transition-colors"
        @click="simulateRead"
      >
        Simulate Read (get)
      </button>
      <button
        class="px-3 py-1.5 bg-danger/10 text-danger border border-danger/30 rounded text-sm hover:bg-danger/20 transition-colors"
        @click="simulateWrite"
      >
        Simulate Write (set)
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Target Object -->
      <div
        class="bg-background-surface border border-border-subtle rounded-lg p-4 flex flex-col items-center"
      >
        <h5 class="text-sm font-bold text-foreground-muted mb-3">Target Object</h5>
        <div
          class="bg-background border border-border-subtle rounded p-3 w-full font-mono text-xs text-center shadow-inner"
        >
          { count: {{ targetObject.count }} }
        </div>
      </div>

      <!-- Proxy Interceptor -->
      <div
        class="bg-background-surface border border-border-subtle rounded-lg p-4 flex flex-col items-center relative"
      >
        <h5 class="text-sm font-bold text-primary mb-3">Proxy Handler</h5>
        <div
          class="w-full text-center p-3 rounded font-mono text-xs border transition-all duration-300"
          :class="[
            currentAction === 'get'
              ? 'bg-info/20 border-info text-info shadow-[0_0_15px_rgba(59,130,246,0.3)]'
              : currentAction === 'set'
                ? 'bg-danger/20 border-danger text-danger shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                : 'bg-background border-border-subtle text-foreground-muted'
          ]"
        >
          {{
            currentAction === 'get'
              ? 'get() -> track()'
              : currentAction === 'set'
                ? 'set() -> trigger()'
                : 'Idle'
          }}
        </div>
      </div>

      <!-- Dependency Map -->
      <div
        class="bg-background-surface border border-border-subtle rounded-lg p-4 flex flex-col items-center"
      >
        <h5 class="text-sm font-bold text-foreground-muted mb-3">TargetMap (WeakMap)</h5>
        <div class="bg-background border border-border-subtle rounded p-3 w-full text-xs space-y-2">
          <div class="flex justify-between border-b border-border-subtle pb-1">
            <span class="text-foreground-muted">Key (Object)</span>
            <span class="text-info font-mono">Map(deps)</span>
          </div>
          <div class="flex justify-between">
            <span class="text-foreground-primary font-mono">{ count }</span>
            <span class="text-success font-mono">Set({{ depsCount }} effects)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const targetObject = ref({ count: 0 })
const currentAction = ref<'get' | 'set' | null>(null)
const depsCount = ref(0)
let timeout: ReturnType<typeof setTimeout> | null = null

const simulateRead = () => {
  if (timeout) clearTimeout(timeout)
  currentAction.value = 'get'
  if (depsCount.value < 5) depsCount.value++

  timeout = setTimeout(() => {
    currentAction.value = null
  }, 1000)
}

const simulateWrite = () => {
  if (timeout) clearTimeout(timeout)
  currentAction.value = 'set'
  targetObject.value.count++

  timeout = setTimeout(() => {
    currentAction.value = null
  }, 1000)
}
</script>
