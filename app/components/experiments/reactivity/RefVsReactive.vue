<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Ref Example -->
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-border pb-2">
          <h4 class="text-lg font-bold text-text-primary text-primary">ref()</h4>
          <span ref="renderCountNode" class="text-xs bg-surface border border-border px-2 py-1 rounded font-mono text-text-secondary">Render Count: 0</span>
        </div>
        
        <div class="bg-surface p-4 rounded-lg border border-border font-mono text-sm overflow-x-auto">
          <div class="flex justify-between items-center mb-2">
            <span class="text-text-secondary">Primitive Value:</span>
            <span class="font-bold text-text-primary">{{ primitiveRef }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-text-secondary">Object Value:</span>
            <span class="font-bold text-text-primary">{{ JSON.stringify(objectRef) }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="px-3 py-2 bg-surface hover:bg-border/50 border border-border rounded text-sm transition-colors text-text-primary" @click="primitiveRef++">
            Increment Primitive
          </button>
          <button class="px-3 py-2 bg-surface hover:bg-border/50 border border-border rounded text-sm transition-colors text-text-primary" @click="objectRef.count++">
            Mutate Object
          </button>
          <button class="px-3 py-2 bg-surface hover:bg-border/50 border border-border rounded text-sm transition-colors text-text-primary" @click="objectRef = { count: 100 }">
            Reassign Object
          </button>
        </div>

        <div v-if="advanced" class="bg-surface/50 p-3 rounded text-xs font-mono text-text-secondary border border-border">
          <p>isRef(primitiveRef): <span class="text-success">{{ isRef(primitiveRef) }}</span></p>
          <p>isProxy(objectRef.value): <span class="text-success">{{ isProxy(objectRef) }}</span></p>
        </div>
      </div>

      <!-- Reactive Example -->
      <div class="space-y-4">
        <div class="flex items-center justify-between border-b border-border pb-2">
          <h4 class="text-lg font-bold text-text-primary text-success">reactive()</h4>
        </div>
        
        <div class="bg-surface p-4 rounded-lg border border-border font-mono text-sm overflow-x-auto">
          <div class="flex justify-between items-center mb-2">
            <span class="text-text-secondary">Object Value:</span>
            <span class="font-bold text-text-primary">{{ JSON.stringify(state) }}</span>
          </div>
          <div class="flex justify-between items-center text-danger">
            <span class="text-text-secondary">Reassigned (Lost Reactivity):</span>
            <span class="font-bold">{{ JSON.stringify(lostState) }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="px-3 py-2 bg-surface hover:bg-border/50 border border-border rounded text-sm transition-colors text-text-primary" @click="state.count++">
            Mutate Object
          </button>
          <button class="px-3 py-2 bg-surface hover:bg-border/50 border border-border rounded text-sm transition-colors text-danger" @click="reassignReactive">
            Reassign (Breaks)
          </button>
        </div>

        <div v-if="advanced" class="bg-surface/50 p-3 rounded text-xs font-mono text-text-secondary border border-border">
          <p>isReactive(state): <span class="text-success">{{ isReactive(state) }}</span></p>
          <p>isProxy(state): <span class="text-success">{{ isProxy(state) }}</span></p>
          <p>isReactive(lostState): <span class="text-danger">{{ isReactive(lostState) }}</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, isRef, isReactive, isProxy, onUpdated } from 'vue'

defineProps<{ advanced?: boolean }>()

// Ref examples
const primitiveRef = ref(0)
const objectRef = ref({ count: 0 })

// Reactive examples
const state = reactive({ count: 0 })
let lostState = reactive({ count: 0 })

const reassignReactive = () => {
  // This breaks reactivity intentionally to demonstrate the flaw of reactive() reassignment
  lostState = { count: 100 } as unknown as typeof lostState 
}

const renderCountNode = ref<HTMLElement | null>(null)
let renderCount = 0

onUpdated(() => {
  renderCount++
  if (renderCountNode.value) {
    renderCountNode.value.textContent = `Render Count: ${renderCount}`
  }
})
</script>
