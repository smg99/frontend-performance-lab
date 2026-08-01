# Project Principles

This document defines the core philosophy guiding all contributions to the **Frontend Performance Lab**.

1. **Measure before optimizing:** Never assume a bottleneck. Always rely on the `benchmark-engine` to prove performance degradation before applying a fix.
2. **Visualize every concept:** Abstract concepts (like the Event Loop or Vue's Reactivity Proxy) must be accompanied by visual diagrams or interactive timelines.
3. **Every experiment must be interactive:** Users learn by doing. Provide sliders, throttlers, and interactive knobs to break and fix the UI in real-time.
4. **Every recommendation must explain trade-offs:** Silver bullets do not exist in software engineering. If you recommend virtualization, explain when it hurts accessibility.
5. **Browser APIs over simulations:** Prefer native APIs (`IntersectionObserver`, `requestIdleCallback`) to simulate behavior whenever possible.
6. **Framework Independence:** Educational content lives in `shared/content` as pure TypeScript. Never hardcode data into the Vue UI.
7. **Accessibility is mandatory:** All experiments must meet WCAG AA standards.
8. **Avoid duplicated educational content:** Do not redefine what the Event Loop is in 5 different experiments. Define it once and use the `relationships` array to link to it.
9. **Production examples over toy examples:** Demonstrate how concepts are used in large-scale applications, not just simple counters.
10. **Favor maintainability over clever abstractions:** Keep the architecture simple, strongly typed, and easy to clone.
