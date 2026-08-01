<div align="center">
  <h1>🔬 Frontend Performance Lab</h1>
  <p><strong>An Interactive Engineering Playground for Browser Internals</strong></p>

  <p>
    <a href="https://nuxt.com/"><img src="https://img.shields.io/badge/Nuxt-002E3B?style=for-the-badge&logo=nuxt.js&logoColor=#00DC82" alt="Nuxt 4" /></a>
    <a href="https://vuejs.org/"><img src="https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D" alt="Vue 3" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  </p>
</div>

---

> This project is **NOT** a tutorial. It is an interactive engineering playground where developers can **SEE** exactly what the browser is doing. Everything is measurable, animated, and integrates with real-time performance benchmarks.

## 🚀 The Experiments

The laboratory is divided into 5 major interactive phases that demystify modern web performance.

### 1️⃣ Rendering Virtualization
Understand how to render massive datasets without crashing the browser. 
- 📊 Compare a Naive implementation vs VueUse vs Custom Virtualization.
- 📉 Watch live metrics for FPS, DOM Nodes, and Memory footprint drop drastically when windowing is applied.

### 2️⃣ Reactivity & State
Visualize the inner workings of Vue's proxy-based reactivity system.
- 🔗 **Dependency Graph:** Watch as nodes are dynamically tracked and traced.
- ⚡ **`ref` vs `reactive`:** See the architectural difference in proxy wrappers.
- ⚠️ **`watch` vs `watchEffect`:** Click "Trigger Unrelated State" and watch `watchEffect` implicitly over-fetch while explicit `watch` stays idle.

### 3️⃣ Event Loop & Concurrency
See JavaScript's single-threaded nature in real-time.
- ⚙️ **Main Thread Blocker:** Freeze the UI with a synchronous 3M Prime calculation and watch CSS animations jank.
- 🧵 **Web Worker Offloading:** Offload that same calculation to a background worker and watch the UI spin perfectly at 60 FPS.
- ⏱️ **rAF vs rIC:** Visually track the difference in browser prioritization between `requestAnimationFrame` and `requestIdleCallback`.

### 4️⃣ Rendering Pipeline & Layout
The exact mechanics of how CSS and JS impact the GPU and CPU.
- 🧱 **Layout Thrashing:** Trigger forced synchronous layouts and watch execution time skyrocket.
- 🎨 **Paint Flashing:** Visualize the difference between CPU layout properties (top/left) and GPU composite properties (transform/opacity).

### 5️⃣ Memory & Core Web Vitals
Debug leaks and optimize for Google Lighthouse scores.
- 🗑️ **Garbage Collection:** An interactive Mark & Sweep animation. Allocate nodes, detach them, and manually fire the V8 GC.
- 💧 **Memory Leaks:** Intentionally bloat the heap with detached DOM nodes and forgotten closures, then fix them.
- 📈 **Web Vitals Simulator:** Interactive sliders and simulations calculating LCP, CLS, and INP on the fly.

## 📚 Reusable Learning Framework

Every experiment concludes with our custom **Learning Summary Framework**. Instead of just showing code, the lab breaks down:
- 📖 **What it is & How it works**
- 🚀 **Production Recommendations**
- ⚖️ **Decision Matrices** (When to use X vs Y)
- 🎯 **Interview Questions & Answers**
- ⚠️ **Common Mistakes**

## 🛠️ Getting Started

### Prerequisites
- Node.js `18.x` or higher
- npm or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/frontend-performance-lab.git
cd frontend-performance-lab
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open `http://localhost:3000` in your browser.

## 🎨 Design Philosophy
- Built to the quality bar of **Chrome DevTools**, **Vercel**, and **web.dev**.
- Strict TypeScript (`no-any`).
- Composition API.
- Fully responsive with seamless Dark/Light Mode.

## 🤝 Contributing
Contributions are welcome! If you want to add a new experiment, simply build your visualizer and hook it up to the `<LearningSummaryCard />` schema. 
