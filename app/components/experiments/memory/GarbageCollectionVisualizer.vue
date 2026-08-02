<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-6"
  >
    <div
      class="flex items-center gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-foreground-primary mb-1">Heap & Mark-and-Sweep</h4>
        <p class="text-xs text-foreground-muted">
          Watch the Garbage Collector traverse from the Window (root), mark reachable objects, and
          sweep detached ones.
        </p>
      </div>
      <div class="flex gap-2">
        <button
          :disabled="isGCActive"
          class="px-3 py-1.5 bg-background text-foreground-primary border border-border-subtle rounded text-sm hover:bg-background-surface transition-colors disabled:opacity-50"
          @click="allocateObject"
        >
          Allocate Object
        </button>
        <button
          :disabled="isGCActive || objects.length <= 1"
          class="px-3 py-1.5 bg-warning/20 text-warning border border-warning/50 rounded text-sm hover:bg-warning/30 transition-colors disabled:opacity-50"
          @click="detachRandom"
        >
          Detach Random
        </button>
        <button
          :disabled="isGCActive"
          class="px-4 py-1.5 bg-danger text-white rounded font-medium transition-colors hover:bg-danger/80 disabled:opacity-50 text-sm shadow-subtle"
          @click="runGC"
        >
          {{ isGCActive ? 'Running GC...' : 'Force Garbage Collection' }}
        </button>
      </div>
    </div>

    <!-- Heap Area -->
    <div
      class="bg-background border border-border-subtle rounded-lg h-[300px] relative overflow-hidden p-6 flex items-center justify-center"
    >
      <!-- Window Root -->
      <div class="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center z-20">
        <div
          class="w-16 h-16 bg-primary rounded-full shadow-lg flex items-center justify-center text-white font-bold border-4 border-primary-foreground/30 relative"
          :class="{ 'ring-4 ring-success animate-pulse': isMarking }"
        >
          Window
        </div>
        <div class="text-[10px] text-foreground-muted mt-2 font-mono">GC Root</div>
      </div>

      <!-- Objects Grid -->
      <div class="ml-24 w-full h-full relative">
        <transition-group name="obj-pop">
          <div
            v-for="obj in objects"
            :key="obj.id"
            class="absolute w-12 h-12 rounded-lg shadow-md flex items-center justify-center font-bold text-xs transition-all duration-500 border-2"
            :class="[
              obj.isMarked
                ? 'bg-success/20 text-success border-success'
                : obj.isSwept
                  ? 'bg-danger/20 text-danger border-danger scale-90 opacity-0'
                  : 'bg-background-surface text-foreground-primary border-border-subtle'
            ]"
            :style="{ left: `${obj.x}%`, top: `${obj.y}%` }"
          >
            Obj_{{ obj.id }}
          </div>
        </transition-group>

        <!-- SVG Edges representing references -->
        <svg
          class="absolute inset-0 w-full h-full pointer-events-none z-10"
          style="overflow: visible"
        >
          <!-- Line from Root to connected objects -->
          <line
            v-for="obj in objects.filter(o => o.isConnected)"
            :key="`line-root-${obj.id}`"
            x1="-20"
            y1="50%"
            :x2="`${obj.x}%`"
            :y2="`${obj.y + (obj.isMarked ? 1 : 0)}%`"
            class="transition-all duration-500 stroke-2"
            :class="
              obj.isMarked ? 'stroke-success' : obj.isSwept ? 'stroke-transparent' : 'stroke-border'
            "
          />
        </svg>
      </div>

      <!-- GC Overlay Text -->
      <div
        v-if="gcPhase"
        class="absolute inset-0 flex items-center justify-center pointer-events-none z-30 bg-background/50 backdrop-blur-sm"
      >
        <h2
          class="text-4xl font-bold font-mono tracking-widest uppercase"
          :class="gcPhase === 'MARKING' ? 'text-success' : 'text-danger'"
        >
          {{ gcPhase }}
        </h2>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface MemoryObject {
  id: number
  x: number
  y: number
  isConnected: boolean
  isMarked: boolean
  isSwept: boolean
}

const objects = ref<MemoryObject[]>([])
let idCounter = 1

const isGCActive = ref(false)
const isMarking = ref(false)
const gcPhase = ref<'MARKING' | 'SWEEPING' | ''>('')

// Initialize with a few objects
const init = () => {
  for (let i = 0; i < 6; i++) {
    allocateObject()
  }
}

const allocateObject = () => {
  objects.value.push({
    id: idCounter++,
    x: 10 + Math.random() * 80, // spread horizontally
    y: 10 + Math.random() * 80, // spread vertically
    isConnected: true, // Initially attached to root
    isMarked: false,
    isSwept: false
  })
}

const detachRandom = () => {
  const connected = objects.value.filter(o => o.isConnected)
  if (connected.length > 0) {
    const target = connected[Math.floor(Math.random() * connected.length)]
    target.isConnected = false
  }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

const runGC = async () => {
  if (isGCActive.value) return
  isGCActive.value = true

  // Phase 1: MARK
  gcPhase.value = 'MARKING'
  isMarking.value = true
  await sleep(800)

  // Mark all connected objects
  for (const obj of objects.value) {
    if (obj.isConnected) {
      obj.isMarked = true
    }
  }

  await sleep(1500)

  // Phase 2: SWEEP
  gcPhase.value = 'SWEEPING'
  isMarking.value = false

  for (const obj of objects.value) {
    if (!obj.isMarked) {
      obj.isSwept = true // triggers CSS vanish animation
    }
  }

  await sleep(1000)

  // Cleanup arrays
  objects.value = objects.value.filter(o => !o.isSwept)

  // Reset marks
  objects.value.forEach(o => (o.isMarked = false))

  gcPhase.value = ''
  isGCActive.value = false
}

// Initial seed
init()
</script>

<style scoped>
.obj-pop-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.obj-pop-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
.obj-pop-leave-active {
  transition: all 0.5s ease-in;
}
.obj-pop-leave-to {
  opacity: 0;
  transform: scale(0.1);
}
</style>
