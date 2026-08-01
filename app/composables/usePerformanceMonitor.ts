import { ref, onMounted, onUnmounted } from 'vue'

export const usePerformanceMonitor = () => {
  const fps = ref(60)
  const domNodes = ref(0)
  const memory = ref(0)
  
  let animationFrameId: number
  let frameCount = 0
  let lastFpsUpdateTime = performance.now()

  const updateMetrics = () => {
    const now = performance.now()
    frameCount++
    
    // Update FPS once a second for stability
    if (now - lastFpsUpdateTime >= 1000) {
      fps.value = Math.round((frameCount * 1000) / (now - lastFpsUpdateTime))
      frameCount = 0
      lastFpsUpdateTime = now
      
      // Update DOM nodes
      if (import.meta.client) {
        domNodes.value = document.getElementsByTagName('*').length
        
        // Update memory if available (Chrome specific)
        const perf = performance as Performance & { memory?: { usedJSHeapSize: number } }
        if (perf.memory) {
          memory.value = Math.round(perf.memory.usedJSHeapSize / (1024 * 1024))
        } else {
          memory.value = 0 // Unsupported
        }
      }
    }
    
    animationFrameId = requestAnimationFrame(updateMetrics)
  }

  onMounted(() => {
    if (import.meta.client) {
      animationFrameId = requestAnimationFrame(updateMetrics)
    }
  })

  onUnmounted(() => {
    if (import.meta.client && animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  return {
    fps,
    domNodes,
    memory
  }
}
