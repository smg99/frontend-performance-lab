<template>
  <div
    class="bg-background-surface border border-border-subtle-subtle rounded-xl overflow-hidden flex flex-col md:flex-row shadow-sm"
  >
    <!-- Left: Configuration -->
    <div
      class="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-border-subtle-subtle bg-background-base p-4 flex flex-col gap-4"
    >
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-foreground-primary">Select Tool</label>
        <select
          v-model="selectedTool"
          class="w-full bg-background-surface border border-border-subtle-strong rounded-md px-3 py-2 text-sm text-foreground-primary focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option v-for="tool in tools" :key="tool.id" :value="tool.name">{{ tool.name }}</option>
        </select>
      </div>

      <div class="flex flex-col gap-2 flex-1">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-foreground-primary">Arguments (JSON)</label>
          <button class="text-xs text-primary hover:underline" @click="formatJson">Format</button>
        </div>

        <div class="flex flex-wrap gap-2 mb-2">
          <button
            v-for="example in examples"
            :key="example.label"
            class="text-[10px] px-2 py-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors border border-primary/20"
            @click="loadExample(example)"
          >
            {{ example.label }}
          </button>
        </div>
        <textarea
          v-model="inputJson"
          class="w-full flex-1 min-h-[150px] bg-background-surface border border-border-subtle-strong rounded-md p-3 text-xs font-mono text-foreground-primary resize-y focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="{}"
        />
        <p v-if="jsonError" class="text-xs text-error mt-1">{{ jsonError }}</p>
      </div>

      <button
        :disabled="loading"
        class="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary-hover disabled:opacity-50 transition-colors"
        @click="executeTool"
      >
        {{ loading ? 'Executing...' : 'Execute Tool' }}
      </button>
    </div>

    <!-- Right: Output -->
    <div class="w-full md:w-2/3 bg-[#1e1e1e] p-4 flex flex-col min-h-[400px]">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-gray-400">Response</span>
        <div v-if="executionMeta" class="flex gap-3 text-xs text-gray-400">
          <span>Time: {{ executionMeta.time }}ms</span>
          <span>Size: {{ executionMeta.size }}</span>
        </div>
      </div>
      <div class="flex-1 overflow-auto bg-[#1e1e1e]">
        <pre class="text-xs font-mono text-green-400 whitespace-pre-wrap">{{ outputResult }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { mcpTools } from '@registry/mcp-tools'

const tools = mcpTools
const selectedTool = useLocalStorage('mcp-playground-tool', tools[0]?.name || '')
const inputJson = useLocalStorage('mcp-playground-input', '{\n  "id": "virtualization"\n}')
const outputResult = ref('// Output will appear here...')
const jsonError = ref('')
const loading = ref(false)
const executionMeta = ref<{ time: number; size: string } | null>(null)

const formatJson = () => {
  try {
    const parsed = JSON.parse(inputJson.value || '{}')
    inputJson.value = JSON.stringify(parsed, null, 2)
    jsonError.value = ''
  } catch (e: unknown) {
    jsonError.value = 'Invalid JSON: ' + (e instanceof Error ? e.message : String(e))
  }
}

const examples = [
  { label: 'Review Vue Component', tool: 'review_performance', args: { framework: 'vue' } },
  { label: 'Explain ResizeObserver', tool: 'get_browser_api', args: { id: 'resize-observer' } },
  { label: 'Find Layout Thrashing', tool: 'search', args: { query: 'layout thrashing' } },
  { label: 'Recommend Virtualization', tool: 'get_recipe', args: { id: 'virtualization' } },
  {
    label: 'Search requestAnimationFrame',
    tool: 'search',
    args: { query: 'requestAnimationFrame' }
  }
]

const loadExample = async (example: (typeof examples)[0]) => {
  selectedTool.value = example.tool
  inputJson.value = JSON.stringify(example.args, null, 2)
  await nextTick()
  executeTool()
}

watch(selectedTool, () => {
  if (
    selectedTool.value === 'list_experiments' ||
    selectedTool.value === 'list_browser_apis' ||
    selectedTool.value === 'list_recipes' ||
    selectedTool.value === 'system_diagnostics'
  ) {
    inputJson.value = '{}'
  } else if (selectedTool.value === 'get_experiment') {
    inputJson.value = '{\n  "id": "virtualization"\n}'
  } else if (selectedTool.value === 'search') {
    inputJson.value = '{\n  "query": "rendering"\n}'
  }
})

const executeTool = async () => {
  try {
    const parsedArgs = JSON.parse(inputJson.value || '{}')
    jsonError.value = ''
    loading.value = true
    const start = performance.now()

    const response = await fetch('/api/mcp/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tool: selectedTool.value,
        arguments: parsedArgs
      })
    })

    const data = await response.json()
    const end = performance.now()

    if (!response.ok) {
      outputResult.value = JSON.stringify(data, null, 2)
      executionMeta.value = null
      return
    }

    const responseText = JSON.stringify(data, null, 2)
    outputResult.value = responseText

    // Format size
    const bytes = new Blob([responseText]).size
    const sizeStr = bytes > 1024 ? `${(bytes / 1024).toFixed(2)} KB` : `${bytes} B`

    executionMeta.value = {
      time: Math.round(end - start),
      size: sizeStr
    }
  } catch (e: unknown) {
    if (e instanceof SyntaxError) {
      jsonError.value = 'Invalid JSON arguments'
    } else {
      outputResult.value = 'Error: ' + (e instanceof Error ? e.message : String(e))
      executionMeta.value = null
    }
  } finally {
    loading.value = false
  }
}
</script>
