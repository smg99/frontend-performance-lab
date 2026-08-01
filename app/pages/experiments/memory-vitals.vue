<template>
  <Container class="space-y-6 flex flex-col h-full py-8 max-w-7xl">
    <PageHeader
      title="Memory Management & Core Web Vitals"
      description="An interactive engineering playground for understanding Garbage Collection, Memory Leaks, and Web Vitals."
    />

    <!-- 1. Garbage Collection (Heap & Stack) -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">1. Garbage Collection: Mark & Sweep</h3>
      <p class="text-text-secondary mb-4">
        JavaScript uses an automatic memory management system called a Garbage Collector. It traces
        paths from root objects (like the `window`) to find active memory. Anything disconnected
        (unreachable) gets swept away.
      </p>
      <GarbageCollectionVisualizer />
    </section>

    <!-- 2. Memory Leak Laboratory -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">2. Memory Leak Laboratory</h3>
      <p class="text-text-secondary mb-4">
        Memory leaks occur when you accidentally keep references to objects that are no longer
        needed. The Garbage Collector cannot free them, causing the Heap to grow until the browser
        crashes.
      </p>
      <MemoryLeakLab />
    </section>

    <!-- 3. Weak References -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">3. Weak References</h3>
      <p class="text-text-secondary mb-4">
        A <code>WeakMap</code> or <code>WeakRef</code> allows you to reference an object without
        preventing it from being garbage collected. They are essential for building caches that
        don't leak memory.
      </p>
      <WeakReferences />
    </section>

    <!-- 4. LCP Visualizer -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">4. Largest Contentful Paint (LCP)</h3>
      <p class="text-text-secondary mb-4">
        LCP measures when the largest text block or image element becomes visible. A fast LCP
        reassures the user that the page is useful.
      </p>
      <LCPVisualizer />
    </section>

    <!-- 5. CLS Visualizer -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">5. Cumulative Layout Shift (CLS)</h3>
      <p class="text-text-secondary mb-4">
        CLS measures visual stability. If elements jump around without user input (like a
        late-loading image pushing text down), it causes a frustrating user experience.
      </p>
      <CLSVisualizer />
    </section>

    <!-- 6. INP Visualizer -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">6. Interaction to Next Paint (INP)</h3>
      <p class="text-text-secondary mb-4">
        INP measures responsiveness. It captures the latency of every click, tap, and keyboard
        interaction throughout the lifespan of the page.
      </p>
      <INPVisualizer />
    </section>

    <!-- Educational Framework Integration -->
    <LearningSummaryCard :data="learningData" class="mx-auto mt-8" />

    <RelatedKnowledge entity-id="memory-vitals" entity-type="experiment" />
  </Container>
</template>

<script setup lang="ts">
import LearningSummaryCard from '~/components/common/learning/LearningSummaryCard.vue'
import Container from '~/components/layout/Container.vue'
import PageHeader from '~/components/patterns/PageHeader.vue'
import RelatedKnowledge from '~/components/patterns/RelatedKnowledge.vue'
import type { LearningSummaryData } from '~/types/learning'
import GarbageCollectionVisualizer from '~/components/experiments/memory/GarbageCollectionVisualizer.vue'
import MemoryLeakLab from '~/components/experiments/memory/MemoryLeakLab.vue'
import WeakReferences from '~/components/experiments/memory/WeakReferences.vue'
import LCPVisualizer from '~/components/experiments/web-vitals/LCPVisualizer.vue'
import CLSVisualizer from '~/components/experiments/web-vitals/CLSVisualizer.vue'
import INPVisualizer from '~/components/experiments/web-vitals/INPVisualizer.vue'

const learningData: LearningSummaryData = {
  title: 'Memory Management & Core Web Vitals',
  whatIsIt:
    "Core Web Vitals are Google's standardized metrics for measuring User Experience (LCP for loading, CLS for visual stability, and INP for responsiveness). Memory Management is how V8 reclaims unused memory (Garbage Collection) to prevent memory leaks and crashes.",
  howItWorks:
    "V8 uses a Mark-and-Sweep algorithm. It starts at the Root (Window) and MARKS everything it can reach. It then SWEEPS away anything that wasn't marked. A Memory Leak occurs when you accidentally keep a reference to an object (like a detached DOM node in an Array), preventing the Garbage Collector from sweeping it.",
  recommendation: {
    approach: 'Preload LCP images and explicit height/width on all elements.',
    reasoning:
      'LCP is often delayed by late image discovery. `<link rel="preload">` tells the browser to fetch it immediately. CLS happens when images load and push text down; explicit dimensions reserve the space before the image arrives.',
    codeSample: `<!-- ✅ Fix LCP: Preload Hero Image -->
<link rel="preload" as="image" href="/hero.webp">

<!-- ✅ Fix CLS: Reserve Dimensions -->
<img src="/hero.webp" width="800" height="400" style="aspect-ratio: 800/400">`
  },
  decisionMatrix: [
    {
      situation: 'Caching DOM Nodes in JS',
      recommended: 'WeakMap / WeakRef',
      alternative: 'Map (with manual cleanup)',
      avoid: 'Global Arrays/Objects'
    },
    {
      situation: 'Binding Event Listeners',
      recommended: 'onMounted & onUnmounted',
      alternative: 'AbortController',
      avoid: 'Binding without cleanup'
    },
    {
      situation: 'Heavy Click Handlers',
      recommended: 'Yield to main thread',
      alternative: 'Web Workers',
      avoid: 'Synchronous blocking code'
    }
  ],
  commonMistakes: [
    {
      problem: 'Detached DOM Memory Leaks.',
      impact:
        'Removing an element from the DOM with `el.remove()` does not delete it if a JavaScript variable still points to it. This causes infinite memory bloat.',
      fix: 'Nullify references after removing elements.',
      badCode: `const elements = []
// ❌ Retains memory forever!
const btn = document.getElementById('btn')
elements.push(btn)
btn.remove()`,
      goodCode: `let elements = []
// ✅ Drops reference, allows Garbage Collection
const btn = document.getElementById('btn')
elements.push(btn)
btn.remove()
elements = []`
    }
  ],
  interviewQuestions: [
    {
      question: 'What is Interaction to Next Paint (INP) and how do you improve it?',
      difficulty: 'Intermediate',
      answer:
        'INP measures the latency of all interactions (clicks, taps, typing). It is improved by minimizing Main Thread blocking tasks. If a click handler takes 500ms to calculate data synchronously, the browser cannot paint the button\'s "pressed" state, resulting in a terrible INP. Use Web Workers or yield with setTimeout.'
    },
    {
      question: 'Explain how a Closure can cause a memory leak.',
      difficulty: 'Advanced',
      answer:
        "A closure retains access to the outer function's scope. If an event listener uses a closure that captures a massive object, and that listener is attached to the global Window but never removed, the massive object can never be Garbage Collected."
    }
  ],
  proTips: [
    "Always clean up event listeners, timers (`setInterval`), and 3rd party library instances in Vue's `onUnmounted` hook.",
    'Use Chrome DevTools Memory tab to take Heap Snapshots. Look for "Detached HTMLElement" to find leaking DOM nodes.',
    'Optimize LCP by hosting images on the same domain or preconnecting to CDNs to avoid DNS/TLS lookup delays.'
  ]
}

useHead({
  title: 'Memory & Web Vitals - Frontend Performance Lab'
})
</script>
