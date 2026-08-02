<template>
  <div
    class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-subtle flex flex-col gap-6"
  >
    <div
      class="flex items-center gap-4 bg-background-surface p-4 rounded-lg border border-border-subtle"
    >
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-foreground-primary mb-1">
          Interaction to Next Paint (INP)
        </h4>
        <p class="text-xs text-foreground-muted">
          Measures the latency of every tap, click, or keyboard interaction. Good: &lt; 200ms. Poor:
          &gt; 500ms.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Interactive Area -->
      <div
        class="bg-background-surface border border-border-subtle rounded-lg p-6 flex flex-col gap-4"
      >
        <div class="flex-1 flex flex-col justify-center gap-4">
          <button
            class="px-4 py-3 bg-success text-white rounded font-bold transition-all transform active:scale-95"
            :class="{ 'opacity-50': isProcessing }"
            @click="handleFastClick"
          >
            Fast Interaction (Yields)
          </button>

          <button
            class="px-4 py-3 bg-danger text-white rounded font-bold transition-all transform active:scale-95"
            :class="{ 'opacity-50': isProcessing }"
            @click="handleSlowClick"
          >
            Slow Interaction (Blocks)
          </button>
        </div>

        <div
          class="h-10 border border-border-subtle rounded bg-background flex items-center justify-center font-mono text-sm text-foreground-muted"
          :class="{ 'bg-primary/10 text-primary font-bold': clicks > 0 }"
        >
          Clicks Processed: {{ clicks }}
        </div>
      </div>

      <!-- INP Timeline -->
      <div
        class="bg-background-surface border border-border-subtle rounded-lg p-4 flex flex-col justify-center relative overflow-hidden h-[250px]"
      >
        <h5 class="text-xs font-bold text-foreground-muted uppercase tracking-widest mb-4">
          Latest Interaction Latency
        </h5>

        <!-- Graph -->
        <div class="flex-1 flex flex-col gap-2 font-mono text-[10px]">
          <div class="flex items-center gap-2">
            <div class="w-16 text-right text-foreground-muted">Input Delay</div>
            <div
              class="h-4 bg-blue-500 rounded transition-all duration-300"
              :style="{ width: `${Math.min(inputDelay / 5, 100)}%` }"
            />
            <div class="text-blue-400 font-bold">{{ inputDelay.toFixed(1) }}ms</div>
          </div>

          <div class="flex items-center gap-2">
            <div class="w-16 text-right text-foreground-muted">Processing</div>
            <div
              class="h-4 bg-purple-500 rounded transition-all duration-300"
              :style="{ width: `${Math.min(processingTime / 5, 100)}%` }"
            />
            <div class="text-purple-400 font-bold">{{ processingTime.toFixed(1) }}ms</div>
          </div>

          <div class="flex items-center gap-2">
            <div class="w-16 text-right text-foreground-muted">Presentation</div>
            <div
              class="h-4 bg-success rounded transition-all duration-300"
              :style="{ width: `${Math.min(presentationDelay / 5, 100)}%` }"
            />
            <div class="text-success font-bold">{{ presentationDelay.toFixed(1) }}ms</div>
          </div>
        </div>

        <div class="border-t border-border-subtle pt-4 mt-4 flex justify-between items-end">
          <div>
            <div class="text-xs text-foreground-muted uppercase font-bold">Total INP</div>
            <div
              class="text-[10px]"
              :class="
                inpScore === 'GOOD'
                  ? 'text-success'
                  : inpScore === 'POOR'
                    ? 'text-danger'
                    : 'text-warning'
              "
            >
              {{ inpScore }}
            </div>
          </div>
          <div
            class="text-4xl font-bold font-mono"
            :class="
              inpScore === 'GOOD'
                ? 'text-success'
                : inpScore === 'POOR'
                  ? 'text-danger'
                  : 'text-warning'
            "
          >
            {{ totalLatency.toFixed(0) }}ms
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const isProcessing = ref(false)
const clicks = ref(0)

const inputDelay = ref(0)
const processingTime = ref(0)
const presentationDelay = ref(0)

const totalLatency = computed(
  () => inputDelay.value + processingTime.value + presentationDelay.value
)
const inpScore = computed(() => {
  if (totalLatency.value === 0) return 'NO DATA'
  if (totalLatency.value <= 200) return 'GOOD'
  if (totalLatency.value <= 500) return 'NEEDS IMPROVEMENT'
  return 'POOR'
})

const handleFastClick = () => {
  // Fast interaction: we do tiny work, Vue updates DOM, browser paints quickly.
  inputDelay.value = 15 // Typical device input delay
  processingTime.value = 5 // Fast handler
  presentationDelay.value = 16 // One frame
  clicks.value++
}

const handleSlowClick = () => {
  if (isProcessing.value) return
  isProcessing.value = true

  // The moment the user clicks, there is input delay
  inputDelay.value = 25

  // Block the main thread for 600ms (simulate heavy processing or layout thrashing in a click handler)
  const start = performance.now()
  while (performance.now() - start < 600) {
    /* block */
  }

  processingTime.value = 600

  // Because the main thread was blocked, the browser couldn't paint the button's active state
  // or the updated click count until now.
  presentationDelay.value = 32 // Two frames dropped

  clicks.value++
  isProcessing.value = false
}
</script>
