<template>
  <div class="flex h-[calc(100vh-64px)] w-full">
    <!-- Left Pane: Input -->
    <div class="w-1/2 min-w-[400px]">
      <CodeEditor 
        v-model="code" 
        v-model:language="language" 
        @analyze="runAnalysis"
      />
    </div>

    <!-- Right Pane: Output -->
    <div class="w-1/2 border-l border-border bg-card">
      <ReviewPanel :report="report" />
      
      <!-- Loading Overlay -->
      <div v-if="isAnalyzing" class="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
        <div class="bg-card border border-border p-6 rounded-xl shadow-xl flex flex-col items-center">
          <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <span class="text-text-primary font-bold">Analyzing AST...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CodeEditor from './CodeEditor.vue'
import ReviewPanel from './ReviewPanel.vue'
import type { ReviewReport } from '~/../shared/schemas/analyzer'

const code = ref('')
const language = ref('vue')
const isAnalyzing = ref(false)
const report = ref<ReviewReport | null>(null)

const runAnalysis = async () => {
  if (!code.value.trim()) return
  
  isAnalyzing.value = true
  try {
    const response = await $fetch('/api/analyze', {
      method: 'POST',
      body: {
        files: [{
          filename: `source.${language.value}`,
          code: code.value,
          language: language.value,
          framework: language.value === 'vue' ? 'vue' : 'react' // naive map for mvp
        }]
      }
    })
    
    if (response.error) {
      alert(response.error)
    } else {
      report.value = response as ReviewReport
    }
  } catch (err) {
    console.error(err)
    alert('Failed to analyze code.')
  } finally {
    isAnalyzing.value = false
  }
}
</script>
