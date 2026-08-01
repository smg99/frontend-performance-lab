import type { Section } from '@schemas/index'

export const examples: Section[] = [
  {
    id: 'common-mistake',
    title: 'Blocking the main thread',
    type: 'example',
    order: 1,
    content: {
      goodCode: `// ✅ Yields back to the browser periodically
async function processChunked(data) {
  for (let i = 0; i < data.length; i++) {
    processData(data[i])
    if (i % 100 === 0) {
      // Give browser a chance to render
      await new Promise(r => setTimeout(r, 0)) 
    }
  }
}`,
      badCode: `// ❌ Freezes the entire UI until complete
function processAll(data) {
  for (let i = 0; i < data.length; i++) {
    processData(data[i]) // Blocks main thread
  }
}`,
      explanation: 'Synchronous loops over large datasets prevent the browser from rendering frames, handling clicks, or firing animations.'
    }
  }
]
