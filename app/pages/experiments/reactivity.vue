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

    <!-- Educational Framework Integration -->
    <LearningSummaryCard :data="learningData" class="mx-auto mt-12" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LearningSummaryCard from '~/components/common/learning/LearningSummaryCard.vue'
import type { LearningSummaryData } from '~/types/learning'

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

const learningData: LearningSummaryData = {
  title: 'Vue Reactivity System',
  whatIsIt: 'Vue 3\'s reactivity system is built on JavaScript ES6 Proxies. It intercepts read and write operations to variables, allowing Vue to track dependencies (which components read the data) and automatically trigger updates when the data changes.',
  howItWorks: 'When you wrap an object in `reactive()` or `ref()`, Vue returns a Proxy. When a component render function accesses a property (a "GET"), Vue records that component as a dependency. When you mutate the property (a "SET"), Vue notifies all recorded dependencies to re-render.',
  recommendation: {
    approach: 'Standardize on using ref() for almost all reactive state.',
    reasoning: 'While reactive() is slightly cleaner (no .value), it has severe limitations: it only works on objects, and you lose reactivity if you destructure it or reassign the entire object. ref() is universally consistent and makes reactivity explicit.',
    codeSample: `// ✅ Recommended
import { ref } from 'vue'
const user = ref({ name: 'John', age: 30 })

// Reassigning works perfectly!
user.value = { name: 'Jane', age: 31 }`
  },
  decisionMatrix: [
    { situation: 'Primitives (Strings, Numbers, Booleans)', recommended: 'ref()', alternative: 'N/A', avoid: 'reactive()' },
    { situation: 'Destructuring properties', recommended: 'toRefs(reactiveObj)', alternative: 'ref()', avoid: 'const { x } = reactiveObj' },
    { situation: 'Derived state that relies on other refs', recommended: 'computed()', alternative: 'Method call', avoid: 'Manual watch()' }
  ],
  commonMistakes: [
    { 
      problem: 'Destructuring reactive objects loses reactivity.', 
      impact: 'The UI will not update when the data changes because the primitive value was detached from the proxy.', 
      fix: 'Use `toRefs()` or just use `ref()`.',
      badCode: `const state = reactive({ count: 0 })
// ❌ Destructuring breaks reactivity!
let { count } = state`,
      goodCode: `const state = reactive({ count: 0 })
// ✅ Safely destructure while keeping reactivity
const { count } = toRefs(state)`
    },
    { 
      problem: 'Using watchEffect carelessly.', 
      impact: 'watchEffect automatically tracks everything it reads synchronously. If you console.log a massive object inside it, it will trigger an update every time ANY property on that object changes.', 
      fix: 'Use explicit `watch()` if you only care about specific dependencies.',
      badCode: `// ❌ Will re-run if ANY property on state changes
watchEffect(() => {
  console.log(state)
})`,
      goodCode: `// ✅ Only runs when state.id changes
watch(
  () => state.id, 
  (newId) => { console.log(newId) }
)`
    }
  ],
  interviewQuestions: [
    { question: 'What is the difference between a computed property and a method in Vue?', difficulty: 'Beginner', answer: 'A computed property is cached based on its reactive dependencies. It will only re-evaluate when its dependencies change. A method will re-evaluate every single time the component re-renders, which can cause severe performance issues if the calculation is heavy.' },
    { question: 'Why does Vue 3 use ES6 Proxies instead of Object.defineProperty (Vue 2)?', difficulty: 'Advanced', answer: 'Proxies can intercept operations on the entire object, allowing Vue 3 to detect property additions, deletions, and Array index modifications dynamically. Object.defineProperty requires walking the object upfront and attaching getters/setters to existing keys only.' }
  ],
  proTips: [
    'Avoid deeply nested reactive objects if possible. The deeper the proxy, the more overhead it takes to traverse and update.',
    'Use `shallowRef` for large arrays or objects where you only plan to replace the entire object, not mutate its individual properties. This saves massive performance overhead.'
  ]
}
</script>
