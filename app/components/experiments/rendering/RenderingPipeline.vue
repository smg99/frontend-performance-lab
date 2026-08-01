<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-6">
    <div class="flex items-center gap-4 bg-surface p-4 rounded-lg border border-border">
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-text-primary mb-1">Rendering Pipeline</h4>
        <p class="text-xs text-text-secondary">HTML → DOM → CSSOM → Render Tree → Layout → Paint → Composite</p>
      </div>
      <div class="flex gap-2">
        <button 
          :disabled="isPlaying"
          class="px-4 py-2 bg-primary text-white rounded font-medium transition-colors hover:bg-primary/80 disabled:opacity-50 text-sm"
          @click="startAnimation"
        >
          {{ isPlaying ? 'Simulating...' : 'Run Pipeline' }}
        </button>
      </div>
    </div>

    <!-- The Pipeline visualization -->
    <div class="flex flex-col md:flex-row gap-2 relative overflow-hidden p-2 min-h-[350px]">
      
      <!-- Arrow container connecting them all -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div class="w-full h-1 bg-text-secondary mx-12"/>
      </div>

      <!-- Nodes -->
      <div
v-for="(node, index) in nodes" :key="node.id" 
           class="flex-1 flex flex-col items-center justify-center relative z-10 transition-all duration-500"
           :class="[
             activeNode >= index ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4',
             activeNode === index ? 'scale-110' : 'scale-100'
           ]"
      >
        <div 
          class="w-full max-w-[120px] aspect-square rounded-full border-4 flex flex-col items-center justify-center text-center shadow-lg transition-all duration-300 bg-surface"
          :class="[
            activeNode === index ? `border-${node.color} shadow-[0_0_20px_${node.glow}] text-${node.color}` : 'border-border text-text-secondary'
          ]"
        >
          <span class="text-2xl mb-1">{{ node.icon }}</span>
          <span class="text-xs font-bold leading-tight">{{ node.label }}</span>
        </div>
        
        <!-- Explanation popover -->
        <transition name="fade-slide">
          <div
v-if="activeNode === index" 
               class="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 bg-card border border-border p-3 rounded-lg shadow-xl z-20 text-[10px] text-text-secondary text-center">
            {{ node.desc }}
          </div>
        </transition>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isPlaying = ref(false)
const activeNode = ref(-1)

const nodes = [
  { id: 'html', label: 'Parse HTML', icon: '📄', color: 'info', glow: 'rgba(59,130,246,0.5)', desc: 'Browser reads raw bytes, converts to characters, tokens, and creates DOM nodes.' },
  { id: 'css', label: 'Parse CSS', icon: '🎨', color: 'info', glow: 'rgba(59,130,246,0.5)', desc: 'Browser builds the CSSOM (CSS Object Model) determining styles for every element.' },
  { id: 'render', label: 'Render Tree', icon: '🌳', color: 'success', glow: 'rgba(34,197,94,0.5)', desc: 'DOM + CSSOM are combined. Hidden elements (display:none) are dropped.' },
  { id: 'layout', label: 'Layout', icon: '📐', color: 'warning', glow: 'rgba(245,158,11,0.5)', desc: 'Calculates the exact x, y coordinates and width/height for every element.' },
  { id: 'paint', label: 'Paint', icon: '🖌️', color: 'purple-500', glow: 'rgba(168,85,247,0.5)', desc: 'Fills in the pixels. Draws text, colors, images, borders, and shadows.' },
  { id: 'composite', label: 'Composite', icon: '🎭', color: 'danger', glow: 'rgba(239,68,68,0.5)', desc: 'Sends independent layers to the GPU to be drawn together onto the screen.' }
]

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const startAnimation = async () => {
  if (isPlaying.value) return
  isPlaying.value = true
  activeNode.value = -1
  
  await sleep(300)
  
  for (let i = 0; i < nodes.length; i++) {
    activeNode.value = i
    await sleep(1500)
  }
  
  await sleep(1000)
  activeNode.value = -1
  isPlaying.value = false
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
