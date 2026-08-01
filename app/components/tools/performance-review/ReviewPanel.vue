<template>
  <div class="h-full overflow-y-auto bg-background-base p-6 space-y-6">
    <div
      v-if="!report"
      class="flex flex-col items-center justify-center h-full text-text-secondary"
    >
      <div class="text-4xl mb-4 opacity-50">🔬</div>
      <p>Select a file and click Analyze to generate a performance review.</p>
    </div>

    <template v-else>
      <div class="flex justify-between items-end">
        <h2 class="text-2xl font-bold text-text-primary tracking-tight">Review Summary</h2>

        <div class="flex items-center gap-2">
          <Button variant="outline" size="sm" @click="downloadReport('json')">
            <DownloadIcon class="w-3 h-3 mr-1" /> JSON
          </Button>
          <Button variant="outline" size="sm" @click="downloadReport('html')">
            <DownloadIcon class="w-3 h-3 mr-1" /> HTML
          </Button>
          <Button variant="outline" size="sm" @click="copyMarkdown">
            <CopyIcon class="w-3 h-3 mr-1" /> Markdown
          </Button>
        </div>
      </div>

      <PerformanceScore :report="report" />

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-4">
          <h3 class="text-lg font-bold text-text-primary flex items-center gap-2">
            Detected Issues
            <span class="bg-border-strong text-text-secondary text-xs px-2 py-0.5 rounded-full">{{
              report.issues.length
            }}</span>
          </h3>
          <IssueCard v-for="issue in report.issues" :key="issue.id" :issue="issue" />
          <div
            v-if="report.issues.length === 0"
            class="bg-success/10 border border-success/30 p-6 rounded-lg text-center"
          >
            <span class="text-4xl block mb-2">🎉</span>
            <span class="text-success font-bold block">No performance bottlenecks detected!</span>
            <p class="text-sm text-success-foreground mt-1">
              Your code looks incredibly optimized.
            </p>
          </div>
        </div>

        <div class="space-y-6">
          <OptimizationChecklist :checklist="report.checklist" />
          <div class="p-4 bg-background-surface border border-border-subtle rounded-lg">
            <h4 class="text-sm font-bold text-text-primary mb-2">Report Hash</h4>
            <code
              class="text-xs text-text-secondary break-all bg-background-base p-2 rounded block"
              >{{ report.reportHash }}</code
            >
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { DownloadIcon, CopyIcon } from 'lucide-vue-next'
import type { ReviewReport } from '@schemas/analyzer'
import PerformanceScore from './PerformanceScore.vue'
import OptimizationChecklist from './OptimizationChecklist.vue'
import IssueCard from './IssueCard.vue'
import Button from '~/components/ui/Button.vue'
import {
  generateJSONReport,
  generateMarkdownReport,
  generateHTMLReport
} from '@utils/analyzer/export'

const props = defineProps<{
  report: ReviewReport | null
}>()

const copyMarkdown = async () => {
  if (!props.report) return
  const md = generateMarkdownReport(props.report)
  await navigator.clipboard.writeText(md)
  alert('Markdown copied to clipboard!')
}

const downloadReport = (format: 'json' | 'html') => {
  if (!props.report) return
  let content = ''
  let type = ''
  let ext = ''
  if (format === 'json') {
    content = generateJSONReport(props.report)
    type = 'application/json'
    ext = 'json'
  } else {
    content = generateHTMLReport(props.report)
    type = 'text/html'
    ext = 'html'
  }

  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `performance-report-${props.report.reportHash}.${ext}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>
