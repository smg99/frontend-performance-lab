<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-6"
  >
    <div
      class="flex items-center gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-foreground-primary mb-1">Paint Flashing Simulator</h4>
        <p class="text-xs text-foreground-muted">
          Simulates Chrome DevTools' Paint Flashing. Watch how changing a layout property repaints
          the parent, but a transform does not.
        </p>
      </div>
      <div class="flex gap-2">
        <label class="flex items-center gap-2 text-sm text-foreground-muted cursor-pointer">
          <input
            v-model="flashingEnabled"
            type="checkbox"
            class="rounded border-border-subtle bg-background text-success focus:ring-success"
          />
          Enable Paint Flashing
        </label>
      </div>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 gap-6"
      :class="{ 'paint-flashing-active': flashingEnabled }"
    >
      <!-- Layout Example -->
      <div
        class="bg-background-surface border border-border-subtle rounded-lg p-6 flex flex-col relative overflow-hidden group"
      >
        <h5 class="text-sm font-bold text-foreground-muted mb-4 z-20">Triggers Layout & Paint</h5>
        <div class="flex-1 min-h-[150px] relative z-20">
          <div
            class="w-16 h-16 bg-danger rounded shadow flex items-center justify-center text-white font-bold cursor-pointer transition-all duration-300 paint-target"
            :style="{ marginLeft: layoutMargin + 'px' }"
            @click="triggerLayout"
          >
            Click Me
          </div>
        </div>
        <!-- Flash Overlay (simulates browser repainting the entire block) -->
        <div
          class="flash-overlay absolute inset-0 bg-success/30 z-10 pointer-events-none opacity-0 transition-opacity duration-[50ms]"
          :class="{ 'opacity-100': isFlashingLayout }"
        />
      </div>

      <!-- Composite Example -->
      <div
        class="bg-background-surface border border-border-subtle rounded-lg p-6 flex flex-col relative overflow-hidden group"
      >
        <h5 class="text-sm font-bold text-foreground-muted mb-4 z-20">Triggers Composite Only</h5>
        <div class="flex-1 min-h-[150px] relative z-20">
          <div
            class="w-16 h-16 bg-success rounded shadow flex items-center justify-center text-white font-bold cursor-pointer transition-transform duration-300 will-change-transform paint-target"
            :style="{ transform: `translateX(${compositeTransform}px)` }"
            @click="triggerComposite"
          >
            Click Me
          </div>
        </div>
        <!-- Flash Overlay (simulates browser NOT repainting the block) -->
        <div
          class="flash-overlay absolute inset-0 bg-success/30 z-10 pointer-events-none opacity-0 transition-opacity duration-[50ms]"
          :class="{ 'opacity-100': isFlashingComposite }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const flashingEnabled = ref(true)

const layoutMargin = ref(0)
const compositeTransform = ref(0)

const isFlashingLayout = ref(false)
const isFlashingComposite = ref(false)

let layoutDir = 1
let compositeDir = 1

const triggerLayout = () => {
  layoutMargin.value += 50 * layoutDir
  if (layoutMargin.value > 100 || layoutMargin.value < 0) layoutDir *= -1

  if (flashingEnabled.value) {
    // Changing margin triggers layout, which triggers paint for the entire container
    isFlashingLayout.value = true
    setTimeout(() => {
      isFlashingLayout.value = false
    }, 150)
  }
}

const triggerComposite = () => {
  compositeTransform.value += 50 * compositeDir
  if (compositeTransform.value > 100 || compositeTransform.value < 0) compositeDir *= -1

  if (flashingEnabled.value) {
    // Changing transform ONLY triggers composite, NOT paint.
    // The container does NOT flash. Only the element flashes (its texture updates if we change content, but we aren't).
    // We will flash just the target if we wanted to be strictly accurate to some browser behaviors,
    // but in a strict GPU layer promotion, no paint occurs at all!
    // isFlashingComposite.value = true // We leave this false to demonstrate ZERO paint flashing!
  }
}
</script>

<style scoped>
.paint-target {
  /* To simulate green outline that DevTools adds to painted layers */
}
.paint-flashing-active .opacity-100 {
  outline: 2px solid rgba(34, 197, 94, 0.8);
}
</style>
