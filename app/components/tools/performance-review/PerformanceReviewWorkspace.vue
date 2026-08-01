<template>
  <div
    class="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background-base"
    @drop.prevent="onDrop"
    @dragover.prevent="isDragging = true"
    @dragleave.prevent="isDragging = false"
  >
    <!-- Drag Overlay -->
    <div
      v-if="isDragging"
      class="absolute inset-0 z-50 bg-primary/10 border-4 border-dashed border-primary backdrop-blur-sm flex items-center justify-center"
    >
      <div class="text-2xl font-bold text-primary flex items-center gap-3">
        <UploadIcon class="w-8 h-8" /> Drop files to analyze
      </div>
    </div>

    <!-- Sidebar: File Tree -->
    <div
      class="w-64 flex-shrink-0 border-r border-border-subtle bg-background-surface flex flex-col"
    >
      <div class="p-4 border-b border-border-subtle flex justify-between items-center">
        <h3 class="font-semibold text-text-primary text-sm uppercase tracking-wider">Workspace</h3>
        <button
          class="text-text-secondary hover:text-primary transition-colors p-1"
          title="New File"
          @click="addFile"
        >
          <PlusIcon class="w-4 h-4" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-2 space-y-1">
        <button
          v-for="(file, index) in files"
          :key="index"
          class="w-full text-left px-3 py-2 rounded text-sm flex items-center gap-2 group transition-colors"
          :class="
            activeIndex === index
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-text-secondary hover:bg-background-base hover:text-text-primary'
          "
          @click="activeIndex = index"
        >
          <FileCodeIcon class="w-4 h-4 opacity-70" />
          <span class="flex-1 truncate">{{ file.filename }}</span>
          <button
            class="opacity-0 group-hover:opacity-100 hover:text-error transition-opacity"
            @click.stop="removeFile(index)"
          >
            <XIcon class="w-3 h-3" />
          </button>
        </button>

        <div
          v-if="files.length === 0"
          class="p-4 text-center text-text-muted text-sm border border-dashed border-border-subtle rounded m-2"
        >
          Drag & drop files here or click + to start.
        </div>
      </div>

      <div class="p-4 border-t border-border-subtle space-y-2">
        <Button
          class="w-full"
          :disabled="isAnalyzing || files.length === 0"
          @click="runAnalysis('workspace')"
        >
          <PlayIcon class="w-4 h-4 mr-2" /> Analyze Workspace
        </Button>
        <Button
          variant="outline"
          class="w-full"
          :disabled="isAnalyzing || files.length === 0"
          @click="runAnalysis('current')"
        >
          Analyze Current File
        </Button>
      </div>
    </div>

    <!-- Middle Pane: Editor -->
    <div class="flex-1 flex flex-col min-w-[400px]">
      <!-- Tabs -->
      <div
        class="flex border-b border-border-subtle bg-background-surface overflow-x-auto hide-scrollbar"
      >
        <button
          v-for="(file, index) in files"
          :key="`tab-${index}`"
          class="px-4 py-2 text-sm border-r border-border-subtle flex items-center gap-2 transition-colors min-w-[120px]"
          :class="
            activeIndex === index
              ? 'bg-background-base text-primary border-b-2 border-b-primary font-medium'
              : 'text-text-secondary hover:bg-background-base/50'
          "
          @click="activeIndex = index"
        >
          <span class="truncate max-w-[150px]">{{ file.filename }}</span>
          <button
            class="hover:bg-border-subtle rounded-full p-0.5 ml-auto"
            @click.stop="removeFile(index)"
          >
            <XIcon class="w-3 h-3" />
          </button>
        </button>
      </div>

      <!-- Editor -->
      <div class="flex-1 relative bg-background-base">
        <div v-if="files.length > 0 && activeFile" class="absolute inset-0">
          <CodeEditor v-model="activeFile.code" v-model:language="activeFile.language" />
        </div>
        <div v-else class="absolute inset-0 flex items-center justify-center text-text-muted">
          <div class="text-center space-y-2">
            <CodeIcon class="w-12 h-12 mx-auto opacity-20" />
            <p>Select or create a file to start editing.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Pane: Review -->
    <div
      class="w-[450px] xl:w-[500px] flex-shrink-0 border-l border-border-subtle bg-background-surface relative flex flex-col"
    >
      <AnalyzerTimeline v-if="timelineState !== 'idle'" :state="timelineState" />
      <ReviewPanel :report="report" class="flex-1" />

      <!-- Loading Overlay -->
      <div
        v-if="isAnalyzing"
        class="absolute inset-0 bg-background-surface/80 backdrop-blur flex items-center justify-center z-10"
      >
        <div
          class="bg-background-base border border-border-subtle p-6 rounded-xl shadow-xl flex flex-col items-center max-w-[80%] text-center"
        >
          <div
            class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"
          />
          <span class="text-text-primary font-bold mb-2">Analyzing AST...</span>
          <p class="text-sm text-text-secondary">
            Running framework-agnostic checks on {{ analyzedFileCount }} file(s).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

const addFile = () => {
  const num = files.value.length + 1
  files.value.push({
    filename: `Component${num}.vue`,
    language: 'vue',
    code: ''
  })
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
  if (!e.dataTransfer?.files) return

  for (const file of Array.from(e.dataTransfer.files)) {
    const text = await file.text()
    const ext = file.name.split('.').pop() || 'js'
    let lang = 'javascript'
    if (['vue', 'jsx', 'tsx', 'ts'].includes(ext)) lang = ext

    files.value.push({
      filename: file.name,
      code: text,
      language: lang
    })
  }
  activeIndex.value = files.value.length - 1
}

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  if (e.metaKey && e.key === 'Enter') {
    e.preventDefault()
    runAnalysis(e.shiftKey ? 'workspace' : 'current')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const runAnalysis = async (mode: 'current' | 'workspace') => {
  const targetFiles =
    mode === 'current' ? (activeFile.value ? [activeFile.value] : []) : files.value
  if (targetFiles.length === 0) return

  isAnalyzing.value = true
  analyzedFileCount.value = targetFiles.length
  timelineState.value = 'parsing'
  report.value = null

  try {
    // Simulate timeline stages for visual UX
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
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
