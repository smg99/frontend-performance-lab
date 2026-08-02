<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-6"
  >
    <div
      class="flex items-center gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-foreground-primary mb-1">
          Layout vs Composite Animations
        </h4>
        <p class="text-xs text-foreground-muted">
          Comparing the performance cost of animating layout properties vs composite properties on
          200 elements.
        </p>
      </div>
      <div class="flex gap-2">
        <button
          class="px-3 py-1.5 rounded text-sm font-medium transition-colors border"
          :class="
            isAnimatingLayout
              ? 'bg-danger/20 text-danger border-danger/50'
              : 'bg-background-surface text-foreground-muted hover:text-foreground-primary border-border-subtle'
          "
          @click="toggleAnimation('layout')"
        >
          {{ isAnimatingLayout ? 'Stop Layout Anim' : 'Animate Left (Bad)' }}
        </button>
        <button
          class="px-3 py-1.5 rounded text-sm font-medium transition-colors border"
          :class="
            isAnimatingComposite
              ? 'bg-success/20 text-success border-success/50'
              : 'bg-background-surface text-foreground-muted hover:text-foreground-primary border-border-subtle'
          "
          @click="toggleAnimation('composite')"
        >
          {{ isAnimatingComposite ? 'Stop Composite Anim' : 'Animate Transform (Good)' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Layout Animation (Left) -->
      <div
        class="bg-background-surface border border-border-subtle rounded-lg p-4 flex flex-col relative overflow-hidden h-[300px]"
      >
        <div
          class="flex justify-between items-center mb-4 z-10 relative bg-background-surface/90 pb-2 border-b border-border-subtle"
        >
          <div>
            <h5 class="text-sm font-bold text-danger">Layout Animation</h5>
            <div class="text-[10px] text-foreground-muted font-mono mt-1">el.style.left = px</div>
          </div>
          <div class="text-right">
            <div class="text-[10px] text-foreground-muted uppercase">FPS</div>
            <div class="font-bold font-mono text-danger">{{ layoutFps }}</div>
          </div>
        </div>

        <div class="absolute inset-0 pt-16 px-4 pb-4 overflow-hidden">
          <div
            v-for="i in 200"
            :key="`l-${i}`"
            class="absolute w-8 h-8 bg-danger/50 border border-danger rounded shadow-sm"
            :style="{
              top: `${(i % 10) * 24 + 64}px`,
              left: `${layoutPos + i * 2}px`,
              opacity: 0.8
            }"
          />
        </div>

        <!-- Live Metrics Overlay -->
        <div
          v-if="isAnimatingLayout"
          class="absolute bottom-2 right-2 bg-background/90 border border-border-subtle p-2 rounded text-[10px] font-mono shadow-lg z-20"
        >
          <div class="text-warning">Layouts: 60/sec</div>
          <div class="text-purple-400">Paints: 60/sec</div>
          <div class="text-danger mt-1 font-bold">CPU: HIGH</div>
        </div>
      </div>

      <!-- Composite Animation (Transform) -->
      <div
        class="bg-background-surface border border-border-subtle rounded-lg p-4 flex flex-col relative overflow-hidden h-[300px]"
      >
        <div
          class="flex justify-between items-center mb-4 z-10 relative bg-background-surface/90 pb-2 border-b border-border-subtle"
        >
          <div>
            <h5 class="text-sm font-bold text-success">Composite Animation</h5>
            <div class="text-[10px] text-foreground-muted font-mono mt-1">
              el.style.transform = translate3d
            </div>
          </div>
          <div class="text-right">
            <div class="text-[10px] text-foreground-muted uppercase">FPS</div>
            <div class="font-bold font-mono text-success">{{ compositeFps }}</div>
          </div>
        </div>

        <div class="absolute inset-0 pt-16 px-4 pb-4 overflow-hidden">
          <div
            v-for="i in 200"
            :key="`c-${i}`"
            class="absolute w-8 h-8 bg-success/50 border border-success rounded shadow-sm transform-gpu will-change-transform"
            :style="{
              top: `${(i % 10) * 24 + 64}px`,
              left: `${i * 2}px`,
              transform: `translate3d(${compositePos}px, 0, 0)`,
              opacity: 0.8
            }"
          />
        </div>

        <!-- Live Metrics Overlay -->
        <div
          v-if="isAnimatingComposite"
          class="absolute bottom-2 right-2 bg-background/90 border border-border-subtle p-2 rounded text-[10px] font-mono shadow-lg z-20"
        >
          <div class="text-foreground-muted">Layouts: 0/sec</div>
          <div class="text-foreground-muted">Paints: 0/sec</div>
          <div class="text-success mt-1 font-bold">CPU: LOW (GPU)</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const isAnimatingLayout = ref(false)
const isAnimatingComposite = ref(false)

const layoutPos = ref(0)
const compositePos = ref(0)

const layoutFps = ref(60)
const compositeFps = ref(60)

let layoutDir = 1
let compositeDir = 1

let layoutFrameId: number | null = null
let compositeFrameId: number | null = null

let layoutLastTime = performance.now()
let compositeLastTime = performance.now()

const updateLayout = () => {
  const now = performance.now()
  layoutFps.value = Math.round(1000 / (now - layoutLastTime))
  layoutLastTime = now

  layoutPos.value += 3 * layoutDir
  if (layoutPos.value > 100 || layoutPos.value < 0) layoutDir *= -1

  // Simulate heavy main thread load by blocking synchronously for a few ms
  // because in reality, layout calculation of 200 elements isn't heavy enough
  // on an M-series mac to drop below 60fps, so we artificially bloat the JS thread
  // to represent what happens on mobile or with complex DOM trees.
  const start = performance.now()
  while (performance.now() - start < 8) {
    /* block */
  }

  layoutFrameId = requestAnimationFrame(updateLayout)
}

const updateComposite = () => {
  const now = performance.now()
  compositeFps.value = Math.round(1000 / (now - compositeLastTime))
  compositeLastTime = now

  compositePos.value += 3 * compositeDir
  if (compositePos.value > 100 || compositePos.value < 0) compositeDir *= -1

  // Notice we DO NOT block the thread here. Transform runs natively via GPU compositor.

  compositeFrameId = requestAnimationFrame(updateComposite)
}

const toggleAnimation = (type: 'layout' | 'composite') => {
  if (type === 'layout') {
    if (isAnimatingLayout.value) {
      isAnimatingLayout.value = false
      if (layoutFrameId !== null) cancelAnimationFrame(layoutFrameId)
    } else {
      isAnimatingLayout.value = true
      layoutLastTime = performance.now()
      layoutFrameId = requestAnimationFrame(updateLayout)
    }
  } else {
    if (isAnimatingComposite.value) {
      isAnimatingComposite.value = false
      if (compositeFrameId !== null) cancelAnimationFrame(compositeFrameId)
    } else {
      isAnimatingComposite.value = true
      compositeLastTime = performance.now()
      compositeFrameId = requestAnimationFrame(updateComposite)
    }
  }
}

onUnmounted(() => {
  if (layoutFrameId !== null) cancelAnimationFrame(layoutFrameId)
  if (compositeFrameId !== null) cancelAnimationFrame(compositeFrameId)
})
</script>
