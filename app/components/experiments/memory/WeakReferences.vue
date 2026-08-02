<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-6"
  >
    <div
      class="flex items-center gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-foreground-primary mb-1">WeakMap & WeakRef</h4>
        <p class="text-xs text-foreground-muted">
          A WeakMap holds "weak" references to its keys. If there are no other references to the key
          object, it will be garbage collected, and the entry will automatically disappear from the
          WeakMap.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Normal Map -->
      <div class="bg-background-surface border border-border-subtle rounded-lg p-6 flex flex-col">
        <h5 class="text-sm font-bold text-danger mb-4">Normal Map (Strong Reference)</h5>

        <div class="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
          <!-- The Root -->
          <div
            class="w-24 bg-background border border-border-subtle p-2 text-center text-xs font-mono rounded shadow z-10 mb-8"
          >
            const map = new Map()
          </div>

          <!-- The Link -->
          <div
            class="w-1 h-12 bg-danger transition-colors duration-300 z-0 absolute top-[40px]"
            :class="{ 'bg-border': isMapCleared }"
          />
          <div
            class="absolute top-[65px] left-1/2 ml-2 text-[10px] text-danger font-bold"
            :class="{ 'text-foreground-muted line-through': isMapCleared }"
          >
            Strong Ref
          </div>

          <!-- The Object -->
          <div
            class="w-24 h-24 rounded-full border-4 flex items-center justify-center font-bold transition-all duration-500 z-10 bg-background-surface shadow-lg"
            :class="
              isMapCleared
                ? 'border-border-subtle text-foreground-muted opacity-50'
                : 'border-danger text-danger'
            "
          >
            { data }
          </div>
        </div>

        <div class="mt-4 flex flex-col gap-2">
          <p class="text-xs text-foreground-muted text-center">
            Even if you delete all other variables pointing to `{ data }`, the Map keeps it alive
            forever.
          </p>
          <button
            class="px-4 py-2 bg-background border border-border-subtle rounded text-sm hover:bg-border transition-colors"
            @click="isMapCleared = !isMapCleared"
          >
            {{ isMapCleared ? 'Restore Map Ref' : 'map.delete(key)' }}
          </button>
        </div>
      </div>

      <!-- Weak Map -->
      <div class="bg-background-surface border border-border-subtle rounded-lg p-6 flex flex-col">
        <h5 class="text-sm font-bold text-success mb-4">WeakMap (Weak Reference)</h5>

        <div class="flex-1 flex flex-col items-center justify-center relative min-h-[200px]">
          <!-- The Root -->
          <div
            class="w-24 bg-background border border-border-subtle p-2 text-center text-xs font-mono rounded shadow z-10 mb-8"
          >
            const wm = new WeakMap()
          </div>

          <!-- The Link -->
          <div
            class="w-1 h-12 border-l-2 border-dashed border-success transition-all duration-300 z-0 absolute top-[40px]"
            :class="{ 'opacity-0': isVarCleared }"
          />
          <div
            class="absolute top-[65px] left-1/2 ml-2 text-[10px] text-success font-bold"
            :class="{ 'opacity-0': isVarCleared }"
          >
            Weak Ref
          </div>

          <!-- The Object -->
          <div
            class="w-24 h-24 rounded-full border-4 flex items-center justify-center font-bold transition-all duration-1000 z-10 bg-background-surface shadow-lg"
            :class="
              isVarCleared
                ? 'border-danger text-danger scale-50 opacity-0'
                : 'border-success text-success scale-100 opacity-100'
            "
          >
            { data }
          </div>
        </div>

        <div class="mt-4 flex flex-col gap-2">
          <p class="text-xs text-foreground-muted text-center">
            If you clear the external variable pointing to `{ data }`, the WeakMap lets it be
            Garbage Collected.
          </p>
          <button
            class="px-4 py-2 bg-background border border-border-subtle rounded text-sm hover:bg-border transition-colors"
            @click="toggleWeak"
          >
            {{ isVarCleared ? 'let obj = { data }' : 'obj = null' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isMapCleared = ref(false)
const isVarCleared = ref(false)

const toggleWeak = () => {
  isVarCleared.value = !isVarCleared.value
  // The object vanishing simulates the Garbage Collector kicking in and realizing
  // there are no STRONG references left, so it sweeps the object, which in turn
  // silently removes it from the WeakMap.
}
</script>
