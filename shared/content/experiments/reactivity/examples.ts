import type { Section } from '@schemas/index'

export const examples: Section[] = [
  {
    id: 'common-mistake-1',
    title: 'Destructuring reactive objects loses reactivity.',
    type: 'example',
    order: 1,
    content: {
      goodCode: `const state = reactive({ count: 0 })
// ✅ Safely destructure while keeping reactivity
const { count } = toRefs(state)`,
      badCode: `const state = reactive({ count: 0 })
// ❌ Destructuring breaks reactivity!
let { count } = state`,
      explanation: 'The UI will not update when the data changes because the primitive value was detached from the proxy. Use `toRefs()` or just use `ref()`.'
    }
  },
  {
    id: 'common-mistake-2',
    title: 'Using watchEffect carelessly.',
    type: 'example',
    order: 2,
    content: {
      goodCode: `// ✅ Only runs when state.id changes
watch(
  () => state.id, 
  (newId) => { console.log(newId) }
)`,
      badCode: `// ❌ Will re-run if ANY property on state changes
watchEffect(() => {
  console.log(state)
})`,
      explanation: 'watchEffect automatically tracks everything it reads synchronously. If you console.log a massive object inside it, it will trigger an update every time ANY property on that object changes.'
    }
  }
]
