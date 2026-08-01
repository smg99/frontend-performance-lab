import type { Section } from '@schemas/index'

export const examples: Section[] = [
  {
    id: 'common-mistake',
    title: 'Layout Thrashing',
    type: 'example',
    order: 1,
    content: {
      goodCode: `// ✅ Read first, then write
const width = el.offsetWidth
requestAnimationFrame(() => {
  el.style.width = width + 10 + 'px'
})`,
      badCode: `// ❌ Interleaving reads and writes
el.style.width = '10px'
const w1 = el.offsetWidth // Forces layout recalculation
el.style.width = '20px'
const w2 = el.offsetWidth // Forces layout recalculation again!`,
      explanation: 'When you ask the browser for a geometric property (offsetWidth, clientHeight) immediately after mutating the DOM, the browser is forced to pause JavaScript execution and synchronously calculate the layout.'
    }
  }
]
