<template>
  <div
    class="bg-background-surface border border-border-subtle-subtle rounded-xl shadow-sm overflow-hidden flex flex-col"
  >
    <!-- Header -->
    <div
      class="p-4 border-b border-border-subtle-subtle flex justify-between items-start"
      :class="headerBg"
    >
      <div class="flex gap-3">
        <component :is="icon" class="w-6 h-6 mt-0.5" :class="iconColor" />
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span
              class="text-xs font-bold uppercase tracking-wide px-2 py-0.5 rounded"
              :class="severityBadge"
            >
              {{ issue.severity }}
            </span>
            <span class="text-xs text-text-muted">Rule: {{ issue.ruleId }}</span>
            <span
              v-if="issue.lineNumbers?.length"
              class="text-xs text-text-muted bg-background-base px-1.5 py-0.5 rounded border border-border-subtle-subtle"
            >
              Line {{ issue.lineNumbers.join(', ') }}
            </span>
          </div>
          <h4 class="font-bold text-lg text-foreground-primary">{{ issue.title }}</h4>
        </div>
      </div>

      <!-- Browser Impact Badges -->
      <div class="flex gap-1">
        <span
          v-if="issue.browserImpact.cpu"
          class="px-2 py-1 text-[10px] uppercase font-bold bg-background-base text-foreground-muted border border-border-subtle-subtle rounded-full"
          title="CPU Impact"
          >CPU</span
        >
        <span
          v-if="issue.browserImpact.memory"
          class="px-2 py-1 text-[10px] uppercase font-bold bg-background-base text-foreground-muted border border-border-subtle-subtle rounded-full"
          title="Memory Impact"
          >MEM</span
        >
        <span
          v-if="issue.browserImpact.rendering"
          class="px-2 py-1 text-[10px] uppercase font-bold bg-background-base text-foreground-muted border border-border-subtle-subtle rounded-full"
          title="Rendering Impact"
          >RND</span
        >
        <span
          v-if="issue.browserImpact.network"
          class="px-2 py-1 text-[10px] uppercase font-bold bg-background-base text-foreground-muted border border-border-subtle-subtle rounded-full"
          title="Network Impact"
          >NET</span
        >
        <span
          v-if="issue.browserImpact.cwv"
          class="px-2 py-1 text-[10px] uppercase font-bold bg-background-base text-foreground-muted border border-border-subtle-subtle rounded-full"
          title="Core Web Vitals Impact"
          >CWV</span
        >
      </div>
    </div>

    <!-- Body Tabs -->
    <div class="flex border-b border-border-subtle-subtle bg-background-base text-sm">
      <button
        v-for="tab in ['Overview', 'Explain Like Browser', 'Auto Fix']"
        :key="tab"
        class="px-4 py-2 font-medium transition-colors"
        :class="
          activeTab === tab
            ? 'text-primary border-b-2 border-primary bg-background-surface'
            : 'text-foreground-muted hover:text-foreground-primary hover:bg-background-surface/50'
        "
        @click="activeTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="p-4 flex-1">
      <!-- Overview -->
      <div v-if="activeTab === 'Overview'" class="space-y-4">
        <p class="text-sm text-foreground-primary">{{ issue.description }}</p>

        <div class="bg-error/5 border border-error/20 p-3 rounded-lg text-sm">
          <strong class="text-error block mb-1">Impact</strong>
          <span class="text-foreground-muted">{{ issue.impact }}</span>
        </div>

        <div class="bg-success/5 border border-success/20 p-3 rounded-lg text-sm">
          <strong class="text-success block mb-1">Recommendation</strong>
          <span class="text-foreground-muted">{{ issue.fix }}</span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div
            class="bg-background-base border border-border-subtle-subtle p-3 rounded-lg text-sm flex items-center justify-between"
          >
            <strong class="text-foreground-primary">Est. Improvement</strong>
            <span class="text-success font-medium">{{
              issue.estimatedImprovement || 'Variable'
            }}</span>
          </div>
          <div
            class="bg-background-base border border-border-subtle-subtle p-3 rounded-lg text-sm flex items-center justify-between"
          >
            <strong class="text-foreground-primary">Time to Fix</strong>
            <span class="text-info font-medium">{{ issue.timeToFix || '< 5 mins' }}</span>
          </div>
        </div>

        <!-- Confidence -->
        <details
          class="group bg-background-base border border-border-subtle-subtle rounded-lg text-sm overflow-hidden"
        >
          <summary
            class="px-4 py-2 font-medium cursor-pointer flex justify-between items-center text-foreground-muted hover:bg-background-surface transition-colors"
          >
            <span class="flex items-center gap-2">
              <ShieldCheckIcon class="w-4 h-4 text-info" />
              AI Confidence: {{ issue.confidence.score }}%
            </span>
            <span class="text-xs opacity-50 group-open:hidden">Expand details</span>
          </summary>
          <div class="p-4 border-t border-border-subtle-subtle space-y-2">
            <p>
              <strong class="text-foreground-primary">Reasoning:</strong>
              <span class="text-foreground-muted">{{ issue.confidence.reasoning }}</span>
            </p>
            <p>
              <strong class="text-foreground-primary">Limitations:</strong>
              <span class="text-foreground-muted">{{ issue.confidence.limitations }}</span>
            </p>
            <p>
              <strong class="text-foreground-primary">False Positive Risk:</strong>
              <span class="text-foreground-muted">{{ issue.confidence.falsePositiveRisk }}</span>
            </p>
          </div>
        </details>
      </div>

      <!-- Explain Like Browser -->
      <div v-if="activeTab === 'Explain Like Browser'" class="space-y-6">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <h5 class="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
              What Happened
            </h5>
            <p class="text-sm text-foreground-primary">{{ issue.explanation.whatHappened }}</p>
          </div>
          <div>
            <h5 class="text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
              Why The Browser Struggles
            </h5>
            <p class="text-sm text-foreground-primary">
              {{ issue.explanation.whyBrowserBehavesThisWay }}
            </p>
          </div>
        </div>

        <!-- Pipeline Vis -->
        <div class="mt-4">
          <h5 class="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
            Rendering Pipeline Affected
          </h5>
          <div
            class="flex items-center justify-between bg-background-base p-3 rounded border border-border-subtle-subtle"
          >
            <div
              v-for="(stage, idx) in ['DOM', 'Style', 'Layout', 'Paint', 'Composite']"
              :key="stage"
              class="flex items-center flex-1"
            >
              <div
                class="text-xs font-bold px-2 py-1 rounded text-center w-full transition-colors"
                :class="
                  issue.explanation.pipelineInvolved.includes(stage as any)
                    ? 'bg-error/20 text-error border border-error/30'
                    : 'text-text-muted'
                "
              >
                {{ stage }}
              </div>
              <div v-if="idx < 4" class="text-border-subtle mx-1">→</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Auto Fix -->
      <div v-if="activeTab === 'Auto Fix'" class="space-y-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="rounded overflow-hidden border border-border-subtle-subtle flex flex-col">
            <div
              class="bg-error/10 text-error text-xs font-bold px-3 py-1 border-b border-error/20"
            >
              Bad Code
            </div>
            <pre
              class="bg-background-base p-3 text-xs overflow-x-auto text-foreground-muted m-0 flex-1"
            ><code>{{ issue.autoFix.badCode }}</code></pre>
          </div>
          <div class="rounded overflow-hidden border border-border-subtle-subtle flex flex-col">
            <div
              class="bg-success/10 text-success text-xs font-bold px-3 py-1 border-b border-success/20"
            >
              Recommended
            </div>
            <pre
              class="bg-background-base p-3 text-xs overflow-x-auto text-foreground-muted m-0 flex-1"
            ><code>{{ issue.autoFix.recommendedCode }}</code></pre>
          </div>
        </div>
        <div class="bg-info/10 border border-info/20 p-3 rounded-lg text-sm flex gap-3 items-start">
          <LightbulbIcon class="w-5 h-5 text-info shrink-0 mt-0.5" />
          <div>
            <strong class="text-info block mb-1">Why is this faster?</strong>
            <span class="text-foreground-muted">{{ issue.autoFix.whyFaster }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Related Knowledge Footer -->
    <div
      class="px-4 py-3 border-t border-border-subtle-subtle bg-background-base flex flex-wrap items-center gap-x-4 gap-y-2"
    >
      <span class="text-xs font-bold text-text-muted flex items-center gap-1">
        <BookOpenIcon class="w-3 h-3" /> Related Knowledge:
      </span>

      <NuxtLink
        v-for="id in issue.relatedExperimentIds"
        :key="id"
        :to="`/experiments/${id}`"
        class="text-[10px] font-medium text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors"
      >
        {{ id }} (Experiment)
      </NuxtLink>

      <NuxtLink
        v-for="id in issue.browserAPIs"
        :key="id"
        :to="`/apis/${id}`"
        class="text-[10px] font-medium text-info bg-info/10 border border-info/20 px-2 py-0.5 rounded-full hover:bg-info/20 transition-colors"
      >
        {{ id }} (API)
      </NuxtLink>

      <NuxtLink
        v-for="id in issue.relatedRecipes"
        :key="id"
        :to="`/recipes/${id}`"
        class="text-[10px] font-medium text-warning bg-warning/10 border border-warning/20 px-2 py-0.5 rounded-full hover:bg-warning/20 transition-colors"
      >
        {{ id }} (Recipe)
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  AlertCircleIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  InfoIcon,
  LightbulbIcon,
  BookOpenIcon
} from 'lucide-vue-next'
import type { Issue } from '@schemas/analyzer'

const props = defineProps<{ issue: Issue }>()
const activeTab = ref('Overview')

const icon = computed(() => {
  if (props.issue.severity === 'Critical') return AlertCircleIcon
  if (props.issue.severity === 'High') return AlertTriangleIcon
  if (props.issue.severity === 'Medium') return AlertTriangleIcon
  if (props.issue.severity === 'Low') return InfoIcon
  return InfoIcon
})

const severityBadge = computed(() => {
  switch (props.issue.severity) {
    case 'Critical':
      return 'bg-error text-error-foreground'
    case 'High':
      return 'bg-warning text-warning-foreground'
    case 'Medium':
      return 'bg-warning/70 text-warning-foreground'
    case 'Low':
      return 'bg-info text-info-foreground'
    case 'Info':
      return 'bg-background-base text-foreground-muted border border-border-subtle-subtle'
    default:
      return 'bg-background-base text-foreground-muted'
  }
})

const iconColor = computed(() => {
  switch (props.issue.severity) {
    case 'Critical':
      return 'text-error'
    case 'High':
      return 'text-warning'
    case 'Medium':
      return 'text-warning'
    case 'Low':
      return 'text-info'
    case 'Info':
      return 'text-text-muted'
    default:
      return 'text-text-muted'
  }
})

const headerBg = computed(() => {
  switch (props.issue.severity) {
    case 'Critical':
      return 'bg-error/5'
    case 'High':
      return 'bg-warning/5'
    default:
      return 'bg-background-surface'
  }
})
</script>
