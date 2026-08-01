<template>
  <div class="bg-card border border-border p-6 rounded-xl shadow-subtle flex flex-col gap-8 max-w-4xl w-full">
    
    <!-- Header -->
    <div class="flex justify-between items-start border-b border-border pb-4">
      <div>
        <h2 class="text-2xl font-bold text-text-primary tracking-tight">{{ data.title }} Summary</h2>
        <p class="text-sm text-text-secondary mt-1">Comprehensive architectural breakdown and production recommendations.</p>
      </div>
      <div class="flex gap-2">
        <button @click="expandAll = !expandAll" class="text-xs px-3 py-1.5 bg-surface border border-border rounded hover:bg-border/50 transition-colors">
          {{ expandAll ? 'Collapse All' : 'Expand All' }}
        </button>
      </div>
    </div>

    <!-- What is it -->
    <section v-if="data.whatIsIt">
      <h3 class="text-lg font-bold text-primary flex items-center gap-2 mb-2">
        <span>📖</span> What is it?
      </h3>
      <p class="text-sm text-text-secondary leading-relaxed bg-surface p-4 rounded-lg border border-border">
        {{ data.whatIsIt }}
      </p>
    </section>

    <!-- How it works -->
    <section v-if="data.howItWorks">
      <h3 class="text-lg font-bold text-info flex items-center gap-2 mb-2">
        <span>⚙️</span> How it works
      </h3>
      <p class="text-sm text-text-secondary leading-relaxed bg-surface p-4 rounded-lg border border-border">
        {{ data.howItWorks }}
      </p>
    </section>

    <!-- Recommendation -->
    <section v-if="data.recommendation">
      <h3 class="text-lg font-bold text-success flex items-center gap-2 mb-2">
        <span>🚀</span> Production Recommendation
      </h3>
      <div class="bg-success/10 border border-success/30 p-4 rounded-lg">
        <h4 class="font-bold text-success mb-2">{{ data.recommendation.approach }}</h4>
        <p class="text-sm text-success-foreground mb-3">{{ data.recommendation.reasoning }}</p>
        <CodeSnippet 
          v-if="data.recommendation.codeSample" 
          :code="data.recommendation.codeSample" 
          title="Recommended Implementation" 
          :force-expand="expandAll" 
        />
      </div>
    </section>

    <!-- Decision Matrix -->
    <section v-if="data.decisionMatrix">
      <h3 class="text-lg font-bold text-text-primary flex items-center gap-2 mb-2">
        <span>⚖️</span> Decision Matrix
      </h3>
      <DecisionMatrix :rows="data.decisionMatrix" />
    </section>

    <!-- Common Mistakes -->
    <section v-if="data.commonMistakes && data.commonMistakes.length > 0">
      <h3 class="text-lg font-bold text-danger flex items-center gap-2 mb-2">
        <span>⚠️</span> Common Mistakes
      </h3>
      <div class="space-y-4">
        <div v-for="(mistake, idx) in data.commonMistakes" :key="idx" class="bg-surface border border-border p-4 rounded-lg">
          <div class="flex gap-2 items-start mb-2">
            <span class="text-danger mt-0.5">❌</span>
            <div>
              <span class="font-bold text-sm block">{{ mistake.problem }}</span>
              <span class="text-xs text-text-secondary">{{ mistake.impact }}</span>
            </div>
          </div>
          <div class="flex gap-2 items-start pt-2 border-t border-border">
            <span class="text-success mt-0.5">✅</span>
            <div class="flex-1">
              <span class="text-sm">{{ mistake.fix }}</span>
            </div>
          </div>
          
          <div v-if="mistake.badCode || mistake.goodCode" class="mt-4 pt-4 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-4">
            <CodeSnippet 
              v-if="mistake.badCode" 
              :code="mistake.badCode" 
              title="❌ Avoid" 
              :force-expand="expandAll" 
            />
            <CodeSnippet 
              v-if="mistake.goodCode" 
              :code="mistake.goodCode" 
              title="✅ Do This Instead" 
              :force-expand="expandAll" 
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Interview Questions -->
    <section v-if="data.interviewQuestions && data.interviewQuestions.length > 0">
      <h3 class="text-lg font-bold text-purple-500 flex items-center gap-2 mb-2">
        <span>🎯</span> Interview Questions
      </h3>
      <div class="space-y-4">
        <InterviewQuestion 
          v-for="(q, idx) in data.interviewQuestions" 
          :key="idx" 
          :question="q" 
          :force-expand="expandAll" 
        />
      </div>
    </section>

    <!-- Pro Tips -->
    <section v-if="data.proTips && data.proTips.length > 0">
      <h3 class="text-lg font-bold text-warning flex items-center gap-2 mb-2">
        <span>💡</span> Pro Tips
      </h3>
      <ul class="list-disc pl-5 space-y-2 text-sm text-text-secondary bg-surface p-4 rounded-lg border border-border">
        <li v-for="(tip, idx) in data.proTips" :key="idx">{{ tip }}</li>
      </ul>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { LearningSummaryData } from '~/types/learning'
import DecisionMatrix from './DecisionMatrix.vue'
import InterviewQuestion from './InterviewQuestion.vue'
import CodeSnippet from './CodeSnippet.vue'

defineProps<{
  data: LearningSummaryData
}>()

const expandAll = ref(false)
</script>
