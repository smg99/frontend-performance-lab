<template>
  <div
    class="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background-base"
    @drop.prevent="onDrop"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
    @mousemove="handleDrag"
    @mouseup="stopDrag"
    @mouseleave="stopDrag"
  >
    <!-- Drag Overlay -->
    <div
      v-if="isDragging"
      class="absolute inset-0 z-50 bg-primary/10 border-4 border-dashed border-primary backdrop-blur-sm flex items-center justify-center"
    >
      <div class="text-2xl font-bold text-primary flex items-center gap-3">
        <UploadIcon class="w-8 h-8" /> Drop files or folders to analyze
      </div>
    </div>

    <!-- Sidebar: File Tree -->
    <div
      class="flex-shrink-0 border-r border-border-subtle bg-background-surface flex flex-col relative"
      :style="{ width: leftPaneWidth + 'px' }"
    >
      <div class="p-4 border-b border-border-subtle flex justify-between items-center bg-background-surface sticky top-0 z-10">
        <h3 class="font-semibold text-text-primary text-sm uppercase tracking-wider">Explorer</h3>
        <button class="text-text-secondary hover:text-primary transition-colors p-1" title="New File" @click="addFile">
          <PlusIcon class="w-4 h-4" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-2 space-y-1">
        <button
          v-for="(file, index) in files"
          :key="index"
          class="w-full text-left px-3 py-1.5 rounded text-sm flex items-center gap-2 group transition-colors"
          :class="activeIndex === index ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:bg-background-base hover:text-text-primary'"
          @click="activeIndex = index"
        >
          <FileCodeIcon class="w-4 h-4 opacity-70 flex-shrink-0" />
          <span class="flex-1 truncate">{{ file.filename }}</span>
          <button class="opacity-0 group-hover:opacity-100 hover:text-error transition-opacity flex-shrink-0" @click.stop="removeFile(index)">
            <XIcon class="w-3 h-3" />
          </button>
        </button>

        <div v-if="files.length === 0" class="p-4 text-center text-text-muted text-sm border border-dashed border-border-subtle rounded m-2">
          Drag & drop files here or click + to start.
        </div>
      </div>

      <div class="p-4 border-t border-border-subtle space-y-2 bg-background-surface sticky bottom-0 z-10">
        <Button class="w-full" :disabled="isAnalyzing || files.length === 0" @click="runAnalysis('workspace')">
          <PlayIcon class="w-4 h-4 mr-2" /> Analyze All
        </Button>
      </div>
    </div>

    <!-- Left Resizer -->
    <div class="w-1 hover:bg-primary cursor-col-resize z-20 flex-shrink-0 transition-colors bg-border-subtle" @mousedown.prevent="startDrag('left')"></div>

    <!-- Middle Pane: Editor -->
    <div class="flex-1 flex flex-col min-w-[300px]">
      <div class="flex border-b border-border-subtle bg-background-surface overflow-x-auto hide-scrollbar">
        <button
          v-for="(file, index) in files"
          :key="`tab-${index}`"
          class="px-4 py-2 text-sm border-r border-border-subtle flex items-center gap-2 transition-colors min-w-[120px]"
          :class="activeIndex === index ? 'bg-background-base text-primary border-t-2 border-t-primary font-medium' : 'text-text-secondary hover:bg-background-base border-t-2 border-t-transparent'"
          @click="activeIndex = index"
        >
          <span class="truncate max-w-[150px]">{{ file.filename }}</span>
          <button class="hover:bg-border-subtle rounded-full p-0.5 ml-auto" @click.stop="removeFile(index)">
            <XIcon class="w-3 h-3" />
          </button>
        </button>
      </div>
      <div class="flex-1 relative bg-background-base">
        <div v-if="files.length > 0 && activeFile" class="absolute inset-0">
          <CodeEditor v-model="activeFile.code" v-model:language="activeFile.language" @analyze="handleAnalyzeShortcut" />
        </div>
        <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-foreground-muted bg-background-surface/30">
          <div class="max-w-md w-full text-center space-y-6 p-8">
            <div class="w-16 h-16 rounded-2xl bg-background-base border border-border-strong flex items-center justify-center mx-auto shadow-sm">
              <CodeIcon class="w-8 h-8 text-primary opacity-80" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-foreground-primary tracking-tight mb-2">Analyzer Workspace</h3>
              <p class="text-sm leading-relaxed">
                Paste your code, drag a folder, or load a sample snippet to see the AST engine instantly identify performance bottlenecks.
              </p>
            </div>
            
            <div class="grid grid-cols-2 gap-4 pt-4">
              <button
                class="flex flex-col items-start p-4 rounded-xl border border-border-subtle bg-background-base hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:-translate-y-[1px] transition-all duration-220 text-left group"
                @click="loadSample('react')"
              >
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span class="text-sm font-semibold text-foreground-primary group-hover:text-emerald-500 transition-colors">React</span>
                </div>
                <span class="text-xs text-foreground-muted line-clamp-2">Layout thrashing & render loops</span>
              </button>
              
              <button
                class="flex flex-col items-start p-4 rounded-xl border border-border-subtle bg-background-base hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:-translate-y-[1px] transition-all duration-220 text-left group"
                @click="loadSample('vue')"
              >
                <div class="flex items-center gap-2 mb-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span class="text-sm font-semibold text-foreground-primary group-hover:text-emerald-500 transition-colors">Vue 3</span>
                </div>
                <span class="text-xs text-foreground-muted line-clamp-2">Reactivity loss & excessive watchers</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Resizer -->
    <div class="w-1 hover:bg-primary cursor-col-resize z-20 flex-shrink-0 transition-colors bg-border-subtle" @mousedown.prevent="startDrag('right')"></div>

    <!-- Right Pane: Review -->
    <div
      class="flex-shrink-0 border-l border-border-subtle bg-background-surface relative flex flex-col"
      :style="{ width: rightPaneWidth + 'px' }"
    >
      <AnalyzerTimeline v-if="timelineState !== 'idle'" :state="timelineState" />
      <ReviewPanel :report="report" class="flex-1 overflow-y-auto" />

      <!-- Loading Overlay -->
      <div v-if="isAnalyzing" class="absolute inset-0 bg-background-surface/80 backdrop-blur flex items-center justify-center z-10">
        <div class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-xl flex flex-col items-center max-w-[80%] text-center">
          <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <span class="text-text-primary font-bold mb-2">Analyzing...</span>
          <p class="text-sm text-text-secondary">Running framework-agnostic checks on {{ analyzedFileCount }} file(s).</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { PlusIcon, XIcon, FileCodeIcon, PlayIcon, UploadIcon, CodeIcon } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'
import CodeEditor from './CodeEditor.vue'
import ReviewPanel from './ReviewPanel.vue'
import AnalyzerTimeline from './AnalyzerTimeline.vue'
import type { ReviewReport } from '@schemas/analyzer'

interface WorkspaceFile {
  filename: string
  code: string
  language: string
}

const files = ref<WorkspaceFile[]>([
  {
    filename: 'App.vue',
    language: 'vue',
    code: '<template>\n  <div v-for="item in 10000" :key="item.id">\n    {{ item.name }}\n  </div>\n</template>'
  }
])
const activeIndex = ref(0)
const activeFile = computed(() => files.value[activeIndex.value])

const isDragging = ref(false)
const isAnalyzing = ref(false)
const timelineState = ref<'idle' | 'parsing' | 'ast' | 'rules' | 'done'>('idle')
const report = ref<ReviewReport | null>(null)
const analyzedFileCount = ref(0)

// Resizable Panes Logic
const leftPaneWidth = ref(256)
const rightPaneWidth = ref(450)
const draggingPane = ref<'left' | 'right' | null>(null)

const startDrag = (pane: 'left' | 'right') => {
  draggingPane.value = pane
  document.body.style.cursor = 'col-resize'
}

const handleDrag = (e: MouseEvent) => {
  if (!draggingPane.value) return
  if (draggingPane.value === 'left') {
    leftPaneWidth.value = Math.max(200, Math.min(e.clientX, 600))
  } else if (draggingPane.value === 'right') {
    const newWidth = window.innerWidth - e.clientX
    rightPaneWidth.value = Math.max(300, Math.min(newWidth, 800))
  }
}

const stopDrag = () => {
  if (draggingPane.value) {
    draggingPane.value = null
    document.body.style.cursor = ''
    localStorage.setItem('analyzer-left-pane', leftPaneWidth.value.toString())
    localStorage.setItem('analyzer-right-pane', rightPaneWidth.value.toString())
  }
}

const addFile = () => {
  const num = files.value.length + 1
  files.value.push({ filename: `Component${num}.vue`, language: 'vue', code: '' })
  activeIndex.value = files.value.length - 1
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
  if (activeIndex.value >= files.value.length) {
    activeIndex.value = Math.max(0, files.value.length - 1)
  }
}

const onDrop = async (e: DragEvent) => {
  isDragging.value = false
  if (!e.dataTransfer?.items) return

  // Simplified folder reading using webkitGetAsEntry (works in most modern browsers for drops)
  const items = Array.from(e.dataTransfer.items)
  for (const item of items) {
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry()
      if (entry) await processEntry(entry)
    }
  }
  activeIndex.value = Math.max(0, files.value.length - 1)
}

interface FileSystemEntry {
  isFile: boolean
  isDirectory: boolean
  name: string
  file: (cb: (f: File) => void) => void
  createReader: () => { readEntries: (cb: (results: FileSystemEntry[]) => void) => void }
}

const processEntry = async (entry: unknown, path = '') => {
  const e = entry as FileSystemEntry
  if (e.isFile) {
    e.file(async (f: File) => {
      const text = await f.text()
      const ext = f.name.split('.').pop() || 'js'
      let lang = 'javascript'
      if (['vue', 'jsx', 'tsx', 'ts', 'html', 'css'].includes(ext)) lang = ext
      files.value.push({ filename: path + f.name, code: text, language: lang })
    })
  } else if (e.isDirectory) {
    const reader = e.createReader()
    const entries = await new Promise<unknown[]>((resolve) => {
      reader.readEntries((results: unknown[]) => resolve(results))
    })
    for (const child of entries) {
      await processEntry(child, path + e.name + '/')
    }
  }
}

const handleAnalyzeShortcut = () => {
  runAnalysis('workspace')
}

const loadSample = (type: 'react' | 'vue') => {
  if (type === 'react') {
    files.value = [{
      filename: 'Dashboard.tsx',
      language: 'tsx',
      code: "import React, { useState, useEffect, useRef } from 'react';\n\nexport default function Dashboard() {\n  const [width, setWidth] = useState(0);\n  const boxRef = useRef<HTMLDivElement>(null);\n\n  // BAD: Layout Thrashing\n  useEffect(() => {\n    const handleScroll = () => {\n      if (boxRef.current) {\n        // Forces synchronous layout calculation\n        const currentWidth = boxRef.current.getBoundingClientRect().width;\n        setWidth(currentWidth + 10);\n      }\n    };\n    window.addEventListener('scroll', handleScroll);\n    return () => window.removeEventListener('scroll', handleScroll);\n  }, []);\n\n  return (\n    <div ref={boxRef} style={{ width: width + 'px' }}>\n      Dashboard Content\n    </div>\n  );\n}"
    }]
  } else {
    files.value = [{
      filename: 'DataGrid.vue',
      language: 'vue',
      code: "<" + "script setup>\nimport { ref, watch, onMounted } from 'vue'\n\nconst items = ref([])\nconst total = ref(0)\n\n// BAD: Deep watcher on a massive array\nwatch(items, (newVal) => {\n  total.value = newVal.reduce((acc, item) => acc + item.value, 0)\n}, { deep: true })\n\nonMounted(async () => {\n  // Fetching 10,000 items and making them fully reactive\n  const res = await fetch('/api/data')\n  items.value = await res.json()\n})\n<" + "/script>\n\n<" + "template>\n  <div v-for=\"item in items\" :key=\"item.id\">\n    {{ item.name }}\n  </div>\n<" + "/template>"
    }]
  }
  activeIndex.value = 0
  setTimeout(() => runAnalysis('workspace'), 500)
}

onMounted(() => {
  const savedLeft = localStorage.getItem('analyzer-left-pane')
  const savedRight = localStorage.getItem('analyzer-right-pane')
  if (savedLeft) leftPaneWidth.value = parseInt(savedLeft, 10)
  if (savedRight) rightPaneWidth.value = parseInt(savedRight, 10)
})

const runAnalysis = async (mode: 'current' | 'workspace') => {
  const targetFiles = mode === 'current' ? (activeFile.value ? [activeFile.value] : []) : files.value
  if (targetFiles.length === 0) return

  isAnalyzing.value = true
  analyzedFileCount.value = targetFiles.length
  timelineState.value = 'parsing'
  report.value = null

  try {
    await new Promise(r => setTimeout(r, 400))
    timelineState.value = 'ast'
    await new Promise(r => setTimeout(r, 400))
    timelineState.value = 'rules'

    const response = await $fetch('/api/analyze', {
      method: 'POST',
      body: {
        files: targetFiles.map(f => ({
          filename: f.filename,
          code: f.code,
          language: f.language,
          framework: f.language === 'vue' ? 'vue' : 'react'
        }))
      }
    })

    if (response.error) {
      alert(response.error)
      timelineState.value = 'idle'
    } else {
      timelineState.value = 'done'
      report.value = response as ReviewReport
    }
  } catch (err) {
    console.error(err)
    alert('Failed to analyze code.')
    timelineState.value = 'idle'
  } finally {
    isAnalyzing.value = false
  }
}
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
