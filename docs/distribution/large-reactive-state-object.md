# Large Reactive State Object Initialization Rule

## Overview

The **large-reactive-state-object** rule detects when a Vue `ref`/`reactive` or a React `useState` is initialized with a **large object or array literal** (or an imported identifier) that can cause expensive deep‑proxying or copying during application startup.

## Why it matters

- **Performance impact**: Large reactive structures increase Total Blocking Time (TBT) and memory consumption because the reactivity system must walk every nested property.
- **Startup cost**: Deep‑proxying or deep cloning happens synchronously on the main thread, affecting Core Web Vitals.

## Configuration

The rule is now **configurable** via `config/analysis-config.json`:

```json
{
  "largeReactiveStateObject": {
    "maxProperties": 30
  }
}
```

- `maxProperties` – The total number of (nested) properties/elements that are allowed before the rule triggers. The default fallback is `30` if the config cannot be read.

## Rule details

- **Severity**: `Warning` (downgraded from `High`).
- **Confidence**: `Medium` for imported identifiers; `High` for literal objects/arrays that exceed the threshold.
- **Heuristics**:
  - Shallow wrappers (`shallowRef`, `shallowReactive`, `useRef`) are ignored as they are considered safe.
  - Imported identifiers are flagged only when the name does **not** end with `_shallow`.
  - The rule recursively counts nested object properties to catch deeply nested large literals.

## Fix suggestions

- Wrap large immutable data with `shallowRef` / `shallowReactive` (Vue) or `useRef` (React).
- Use `markRaw` for static configuration objects that do not need reactivity.
- Split massive objects into smaller stores or load them lazily.

## Example (Vue)

```ts
// Bad – large literal triggers the rule
export const state = reactive({
  user: {/* 50+ properties */},
  settings: {/* many nested objects */}
})

// Good – shallow wrapper avoids deep proxying
export const state = shallowReactive({
  user: {/* ... */},
  settings: {/* ... */}
})
```

## Example (React)

```tsx
// Bad – large literal passed to useState
const [data, setData] = useState({
  items: Array.from({ length: 100 }, (_, i) => ({ id: i, value: i }))
})

// Good – useRef for immutable large data
const dataRef = useRef({
  items: Array.from({ length: 100 }, (_, i) => ({ id: i, value: i }))
})
```

## Reporting

When the rule fires, the diagnostic includes the line number of the offending literal or identifier and a message directing the developer to the suggested fix.

---

_This documentation was generated to reflect the recent enhancements to the large‑reactive‑state‑object analyzer rule._
