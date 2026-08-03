# Slice 2 Dogfooding Acceptance Checklist

This document serves as the acceptance test baseline for the in-memory AST analyzer (Vertical Slice 2). It validates the robustness, accuracy, and fault tolerance of the `performance_audit` MCP tool before advancing to file-based or recipe-based implementations.

## Vue Test Cases (20)

| ID         | Purpose                                                              | Expected Violations                                                | Expected Score | Framework Detection |
| ---------- | -------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------- | ------------------- |
| **Vue-01** | Massive `v-for` without virtualization (10k items)                   | `vue-large-v-for`, `dom-layout-thrashing`                          | < 80           | `vue`               |
| **Vue-02** | Unoptimized `v-for` using inline random style binding                | `vue-large-v-for`                                                  | < 90           | `vue`               |
| **Vue-03** | Deeply nested reactivity inside `v-for` loop                         | `vue-large-v-for`                                                  | < 90           | `vue`               |
| **Vue-04** | Global event listener (`window.addEventListener`) without cleanup    | `memory-event-listener`                                            | < 90           | `vue`               |
| **Vue-05** | Forced synchronous layout: Reading `offsetHeight` then writing style | `dom-layout-thrashing`                                             | < 80           | `vue`               |
| **Vue-06** | Forced synchronous layout in a `watch` effect                        | `dom-layout-thrashing`                                             | < 90           | `vue`               |
| **Vue-07** | Non-primitive object returned from `computed` mapped over `v-for`    | `vue-large-v-for`                                                  | < 90           | `vue`               |
| **Vue-08** | Template accessing global window metrics repeatedly                  | `dom-layout-thrashing`                                             | < 80           | `vue`               |
| **Vue-09** | Mousemove tracking attached to hundreds of DOM nodes                 | `memory-event-listener`, `dom-layout-thrashing`                    | < 70           | `vue`               |
| **Vue-10** | Missing `key` binding on large `v-for`                               | `vue-large-v-for`                                                  | < 90           | `vue`               |
| **Vue-11** | Heavy computation running inside a template expression               | `vue-large-v-for`                                                  | < 95           | `vue`               |
| **Vue-12** | Scroll event listener directly modifying DOM styles                  | `dom-layout-thrashing`, `memory-event-listener`                    | < 70           | `vue`               |
| **Vue-13** | Mutating DOM continuously within a `setInterval`                     | `dom-layout-thrashing`                                             | < 80           | `vue`               |
| **Vue-14** | `resize` event listener reading `clientWidth` in a loop              | `dom-layout-thrashing`, `memory-event-listener`                    | < 70           | `vue`               |
| **Vue-15** | Using `v-if` alongside `v-for` on a huge list                        | `vue-large-v-for`                                                  | < 90           | `vue`               |
| **Vue-16** | Un-debounced input updating a reactive 5000-element array            | `vue-large-v-for`                                                  | < 85           | `vue`               |
| **Vue-17** | Retaining detached DOM nodes in a reactive variable                  | `memory-event-listener`                                            | < 95           | `vue`               |
| **Vue-18** | Registering `IntersectionObserver` in a `v-for` loop                 | `memory-event-listener`                                            | < 90           | `vue`               |
| **Vue-19** | Calling `getBoundingClientRect` on multiple refs during render       | `dom-layout-thrashing`                                             | < 80           | `vue`               |
| **Vue-20** | Mixed anti-patterns: `v-for`, missing cleanup, layout thrashing      | `vue-large-v-for`, `dom-layout-thrashing`, `memory-event-listener` | < 60           | `vue`               |

## React Test Cases (20)

| ID           | Purpose                                                              | Expected Violations                                                | Expected Score | Framework Detection |
| ------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------- | ------------------- |
| **React-01** | Massive `Array.map` without virtualization (10k items)               | `react-large-map`                                                  | < 90           | `react`             |
| **React-02** | `Array.map` rendering expensive nested components                    | `react-large-map`                                                  | < 90           | `react`             |
| **React-03** | `useEffect` adding window listeners without return cleanup           | `memory-event-listener`                                            | < 90           | `react`             |
| **React-04** | Reading `clientHeight` and writing to state in `useLayoutEffect`     | `dom-layout-thrashing`                                             | < 80           | `react`             |
| **React-05** | Missing `key` prop in a deeply nested large map                      | `react-large-map`                                                  | < 90           | `react`             |
| **React-06** | Scroll event attached to a mapped list without throttling            | `react-large-map`, `memory-event-listener`                         | < 80           | `react`             |
| **React-07** | Anonymous functions passed to large map children                     | `react-large-map`                                                  | < 95           | `react`             |
| **React-08** | Reading DOM geometry inside a tight loop                             | `dom-layout-thrashing`                                             | < 70           | `react`             |
| **React-09** | Fetching and parsing huge JSON directly into a map                   | `react-large-map`                                                  | < 90           | `react`             |
| **React-10** | `window.addEventListener` in `useEffect` firing layout reads         | `memory-event-listener`, `dom-layout-thrashing`                    | < 75           | `react`             |
| **React-11** | Modifying `style` attribute via refs in a requestAnimationFrame loop | `dom-layout-thrashing`                                             | < 85           | `react`             |
| **React-12** | Inline object creation passed to 10k mapped children                 | `react-large-map`                                                  | < 90           | `react`             |
| **React-13** | Setting state on scroll without debouncing                           | `dom-layout-thrashing`                                             | < 85           | `react`             |
| **React-14** | Heavy array filtering performed on every render cycle                | `react-large-map`                                                  | < 95           | `react`             |
| **React-15** | Memory leak: Storing intervals in refs without clearing              | `memory-event-listener`                                            | < 90           | `react`             |
| **React-16** | Layout thrashing by alternating read/write of DOM node dimensions    | `dom-layout-thrashing`                                             | < 70           | `react`             |
| **React-17** | Render-phase side effects generating elements                        | `react-large-map`                                                  | < 95           | `react`             |
| **React-18** | Uncleaned `IntersectionObserver` in component unmount                | `memory-event-listener`                                            | < 90           | `react`             |
| **React-19** | Thousands of context consumers in a single mapped list               | `react-large-map`                                                  | < 90           | `react`             |
| **React-20** | Mixed anti-patterns: Huge maps, bad cleanup, forced layout           | `react-large-map`, `dom-layout-thrashing`, `memory-event-listener` | < 60           | `react`             |

## Intentionally Malformed Files (10)

| ID         | Purpose                                                    | Expected Violations      | Expected Score | Framework Detection         |
| ---------- | ---------------------------------------------------------- | ------------------------ | -------------- | --------------------------- |
| **Err-01** | Syntax Error: Unterminated string constant                 | None (Graceful Fallback) | 100 (Default)  | `react` or `vue`            |
| **Err-02** | Syntax Error: Missing closing `</template>` tag            | None (Graceful Fallback) | 100 (Default)  | `vue`                       |
| **Err-03** | Syntax Error: Invalid JSX nesting (`<div></span>`)         | None (Graceful Fallback) | 100 (Default)  | `react`                     |
| **Err-04** | Invalid JS: Extra closing brace `}`                        | None (Graceful Fallback) | 100 (Default)  | `vanilla`                   |
| **Err-05** | Garbled Text: Non-code text string (e.g., "lorem ipsum")   | None (Graceful Fallback) | 100 (Default)  | `vanilla`                   |
| **Err-06** | Empty string passed as sourceCode                          | None                     | 100            | `vanilla`                   |
| **Err-07** | Partial code: `export const Test = () => { Array.from(`    | None (Graceful Fallback) | 100 (Default)  | `vanilla`                   |
| **Err-08** | Vue SFC with script but missing template entirely          | None                     | 100            | `vue`                       |
| **Err-09** | React component with invalid import syntax (`imprt React`) | None (Graceful Fallback) | 100 (Default)  | `react` (if keywords match) |
| **Err-10** | TypeScript code with invalid generics `<T <<>`             | None (Graceful Fallback) | 100 (Default)  | `vanilla`                   |

## Expected Clean Files (10)

| ID           | Purpose                                                        | Expected Violations | Expected Score | Framework Detection  |
| ------------ | -------------------------------------------------------------- | ------------------- | -------------- | -------------------- |
| **Clean-01** | Standard React Button component (stateless)                    | None                | 100            | `react`              |
| **Clean-02** | Small Vue layout wrapper (`<slot />`)                          | None                | 100            | `vue`                |
| **Clean-03** | Properly virtualized React list using `react-window`           | None                | 100            | `react`              |
| **Clean-04** | Properly virtualized Vue list using `@vueuse/core`             | None                | 100            | `vue`                |
| **Clean-05** | React component with debounced scroll event and proper cleanup | None                | 100            | `react`              |
| **Clean-06** | Vue component with safely handled DOM ref geometries           | None                | 100            | `vue`                |
| **Clean-07** | Standard Vanilla JS Utility (math functions)                   | None                | 100            | `vanilla`            |
| **Clean-08** | Basic React Context Provider without heavy state               | None                | 100            | `react`              |
| **Clean-09** | Vue Pinia store export file                                    | None                | 100            | `vue`                |
| **Clean-10** | Minimal layout component utilizing native CSS Grid             | None                | 100            | `vanilla` or `react` |
