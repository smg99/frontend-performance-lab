<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-4"
  >
    <div
      class="flex items-center gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-foreground-primary mb-1">Performance Timeline</h4>
        <p class="text-xs text-foreground-muted">
          A visual breakdown of how the browser schedules the rendering pipeline during a typical
          interaction.
        </p>
      </div>
      <button
        :disabled="isRunning"
        class="px-4 py-2 bg-primary text-primary-foreground rounded font-medium transition-colors hover:bg-primary/80 disabled:opacity-50 text-sm"
        @click="runSimulation"
      >
        {{ isRunning ? 'Simulating...' : 'Simulate Frame' }}
      </button>
    </div>

    <div
      class="bg-background-surface border border-border-subtle rounded-lg p-4 overflow-hidden relative min-h-[200px]"
    >
      <!-- Axis/Grid -->
      <div class="absolute top-0 bottom-0 left-0 right-0 flex pointer-events-none opacity-20">
        <div v-for="i in 10" :key="i" class="flex-1 border-l border-border-subtle h-full" />
      </div>

      <div class="relative z-10 space-y-3 mt-2">
        <!-- Main Thread Row -->
        <div class="flex items-center gap-4">
          <div class="w-24 text-xs font-bold text-foreground-muted text-right">Main Thread</div>
          <div
            class="flex-1 h-8 bg-background border border-border-subtle rounded relative overflow-hidden"
          >
            <transition name="bar-slide">
              <div
                v-if="phase >= 1"
                class="absolute top-1 bottom-1 left-2 w-16 bg-warning/80 border border-warning rounded flex items-center justify-center text-[10px] font-bold text-warning-foreground shadow"
              >
                Event
              </div>
            </transition>
            <transition name="bar-slide">
              <div
                v-if="phase >= 2"
                class="absolute top-1 bottom-1 left-20 w-32 bg-primary/80 border border-primary rounded flex items-center justify-center text-[10px] font-bold text-white shadow"
              >
                JavaScript
              </div>
            </transition>
            <transition name="bar-slide">
              <div
                v-if="phase >= 3"
                class="absolute top-1 bottom-1 left-[216px] w-12 bg-purple-500/80 border border-purple-500 rounded flex items-center justify-center text-[10px] font-bold text-white shadow"
              >
                Style
              </div>
            </transition>
            <transition name="bar-slide">
              <div
                v-if="phase >= 4"
                class="absolute top-1 bottom-1 left-[270px] w-16 bg-purple-500/80 border border-purple-500 rounded flex items-center justify-center text-[10px] font-bold text-white shadow"
              >
                Layout
              </div>
            </transition>
            <transition name="bar-slide">
              <div
                v-if="phase >= 5"
                class="absolute top-1 bottom-1 left-[340px] w-12 bg-success/80 border border-success rounded flex items-center justify-center text-[10px] font-bold text-white shadow"
              >
                Paint
              </div>
            </transition>
          </div>
        </div>

        <!-- Compositor Thread Row -->
        <div class="flex items-center gap-4">
          <div class="w-24 text-xs font-bold text-foreground-muted text-right leading-tight">
            Compositor Thread
          </div>
          <div
            class="flex-1 h-8 bg-background border border-border-subtle rounded relative overflow-hidden"
          >
            <transition name="bar-slide">
              <div
                v-if="phase >= 6"
                class="absolute top-1 bottom-1 left-[400px] w-24 bg-info/80 border border-info rounded flex items-center justify-center text-[10px] font-bold text-white shadow"
              >
                Composite Layers
              </div>
            </transition>
          </div>
        </div>

        <!-- Worker Thread Row -->
        <div class="flex items-center gap-4">
          <div class="w-24 text-xs font-bold text-foreground-muted text-right leading-tight">
            Worker Thread
          </div>
          <div
            class="flex-1 h-8 bg-background border border-border-subtle rounded relative overflow-hidden"
          >
            <transition name="bar-slide">
              <div
                v-if="phase >= 2"
                class="absolute top-1 bottom-1 left-20 w-[450px] bg-danger/80 border border-danger rounded flex items-center justify-center text-[10px] font-bold text-white shadow opacity-50"
              >
                Background Task (Parallel)
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isRunning = ref(false)
const phase = ref(0)

const runSimulation = async () => {
  if (isRunning.value) return
  isRunning.value = true
  phase.value = 0

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

  await sleep(100)
  phase.value = 1 // Event
  await sleep(400)
  phase.value = 2 // JS
  await sleep(800)
  phase.value = 3 // Style
  await sleep(300)
  phase.value = 4 // Layout
  await sleep(400)
  phase.value = 5 // Paint
  await sleep(300)
  phase.value = 6 // Composite

  await sleep(1000)
  isRunning.value = false
}
</script>

<style scoped>
.bar-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.bar-slide-enter-from {
  opacity: 0;
  transform: scaleX(0);
  transform-origin: left;
}
</style>
