<template>
  <Container class="space-y-6 flex flex-col h-full py-8 max-w-7xl">
    <PageHeader
      title="Event Loop & Concurrency"
      description="An interactive engineering playground for understanding JavaScript's single thread, jank, and Web Workers."
    />

    <!-- 1. Event Loop Architecture -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">1. Event Loop Architecture</h3>
      <p class="text-text-secondary mb-4">
        JavaScript runs on a single main thread. The Event Loop is responsible for executing code,
        collecting and processing events, and executing queued sub-tasks.
      </p>
      <EventLoopVisualizer />
    </section>

    <!-- 2. Main Thread Blocker -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">2. Main Thread Blocker</h3>
      <p class="text-text-secondary mb-4">
        If you execute heavy, synchronous work, the entire browser tab freezes. Animations stop,
        clicks are ignored, and FPS drops to 0. Try starting the animation below, then block the
        main thread.
      </p>
      <MainThreadBlocker />
    </section>

    <!-- 2. Web Worker Demo -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">2. Web Worker Offloading</h3>
      <p class="text-text-secondary mb-4">
        Web Workers run on separate background threads. By offloading heavy work (like sorting or
        hashing), the main thread remains free to render animations at a buttery smooth 60 FPS.
      </p>
      <WebWorkerDemo />
    </section>

    <!-- 3. Event Loop Queues -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">3. The Event Loop Queues</h3>
      <p class="text-text-secondary mb-4">
        The Event Loop doesn't just execute code top-to-bottom. It maintains separate queues for
        tasks.
        <strong>Microtasks</strong> (Promises, <code>queueMicrotask</code>) are given extreme
        priority and will ALWAYS execute before
        <strong>Macrotasks</strong> (<code>setTimeout</code>, <code>setInterval</code>, DOM events).
      </p>
      <MicroMacroTasks />
    </section>

    <!-- 4. Worker Pool -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">4. Worker Pool</h3>
      <p class="text-text-secondary mb-4">
        Web Workers are heavy. Instead of creating a new worker for every small task, a Worker Pool
        allocates tasks to a fixed number of workers.
      </p>
      <WorkerPool />
    </section>

    <!-- 5. requestAnimationFrame vs requestIdleCallback -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">5. Frame Scheduling (rAF vs rIC)</h3>
      <p class="text-text-secondary mb-4">
        Compare how visual updates (rAF) sync with the display refresh rate, while background tasks
        (rIC) only execute during idle time.
      </p>
      <RAFvsIdle />
    </section>

    <!-- 6. Long Task Monitor -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">6. Long Task Monitor</h3>
      <p class="text-text-secondary mb-4">
        Detects tasks exceeding 50ms using the PerformanceObserver API.
      </p>
      <LongTaskMonitor />
    </section>

    <!-- 7. Timeline Visualizer -->
    <section>
      <h3 class="text-2xl font-bold text-text-primary mb-4">7. DevTools Timeline Simulation</h3>
      <p class="text-text-secondary mb-4">
        A visual breakdown of how the browser schedules the rendering pipeline across threads during
        a typical frame.
      </p>
      <Timeline />
    </section>

    <!-- Educational Framework Integration -->
    <LearningSummaryCard :data="learningData" class="mx-auto mt-8" />

    <RelatedKnowledge entity-id="concurrency" entity-type="experiment" />
  </Container>
</template>

<script setup lang="ts">
import LearningSummaryCard from '~/components/common/learning/LearningSummaryCard.vue'
import Container from '~/components/layout/Container.vue'
import PageHeader from '~/components/patterns/PageHeader.vue'
import RelatedKnowledge from '~/components/patterns/RelatedKnowledge.vue'
import type { LearningSummaryData } from '~/types/learning'
import EventLoopVisualizer from '~/components/experiments/concurrency/EventLoopVisualizer.vue'
import MainThreadBlocker from '~/components/experiments/concurrency/MainThreadBlocker.vue'
import WebWorkerDemo from '~/components/experiments/concurrency/WebWorkerDemo.vue'
import MicroMacroTasks from '~/components/experiments/concurrency/MicroMacroTasks.vue'
import WorkerPool from '~/components/experiments/concurrency/WorkerPool.vue'
import RAFvsIdle from '~/components/experiments/concurrency/RAFvsIdle.vue'
import LongTaskMonitor from '~/components/experiments/concurrency/LongTaskMonitor.vue'
import Timeline from '~/components/experiments/concurrency/Timeline.vue'
const learningData: LearningSummaryData = {
  title: 'JavaScript Event Loop & Concurrency',
  whatIsIt:
    'JavaScript is strictly single-threaded, meaning it can only execute one piece of code at a time. The Event Loop is the mechanism that allows JS to perform non-blocking I/O operations (like fetching data or timeouts) despite being single-threaded.',
  howItWorks:
    'The browser places synchronous code on the Call Stack. When asynchronous code is encountered, it is handed off to browser Web APIs. Once complete, callbacks are pushed to the Macrotask Queue (setTimeout) or Microtask Queue (Promises). The Event Loop constantly checks: if the Call Stack is empty, it pushes tasks from the queues back onto the stack to run.',
  recommendation: {
    approach: 'Offload heavy synchronous calculations to Web Workers.',
    reasoning:
      'Any JavaScript execution that takes longer than 50ms (a "Long Task") blocks the browser from updating the UI, processing clicks, or scrolling. Web Workers run on a separate OS thread, completely freeing the Main Thread.',
    codeSample: `// ✅ Main Thread
const worker = new Worker('heavyTask.js')
worker.postMessage({ data: massiveArray })
worker.onmessage = (e) => console.log('Result:', e.data)

// ✅ heavyTask.js (Background Thread)
self.onmessage = (e) => {
  const result = expensiveMath(e.data)
  self.postMessage(result)
}`
  },
  decisionMatrix: [
    {
      situation: 'Fetching API data',
      recommended: 'async/await (Microtask)',
      alternative: 'Promises',
      avoid: 'Synchronous XHR'
    },
    {
      situation: 'Heavy JSON parsing / Crypto',
      recommended: 'Web Worker',
      alternative: 'requestIdleCallback chunking',
      avoid: 'Main thread processing'
    },
    {
      situation: 'DOM Animation / Visual updates',
      recommended: 'requestAnimationFrame',
      alternative: 'CSS Animations',
      avoid: 'setTimeout'
    },
    {
      situation: 'Non-critical analytics ping',
      recommended: 'requestIdleCallback',
      alternative: 'setTimeout',
      avoid: 'Blocking main execution'
    }
  ],
  commonMistakes: [
    {
      problem: 'Blocking the main thread with heavy math.',
      impact:
        'The entire browser tab freezes. Gifs stop spinning, buttons cannot be clicked, and scrolling stutters.',
      fix: 'Use Web Workers or slice the calculation into tiny chunks via setTimeout/requestIdleCallback.',
      badCode: `// ❌ Freezes UI for 3 seconds
function filterMillions() {
  return hugeArray.filter(item => complexRegex.test(item.name))
}`,
      goodCode: `// ✅ Allows UI to remain interactive
const worker = new Worker('filterWorker.js')
worker.postMessage(hugeArray)`
    },
    {
      problem: 'Overusing requestAnimationFrame for non-visual tasks.',
      impact: 'Drains battery and steals GPU/CPU budget from actual rendering tasks.',
      fix: 'Only use rAF for things that directly paint to the screen (canvas, DOM positioning). Use rIC or setTimeout for logic.',
      badCode: `// ❌ Polling an API using rAF
function checkStatus() {
  fetch('/status')
  requestAnimationFrame(checkStatus)
}`,
      goodCode: `// ✅ Polling via setInterval
setInterval(() => {
  fetch('/status')
}, 1000)`
    }
  ],
  interviewQuestions: [
    {
      question: 'What is the difference between a Microtask and a Macrotask?',
      difficulty: 'Intermediate',
      answer:
        'Microtasks (Promises, MutationObserver) have higher priority. After a Macrotask (setTimeout, DOM event) finishes, the Event Loop will empty the ENTIRE Microtask queue before rendering the DOM or moving to the next Macrotask.'
    },
    {
      question: 'If you have an infinite loop in a Promise.then() block, what happens?',
      difficulty: 'Advanced',
      answer:
        'The browser tab will freeze and eventually crash. Because Promise.then() creates Microtasks, and the Event Loop processes ALL Microtasks before rendering, the rendering phase will never be reached.'
    }
  ],
  proTips: [
    "Vue's nextTick() utilizes Microtasks to defer DOM updates. This is why you can mutate state 50 times synchronously, but Vue only renders once.",
    'Always prefer CSS animations for simple transforms over JS `requestAnimationFrame`. CSS animations can often run on the compositor thread, bypassing the JS Main Thread entirely.'
  ]
}

useHead({
  title: 'Event Loop & Concurrency - Frontend Performance Lab'
})
</script>
