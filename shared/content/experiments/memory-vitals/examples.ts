import type { Section } from '@schemas/index'

export const examples: Section[] = [
  {
    id: 'common-mistake',
    title: 'Memory Leaks with Event Listeners',
    type: 'example',
    order: 1,
    content: {
      goodCode: `onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  // ✅ Cleanup prevents memory leaks
  window.removeEventListener('resize', handleResize)
})`,
      badCode: `onMounted(() => {
  // ❌ Never cleaned up, holds reference to component forever
  window.addEventListener('resize', () => {
    console.log(this.data) 
  })
})`,
      explanation: 'If a global object (window, document, body) holds a reference to a function declared inside a component, the Garbage Collector can never destroy the component when it unmounts.'
    }
  }
]
