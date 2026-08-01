<template>
  <div class="space-y-10 pb-10">
    <div class="border-b border-border pb-6">
      <h2 class="text-4xl font-bold text-text-primary tracking-tight">Reactivity Visualizer</h2>
      <p class="text-text-secondary mt-2 text-xl">An interactive deep dive into Vue 3's Proxy-based reactivity engine.</p>
    </div>

    <div class="flex items-center space-x-4 bg-surface p-4 rounded-xl border border-border">
      <span class="font-medium">Advanced Mode:</span>
      <button 
        :class="['px-4 py-1.5 rounded-md text-sm font-semibold transition-colors', advancedMode ? 'bg-danger text-white' : 'bg-background border border-border text-text-secondary hover:text-text-primary']"
        @click="advancedMode = !advancedMode"
      >
        {{ advancedMode ? 'Enabled' : 'Disabled' }}
      </button>
      <span class="text-sm text-text-secondary ml-4">Reveals internal APIs (track, trigger, WeakMap, EffectScope)</span>
    </div>

    <!-- Live Render Counter -->
    <RenderCounter />

    <!-- Section 1: Ref vs Reactive -->
    <section>
      <h3 class="text-2xl font-bold mb-4 text-text-primary">1. Ref vs Reactive</h3>
      <RefVsReactive :advanced="advancedMode" />
    </section>

    <!-- Section 2: Computed vs Method -->
    <section>
      <h3 class="text-2xl font-bold mb-4 text-text-primary">2. Computed vs Method Benchmark</h3>
      <ComputedVsMethod :advanced="advancedMode" />
    </section>

    <!-- Section 3: Watch vs WatchEffect -->
    <section>
      <h3 class="text-2xl font-bold mb-4 text-text-primary">3. Watch vs WatchEffect</h3>
      <WatchVsWatchEffect :advanced="advancedMode" />
    </section>

    <!-- Section 4: Dependency Graph -->
    <section>
      <h3 class="text-2xl font-bold mb-4 text-text-primary">4. Interactive Dependency Graph</h3>
      <DependencyGraph :advanced="advancedMode" />
    </section>

    <!-- Section 5: Effect Timeline -->
    <section>
      <h3 class="text-2xl font-bold mb-4 text-text-primary">5. Effect Timeline</h3>
      <EffectTimeline :advanced="advancedMode" />
    </section>

    <!-- Section 6: Proxy & Scheduler Visualizers (Advanced) -->
    <section v-if="advancedMode" class="space-y-10">
      <div>
        <h3 class="text-2xl font-bold mb-4 text-danger flex items-center gap-2">
          <span>⚙️</span> Proxy Internal Visualizer
        </h3>
        <ProxyVisualizer />
      </div>
      <div>
        <h3 class="text-2xl font-bold mb-4 text-danger flex items-center gap-2">
          <span>⚙️</span> Scheduler Visualizer
        </h3>
        <SchedulerVisualizer />
      </div>
    </section>

    <!-- Section 7: Common Mistakes -->
    <section>
      <h3 class="text-2xl font-bold mb-4 text-text-primary">6. Common Mistakes</h3>
      <CommonMistakes />
    </section>

    <!-- Section 8: Takeaways -->
    <section>
      <h3 class="text-2xl font-bold mb-4 text-text-primary">Performance Takeaways</h3>
      <PerformanceSummary />
    </section>

    <!-- Floating Reactive Inspector (DevTools style) -->
    <ReactiveInspector />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import RenderCounter from '~/components/experiments/reactivity/RenderCounter.vue'
import RefVsReactive from '~/components/experiments/reactivity/RefVsReactive.vue'
import ComputedVsMethod from '~/components/experiments/reactivity/ComputedVsMethod.vue'
import WatchVsWatchEffect from '~/components/experiments/reactivity/WatchVsWatchEffect.vue'
import DependencyGraph from '~/components/experiments/reactivity/DependencyGraph.vue'
import EffectTimeline from '~/components/experiments/reactivity/EffectTimeline.vue'
import ProxyVisualizer from '~/components/experiments/reactivity/ProxyVisualizer.vue'
import SchedulerVisualizer from '~/components/experiments/reactivity/SchedulerVisualizer.vue'
import ReactiveInspector from '~/components/experiments/reactivity/ReactiveInspector.vue'

const advancedMode = ref(false)
</script>
