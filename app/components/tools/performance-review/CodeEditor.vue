<template>
  <div class="h-full flex flex-col bg-background-surface border-r border-border-subtle relative">
    <div
      class="p-2 border-b border-border-subtle flex justify-between items-center bg-background-base text-sm"
    >
      <div class="flex items-center gap-2">
        <select
          v-model="localLang"
          class="bg-background-surface text-foreground-primary border border-border-subtle rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
        >
          <option value="vue">Vue</option>
          <option value="js">JavaScript</option>
          <option value="ts">TypeScript</option>
          <option value="jsx">React (JSX)</option>
          <option value="tsx">React (TSX)</option>
        </select>
        <button
          class="text-xs px-2 py-1 rounded text-foreground-muted hover:text-foreground-primary transition-colors border border-transparent hover:border-border-subtle"
          @click="toggleMinimap"
          title="Toggle Minimap"
        >
          Minimap: {{ showMinimap ? 'On' : 'Off' }}
        </button>
      </div>
      <button
        class="bg-primary text-primary-foreground px-3 py-1 rounded hover:opacity-90 transition-opacity font-medium flex items-center gap-2"
        @click="$emit('analyze', { code: localCode, language: localLang })"
        title="Cmd/Ctrl + Enter"
      >
        <span>Analyze</span>
        <span class="opacity-70 text-xs hidden sm:inline">⌘↵</span>
      </button>
    </div>
    <div class="flex-1 relative w-full h-full" @keydown="handleKeydown">
      <ClientOnly>
        <VueMonacoEditor
          v-model:value="localCode"
          :language="monacoLang"
          :theme="monacoTheme"
          :options="editorOptions"
          @mount="handleMount"
        />
        <template #fallback>
          <div
            class="w-full h-full flex items-center justify-center text-foreground-muted bg-background-surface"
          >
            Loading editor...
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { VueMonacoEditor } from '@guolao/vue-monaco-editor'

const props = defineProps<{ modelValue: string; language: string }>()
const emit = defineEmits(['update:modelValue', 'update:language', 'analyze'])

const localCode = ref(props.modelValue)
const localLang = ref(props.language)
const showMinimap = ref(false)
const monacoTheme = ref('vs-dark') // Will be updated if a light theme exists

const monacoLang = computed(() => {
  switch (localLang.value) {
    case 'vue':
      return 'html'
    case 'js':
      return 'javascript'
    case 'ts':
      return 'typescript'
    case 'jsx':
      return 'javascript'
    case 'tsx':
      return 'typescript'
    case 'html':
      return 'html'
    case 'css':
      return 'css'
    default:
      return 'javascript'
  }
})

const editorOptions = computed(() => ({
  minimap: { enabled: showMinimap.value },
  lineNumbers: 'on',
  folding: true,
  automaticLayout: true,
  wordWrap: 'on',
  scrollBeyondLastLine: false,
  fontSize: 14,
  fontFamily: 'Geist Mono, monospace',
  padding: { top: 16 }
}))

watch(localCode, v => emit('update:modelValue', v))
watch(localLang, v => emit('update:language', v))
watch(
  () => props.modelValue,
  v => {
    if (v !== localCode.value) localCode.value = v
  }
)
watch(
  () => props.language,
  v => {
    if (v !== localLang.value) localLang.value = v
  }
)

const toggleMinimap = () => {
  showMinimap.value = !showMinimap.value
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault()
    emit('analyze', { code: localCode.value, language: localLang.value })
  }
}

const handleMount = () => {
  // Setup theme tracking here if the app uses color-scheme
  if (typeof window !== 'undefined') {
    const isDark =
      document.documentElement.classList.contains('dark') ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    monacoTheme.value = isDark ? 'vs-dark' : 'vs'

    // Listen for theme changes
    const observer = new MutationObserver(() => {
      monacoTheme.value = document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs'
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  }
}
</script>
