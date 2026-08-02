<template>
  <Card
    class="relative w-full max-w-[500px] aspect-[4/3] bg-background-base overflow-hidden flex flex-col border border-border-subtle-strong rounded-xl shadow-2xl glass-panel group"
    aria-hidden="true"
  >
    <!-- Spotlight Hover Effect via CSS pseudo-element -->
    <div
      class="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 bg-[radial-gradient(circle_at_var(--mouse-x,_50%)_var(--mouse-y,_50%),_var(--color-primary-transparent,_rgba(138,43,226,0.1)),_transparent_80%)] z-0"
    ></div>

    <!-- Header: Mock IDE Window controls -->
    <div
      class="h-10 bg-background-surface border-b border-border-subtle-subtle flex items-center px-4 shrink-0 relative z-10"
    >
      <div class="flex gap-1.5">
        <div class="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/90 shadow-sm"></div>
        <div
          class="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500/90 shadow-sm"
        ></div>
        <div
          class="w-3 h-3 rounded-full bg-green-500/80 border border-green-500/90 shadow-sm"
        ></div>
      </div>
      <div
        class="ml-4 text-xs text-foreground-muted font-mono bg-background-base px-3 py-1 rounded-md border border-border-subtle-subtle flex-1 flex justify-center shadow-inner"
      >
        src/components/DataTable.vue
      </div>
    </div>

    <!-- Body -->
    <div
      class="flex-1 relative p-5 flex flex-col font-mono text-[13px] leading-relaxed overflow-hidden bg-[#0d0d0d] text-[#d4d4d4] z-10"
    >
      <!-- State 0/1: Code Editor (Monaco mock) -->
      <transition name="fade">
        <div v-if="currentState >= 0" class="absolute inset-5">
          <pre><code><span class="text-[#569cd6]">const</span> <span class="text-[#dcdcaa]">DataTable</span> = () <span class="text-[#569cd6]">=&gt;</span> {
  <span class="text-[#569cd6]">const</span> data = <span class="text-[#dcdcaa]">useData</span>()
  
  <span class="text-[#569cd6]">return</span> (
    <span class="text-[#808080]">&lt;div class="grid"&gt;</span>
      {data.<span class="text-[#dcdcaa]">map</span>(row <span class="text-[#569cd6]">=&gt;</span> (
        <span class="text-[#808080]">&lt;Row key={row.id}&gt;</span>
          <span class="text-[#808080]">&lt;Cell&gt;</span>{row.value}<span class="text-[#808080]">&lt;/Cell&gt;</span>
        <span class="text-[#808080]">&lt;/Row&gt;</span>
      ))}
    <span class="text-[#808080]">&lt;/div&gt;</span>
  )
}</code></pre>

          <div
            v-if="currentState === 1"
            class="absolute bottom-0 left-0 text-[#4ec9b0] font-bold flex items-center overflow-hidden whitespace-nowrap typing-animation"
          >
            &gt; npm run analyze
            <span class="w-2 h-4 bg-[#4ec9b0] ml-1 inline-block animate-blink"></span>
          </div>
        </div>
      </transition>

      <!-- Overlay blur when analyzing/results -->
      <transition name="fade">
        <div
          v-if="currentState >= 2"
          class="absolute inset-0 bg-background-base/95 backdrop-blur-md flex flex-col p-6 z-20 justify-center items-center"
        >
          <div class="w-full max-w-sm space-y-5 font-mono text-sm">
            <transition name="fade-slide-up">
              <div v-if="currentState >= 2" class="flex items-center gap-3 text-foreground-muted">
                <div
                  v-if="currentState === 2"
                  class="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"
                ></div>
                <CheckIcon v-else class="w-4 h-4 text-success" />
                <span>Parsing Component...</span>
              </div>
            </transition>

            <transition name="fade-slide-up">
              <div v-if="currentState >= 3" class="flex items-center gap-3 text-foreground-primary">
                <CheckIcon class="w-4 h-4 text-success" />
                <span>Layout Thrashing detected</span>
              </div>
            </transition>

            <transition name="fade-slide-up">
              <div v-if="currentState >= 4" class="flex items-center gap-3 text-foreground-primary">
                <CheckIcon class="w-4 h-4 text-success" />
                <span>Virtualization Recommended</span>
              </div>
            </transition>

            <transition name="fade-slide-up">
              <div
                v-if="currentState >= 5"
                class="mt-8 p-4 bg-success/5 border border-success/30 rounded-lg flex items-center justify-between text-success shadow-sm relative overflow-hidden"
              >
                <div
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-success/10 to-transparent shimmer-effect"
                ></div>
                <span class="font-bold uppercase tracking-wider text-xs relative z-10"
                  >Analysis Complete</span
                >
                <span class="font-bold text-lg relative z-10">Score: A</span>
              </div>
            </transition>
          </div>
        </div>
      </transition>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { CheckIcon } from 'lucide-vue-next'
import Card from '../ui/Card.vue'

const currentState = ref(0)
let timer: ReturnType<typeof setTimeout>

const advanceState = () => {
  currentState.value++

  if (currentState.value > 5) {
    // Hold the final state briefly, then restart
    timer = setTimeout(() => {
      currentState.value = 0
      timer = setTimeout(advanceState, 2000)
    }, 4000)
  } else {
    // Timing logic for each step
    const delays = [0, 1500, 1200, 800, 800, 800]
    timer = setTimeout(advanceState, delays[currentState.value])
  }
}

onMounted(() => {
  // Respect prefers-reduced-motion: if active, maybe just show final state or slow loop
  if (typeof window !== 'undefined') {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      currentState.value = 5 // Just show results statically
      return
    }
  }

  // Start the sequence
  timer = setTimeout(advanceState, 1500)
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<style scoped>
/* Glassmorphism panel base */
.glass-panel {
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-up-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-up-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

/* Micro-animations */
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
.animate-blink {
  animation: blink 1s step-end infinite;
}

@keyframes type {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}
.typing-animation {
  width: 0;
  animation: type 1s steps(20, end) forwards;
}

@keyframes progress {
  0% {
    transform: scaleX(0);
  }
  50% {
    transform: scaleX(0.7);
  }
  100% {
    transform: scaleX(1);
  }
}
.animate-progress {
  transform-origin: left;
  animation: progress 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
.shimmer-effect {
  animation: shimmer 3s infinite;
}

/* Reduced motion fallback */
@media (prefers-reduced-motion: reduce) {
  .animate-progress,
  .shimmer-effect,
  .typing-animation {
    animation: none !important;
    transform: none !important;
    width: 100% !important;
  }
}
</style>
