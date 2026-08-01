<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-6">
    <!-- Controls -->
    <div class="flex items-center gap-4 bg-surface p-4 rounded-lg border border-border">
      <div class="flex-1">
        <h4 class="text-sm font-semibold text-text-primary mb-1">Trigger Reactivity Updates</h4>
        <p class="text-xs text-text-secondary">Click any state node (Ref/Reactive) below to simulate Vue's dependency triggering process.</p>
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1.5 bg-background border border-border rounded text-sm transition-colors text-text-secondary hover:text-text-primary" @click="resetZoom">
          Reset View
        </button>
      </div>
    </div>

    <!-- SVG Container with Pan & Zoom -->
    <div 
      class="w-full h-[500px] bg-background border border-border rounded-xl overflow-hidden relative select-none cursor-grab active:cursor-grabbing"
      @mousedown="startPan"
      @mousemove="doPan"
      @mouseup="endPan"
      @mouseleave="endPan"
      @wheel.prevent="doZoom"
    >
      <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <!-- Definitions for markers and animations -->
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
          </marker>
          <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
          </marker>
        </defs>

        <g :transform="`translate(${panX}, ${panY}) scale(${zoom})`">
          
          <!-- Edges -->
          <path 
            v-for="edge in edges" 
            :key="`${edge.from}-${edge.to}`"
            :d="calculatePath(edge)"
            :stroke="isActiveEdge(edge) ? '#3B82F6' : '#374151'"
            :stroke-width="isActiveEdge(edge) ? 3 : 2"
            fill="none"
            :marker-end="isActiveEdge(edge) ? 'url(#arrowhead-active)' : 'url(#arrowhead)'"
            class="transition-all duration-300"
            :stroke-dasharray="isActiveEdge(edge) ? '0' : '4,4'"
          />

          <!-- Animated Pulses on Active Edges -->
          <circle 
            v-for="edge in activeEdges" 
            :key="`pulse-${edge.from}-${edge.to}`"
            r="4" 
            fill="#60A5FA"
          >
            <animateMotion 
              :path="calculatePath(edge)"
              dur="0.6s" 
              repeatCount="1"
            />
          </circle>

          <!-- Nodes -->
          <g 
            v-for="node in nodes" 
            :key="node.id"
            :transform="`translate(${node.x}, ${node.y})`"
            class="cursor-pointer"
            @mouseenter="hoverNode(node.id)"
            @mouseleave="unhoverNode()"
            @click.stop="triggerNode(node.id)"
          >
            <!-- Node Background with Glow if Active -->
            <rect 
              :x="-node.width/2" 
              :y="-node.height/2" 
              :width="node.width" 
              :height="node.height" 
              rx="8"
              :fill="getNodeColor(node)"
              :stroke="activeNodeId === node.id ? '#60A5FA' : hoveredNodeId === node.id ? '#9CA3AF' : '#374151'"
              :stroke-width="activeNodeId === node.id ? 2 : 1"
              class="transition-all duration-300 shadow-xl"
              :style="activeNodeId === node.id ? 'filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));' : ''"
            />
            
            <!-- Icon / Type -->
            <text :y="-node.height/2 + 20" text-anchor="middle" font-size="10" font-weight="bold" :fill="getTypeColor(node.type)" class="font-mono">
              {{ node.type }}
            </text>
            
            <!-- Label -->
            <text :y="5" text-anchor="middle" font-size="14" fill="#FAFAFA" font-weight="500">
              {{ node.label }}
            </text>

            <!-- Execution Counter -->
            <g v-if="node.executions > 0" transform="translate(0, 25)">
              <rect x="-15" y="-10" width="30" height="16" rx="8" fill="#1F2937" stroke="#374151" stroke-width="1"/>
              <text y="2" text-anchor="middle" font-size="10" fill="#9CA3AF" font-weight="bold" font-family="monospace">
                {{ node.executions }}
              </text>
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

defineProps<{ advanced?: boolean }>()

// Zoom & Pan State
const zoom = ref(1)
const panX = ref(0) // Will center on mount if we had a mounted hook
const panY = ref(0)
const isDragging = ref(false)
const lastX = ref(0)
const lastY = ref(0)

const startPan = (e: MouseEvent) => {
  isDragging.value = true
  lastX.value = e.clientX
  lastY.value = e.clientY
}

const doPan = (e: MouseEvent) => {
  if (!isDragging.value) return
  panX.value += e.clientX - lastX.value
  panY.value += e.clientY - lastY.value
  lastX.value = e.clientX
  lastY.value = e.clientY
}

const endPan = () => {
  isDragging.value = false
}

const doZoom = (e: WheelEvent) => {
  const zoomSpeed = 0.05
  if (e.deltaY < 0) {
    zoom.value = Math.min(zoom.value + zoomSpeed, 2)
  } else {
    zoom.value = Math.max(zoom.value - zoomSpeed, 0.5)
  }
}

const resetZoom = () => {
  zoom.value = 1
  panX.value = 50 // roughly center
  panY.value = 20
}

// Graph Data Structure
type NodeType = 'Ref' | 'Reactive' | 'Computed' | 'Watch' | 'WatchEffect' | 'Render'

interface Node {
  id: string
  label: string
  type: NodeType
  x: number
  y: number
  width: number
  height: number
  executions: number
}

interface Edge {
  from: string
  to: string
}

const nodes = ref<Node[]>([
  // Layer 1: State
  { id: 'user', label: 'userProfile', type: 'Reactive', x: 200, y: 100, width: 140, height: 70, executions: 0 },
  { id: 'search', label: 'searchQuery', type: 'Ref', x: 400, y: 100, width: 140, height: 70, executions: 0 },
  { id: 'theme', label: 'themeMode', type: 'Ref', x: 600, y: 100, width: 140, height: 70, executions: 0 },
  
  // Layer 2: Derived
  { id: 'fullName', label: 'fullName', type: 'Computed', x: 150, y: 250, width: 140, height: 70, executions: 0 },
  { id: 'filtered', label: 'filteredItems', type: 'Computed', x: 300, y: 250, width: 140, height: 70, executions: 0 },
  { id: 'darkCss', label: 'darkClass', type: 'Computed', x: 600, y: 250, width: 140, height: 70, executions: 0 },
  
  // Layer 3: Effects
  { id: 'logger', label: 'Log Analytics', type: 'Watch', x: 200, y: 400, width: 140, height: 70, executions: 0 },
  { id: 'ui', label: 'UserProfile.vue', type: 'Render', x: 400, y: 400, width: 140, height: 70, executions: 0 },
  { id: 'storage', label: 'Sync LocalStorage', type: 'WatchEffect', x: 600, y: 400, width: 140, height: 70, executions: 0 }
])

const edges = ref<Edge[]>([
  { from: 'user', to: 'fullName' },
  { from: 'user', to: 'filtered' },
  { from: 'search', to: 'filtered' },
  { from: 'theme', to: 'darkCss' },
  
  { from: 'fullName', to: 'ui' },
  { from: 'filtered', to: 'ui' },
  { from: 'search', to: 'logger' },
  { from: 'theme', to: 'storage' },
  { from: 'user', to: 'storage' }
])

// Interaction State
const hoveredNodeId = ref<string | null>(null)
const activeNodeId = ref<string | null>(null)
const activeEdgesList = ref<Edge[]>([])

const hoverNode = (id: string) => hoveredNodeId.value = id
const unhoverNode = () => hoveredNodeId.value = null

const getNodeColor = (_node: Node) => {
  return '#111827' // Surface color roughly
}

const getTypeColor = (type: NodeType) => {
  switch (type) {
    case 'Ref': return '#3B82F6' // Primary
    case 'Reactive': return '#10B981' // Success
    case 'Computed': return '#F59E0B' // Warning
    case 'Watch': return '#8B5CF6' // Purple
    case 'WatchEffect': return '#EC4899' // Pink
    case 'Render': return '#EF4444' // Danger
    default: return '#9CA3AF'
  }
}

// Draw curved paths for edges
const calculatePath = (edge: Edge) => {
  const fromNode = nodes.value.find(n => n.id === edge.from)
  const toNode = nodes.value.find(n => n.id === edge.to)
  if (!fromNode || !toNode) return ''
  
  const startX = fromNode.x
  const startY = fromNode.y + fromNode.height / 2
  const endX = toNode.x
  const endY = toNode.y - toNode.height / 2
  
  const controlY = startY + (endY - startY) / 2
  
  return `M ${startX} ${startY} C ${startX} ${controlY}, ${endX} ${controlY}, ${endX} ${endY}`
}

const isActiveEdge = (edge: Edge) => {
  return activeEdgesList.value.some(e => e.from === edge.from && e.to === edge.to)
}

const activeEdges = computed(() => activeEdgesList.value)

// Reactivity Simulation Engine
const triggerNode = (startId: string) => {
  const startNode = nodes.value.find(n => n.id === startId)
  if (!startNode || (startNode.type !== 'Ref' && startNode.type !== 'Reactive')) return
  
  activeNodeId.value = startId
  activeEdgesList.value = []
  
  // Find all dependent paths via BFS/DFS simulation
  const queue = [{ id: startId, delay: 0 }]
  
  const processQueue = () => {
    if (queue.length === 0) {
      setTimeout(() => {
        activeNodeId.value = null
        activeEdgesList.value = []
      }, 1000)
      return
    }
    
    const { id } = queue.shift()!
    const node = nodes.value.find(n => n.id === id)
    if (node) node.executions++
    
    // Find outgoing edges
    const outgoing = edges.value.filter(e => e.from === id)
    outgoing.forEach(edge => {
      activeEdgesList.value.push(edge)
      queue.push({ id: edge.to, delay: 0 })
    })
    
    // Simulate propagation delay
    setTimeout(processQueue, 300)
  }
  
  processQueue()
}
</script>

<style scoped>
/* Optional SVG specific overrides */
</style>
