<template>
  <div class="playground-container">
    <header class="playground-header">
      <div class="header-content">
        <div>
          <h1 class="text-3xl font-bold">Interactive AST Playground</h1>
          <p class="text-muted-foreground mt-2">
            Paste your React, Vue, or Vanilla JS code to instantly detect performance bottlenecks before they hit production.
          </p>
        </div>
        <div class="controls">
          <select v-model="framework" class="select-framework">
            <option value="react">React</option>
            <option value="vue">Vue</option>
            <option value="javascript">Vanilla JS</option>
          </select>
          <button @click="analyzeCode" :disabled="isAnalyzing" class="btn-analyze">
            {{ isAnalyzing ? 'Analyzing...' : 'Analyze Code' }}
          </button>
        </div>
      </div>
    </header>

    <div class="playground-layout">
      <!-- Editor Pane -->
      <div class="editor-pane">
        <div class="pane-header">
          <h2>Source Code</h2>
        </div>
        <textarea
          v-model="sourceCode"
          class="code-editor"
          spellcheck="false"
          placeholder="Paste your code here..."
        ></textarea>
      </div>

      <!-- Results Pane -->
      <div class="results-pane">
        <div class="pane-header">
          <h2>Analysis Results</h2>
        </div>
        
        <div class="results-content" :class="{ 'has-issues': issues.length > 0 }">
          <div v-if="error" class="error-banner">
            <strong>Error:</strong> {{ error }}
          </div>
          
          <template v-else-if="hasAnalyzed">
            <div v-if="issues.length === 0" class="success-state">
              <div class="icon">✨</div>
              <h3>All Good!</h3>
              <p>No performance bottlenecks detected in this code block.</p>
            </div>
            
            <div v-else class="issues-list">
              <div class="summary-banner">
                Found {{ issues.length }} potential performance issue{{ issues.length > 1 ? 's' : '' }}
              </div>
              <div v-for="(issue, index) in issues" :key="index" class="issue-card" :class="issue.severity.toLowerCase()">
                <div class="issue-header">
                  <h3>{{ issue.title }}</h3>
                  <span class="severity-badge" :class="issue.severity.toLowerCase()">{{ issue.severity }}</span>
                </div>
                <p class="description">{{ issue.description }}</p>
                <div v-if="issue.lineNumbers && issue.lineNumbers.length > 0" class="lines">
                  <strong>Line(s):</strong> {{ issue.lineNumbers.join(', ') }}
                </div>
                <div v-if="issue.fix" class="fix">
                  <strong>Recommended Fix:</strong> {{ issue.fix }}
                </div>
                <div v-if="issue.impact" class="impact">
                  <strong>Impact:</strong> {{ issue.impact }}
                </div>
              </div>
            </div>
          </template>
          
          <div v-else class="empty-state">
            <p>Click "Analyze Code" to run the AST performance engine.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const framework = ref('react')
const isAnalyzing = ref(false)
const hasAnalyzed = ref(false)
const error = ref<string | null>(null)
const issues = ref<any[]>([])

const sourceCode = ref(`import React, { useMemo } from 'react'

const HeavyComponent = () => {
  // ❌ PERFORMANCE ISSUE: Inline object prop causes unnecessary re-renders
  // on every parent render cycle, breaking React.memo checks.
  return <ChildComponent data={{ id: 123, status: "active" }} />
}
`)

const analyzeCode = async () => {
  if (!sourceCode.value.trim()) return
  
  isAnalyzing.value = true
  error.value = null
  hasAnalyzed.value = false
  issues.value = []

  try {
    const ext = framework.value === 'react' ? 'tsx' : framework.value === 'vue' ? 'vue' : 'ts'
    const payload = {
      files: [
        {
          filename: \`playground.\${ext}\`,
          code: sourceCode.value,
          language: ext,
          framework: framework.value
        }
      ]
    }

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    
    if (data.error) {
      error.value = data.details || data.error
    } else {
      issues.value = data.issues || []
    }
  } catch (err: any) {
    error.value = err.message || 'Network error occurred during analysis.'
  } finally {
    isAnalyzing.value = true
    setTimeout(() => { isAnalyzing.value = false; hasAnalyzed.value = true }, 500) // Fake small delay for UX
  }
}
</script>

<style scoped>
.playground-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.playground-header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.controls {
  display: flex;
  gap: 1rem;
}

.select-framework {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--bg-background-surface, #1e1e1e);
  border: 1px solid var(--border-color, #333);
  color: white;
  font-weight: 500;
}

.btn-analyze {
  padding: 0.5rem 1.5rem;
  background: #646cff;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-analyze:hover {
  opacity: 0.9;
}

.btn-analyze:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.playground-layout {
  display: flex;
  gap: 2rem;
  flex: 1;
  min-height: 0;
}

.editor-pane, .results-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--bg-background-surface, #1e1e1e);
  border: 1px solid var(--border-color, #333);
  border-radius: 12px;
  overflow: hidden;
}

.pane-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color, #333);
  background: rgba(0, 0, 0, 0.2);
}

.pane-header h2 {
  margin: 0;
  font-size: 1rem;
  color: var(--text-secondary, #aaa);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.code-editor {
  flex: 1;
  width: 100%;
  padding: 1.5rem;
  background: transparent;
  border: none;
  color: #a5b4fc;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.results-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background: rgba(0,0,0,0.1);
}

.empty-state {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary, #666);
  text-align: center;
}

.success-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #4ade80;
}

.success-state .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.summary-banner {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 600;
  border: 1px solid rgba(248, 113, 113, 0.2);
}

.issue-card {
  background: var(--bg-background, #121212);
  border: 1px solid var(--border-color, #333);
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #333;
}

.issue-card.critical { border-left-color: #ef4444; }
.issue-card.high { border-left-color: #f97316; }
.issue-card.medium { border-left-color: #eab308; }
.issue-card.low { border-left-color: #3b82f6; }

.issue-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.issue-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #fff;
}

.severity-badge {
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-transform: uppercase;
}

.severity-badge.critical { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
.severity-badge.high { background: rgba(249, 115, 22, 0.2); color: #fdba74; }
.severity-badge.medium { background: rgba(234, 179, 8, 0.2); color: #fde047; }
.severity-badge.low { background: rgba(59, 130, 246, 0.2); color: #93c5fd; }

.description {
  color: #ccc;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.lines, .fix, .impact {
  font-size: 0.9rem;
  color: #aaa;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(255,255,255,0.05);
  border-radius: 4px;
}

.error-banner {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(239, 68, 68, 0.2);
}
</style>
