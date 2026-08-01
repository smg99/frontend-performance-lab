<template>
  <div class="relative group mt-2 mb-4 border border-border rounded-lg bg-surface overflow-hidden">
    
    <!-- Collapsible Header -->
    <button 
      @click="isExpanded = !isExpanded" 
      class="w-full flex items-center justify-between px-4 py-2 bg-background hover:bg-background/80 transition-colors text-xs font-mono text-text-secondary border-b border-border"
      :class="{ 'border-b-0': !isExpanded }"
    >
      <span class="flex items-center gap-2">
        <span class="text-[10px] transition-transform" :class="{ 'rotate-90': isExpanded }">▶</span>
        {{ title || 'Code Sample' }}
      </span>
      <span class="text-[10px] uppercase tracking-widest text-text-secondary/50">{{ isExpanded ? 'Hide' : 'Show' }}</span>
    </button>
    
    <!-- Code Content -->
    <div v-show="isExpanded" class="relative">
      <div class="absolute top-0 right-0 p-2 z-10">
        <button 
          @click="copyCode" 
          class="p-1.5 rounded-md bg-surface/80 border border-border text-text-secondary hover:text-text-primary hover:bg-surface transition-all shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
          :title="copied ? 'Copied!' : 'Copy to clipboard'"
        >
          <span v-if="copied" class="text-success text-xs font-bold px-1">✓ Copied</span>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
      
      <pre class="bg-[#0d1117] text-[#c9d1d9] p-4 overflow-x-auto text-sm font-mono border-t-0 shadow-inner rounded-b-lg m-0"><code>{{ code }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  code: string
  title?: string
  forceExpand?: boolean
}>()

const isExpanded = ref(props.forceExpand || false)

watch(() => props.forceExpand, (newVal) => {
  if (newVal !== undefined) {
    isExpanded.value = newVal
  }
})

const copied = ref(false)

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy code', err)
  }
}
</script>
