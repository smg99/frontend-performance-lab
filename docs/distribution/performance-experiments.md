# Performance Experiments and Analyzer Rules

The Frontend Performance Lab (FPL) includes an autonomous analyzer engine to catch common frontend performance issues before they hit production. We've recently added several new experiments to enhance our diagnostics.

## Available Diagnostic Rules

### 1. Lazy-Load Image Misses (`lazy-load-image-misses`)

- **Summary**: Flags below-the-fold images missing the `loading="lazy"` attribute.
- **Impact**: Synchronous fetching of all images delays First Contentful Paint (FCP) and uses excess bandwidth.
- **Fix**: Use `loading="lazy"` on `<img>` tags or specialized framework image components.

### 2. CSS `contain` Missing (`css-contain-missing`)

- **Summary**: Flags large wrapper elements lacking the CSS `contain` optimization.
- **Impact**: Without CSS containment, changes deep inside a DOM tree can trigger whole-page layout recalculations.
- **Fix**: Apply `contain: content;` (or similar `layout/style/paint` boundaries) to large static containers.

### 3. Render-Blocking CSS (`blocking-css`)

- **Summary**: Detects `<link rel="stylesheet">` elements without `media="print"` or similar non-blocking patterns.
- **Impact**: Synchronous stylesheets block HTML parsing and rendering, directly delaying FCP and LCP.
- **Fix**: Inline critical CSS in `<head>` and defer non-critical CSS by loading it asynchronously.

### 4. Network Request Batching (`network-batching`)

- **Summary**: Identifies multiple sequential `fetch()` or `axios` calls in a single block.
- **Impact**: Unbatched requests suffer from connection overhead and waterfall timing penalties, increasing Time to Interactive (TTI).
- **Fix**: Batch requests on the backend (e.g. via GraphQL) or use `Promise.all()` to load data concurrently on the client.

### 5. Main-Thread Heavy JS (`heavy-js-onload`)

- **Summary**: Warns when highly nested or extremely long synchronous JavaScript code executes during page load (e.g. inside `useEffect`).
- **Impact**: Heavy JS blocks the main thread, leading to high Total Blocking Time (TBT) and poor Interaction to Next Paint (INP).
- **Fix**: Offload heavy computation to Web Workers or yield execution back to the main thread via `setTimeout` or `scheduler.yield()`.

### 6. Large Reactive State Object (`large-reactive-state-object`)

- **Summary**: Detects when React `useState` or Vue `ref`/`reactive` are initialized with large objects.
- **Impact**: Deep proxying or copying on initialization incurs significant CPU overhead, especially on low-end devices.
- **Fix**: Use shallow reactivity wrappers (`shallowRef`) or avoid storing large immutable data structures in reactive state if mutations aren't needed.
