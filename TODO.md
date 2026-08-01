# Frontend Performance Lab - Roadmap

## Phase 1: MVP & Foundation (Completed)
- [x] Nuxt 4, Vue 3, Vite, Tailwind CSS Setup
- [x] Dashboard & Theming Architecture
- [x] Experiment 1: Rendering Virtualization (Naive, VueUse, Custom)

## Phase 2: Core Reactivity & JavaScript Performance (Next)
- [ ] **Experiment 2: Reactivity Visualizer**
  - Demonstrate Vue 3 Proxy behavior (ref vs reactive).
  - Compare `computed` caching vs method invocation.
  - Interactive trace of reactive dependency collection.
- [ ] **Experiment 3: The Event Loop**
  - Visual timeline of Microtasks (Promises, process.nextTick) vs Macrotasks (setTimeout, DOM events).
  - Show how long-running synchronous tasks block rendering.
- [ ] **Experiment 4: Web Workers for Heavy Computation**
  - Compare calculating a Fibonacci sequence or image processing on Main Thread vs Web Worker.
  - Live FPS graph during computation.

## Phase 3: Assets & Layouts
- [ ] **Experiment 5: Image Optimization**
  - Side-by-side load times and memory cost for PNG vs JPEG vs WebP vs AVIF.
  - Explain `picture` element and lazy loading.
- [ ] **Experiment 6: Layout Thrashing**
  - Demonstrate reading and writing to the DOM in an interleaved fashion vs batching.
  - Show impact on layout cost and Paint times.
- [ ] **Experiment 7: Animations (Transform vs Top/Left)**
  - Animate 1000 particles using `top`/`left` (triggering reflows/repaints) vs `transform` (GPU accelerated).

## Phase 4: Advanced Profiling & Architecture
- [ ] **Experiment 8: Memory Leaks**
  - Simulate a memory leak (e.g., uncleared event listeners or detached DOM nodes).
  - Guide on taking and comparing Heap Snapshots.
- [ ] **Bundle Analysis Page**
  - Interactive visualization of Vite chunking strategy.
  - Explain Tree-shaking and dynamic imports (`defineAsyncComponent`).
- [ ] **PWA & Offline Strategies**
  - Demonstrate Service Worker caching strategies (Stale-while-revalidate vs Cache-first).
