<template>
  <div class="bg-surface border border-border rounded-lg overflow-hidden transition-all duration-300">
    <button 
      @click="isExpanded = !isExpanded"
      class="w-full px-4 py-3 flex items-center justify-between hover:bg-background transition-colors text-left"
    >
      <div class="flex items-center gap-3">
        <span 
          class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border"
          :class="difficultyColor"
        >
          {{ question.difficulty }}
        </span>
        <span class="font-bold text-sm text-text-primary">{{ question.question }}</span>
      </div>
      <span class="text-text-secondary text-lg" :class="{ 'rotate-180': isExpanded }">▼</span>
    </button>
    
    <div v-show="isExpanded" class="px-4 py-3 bg-background border-t border-border">
      <div class="text-sm text-text-secondary leading-relaxed mb-3">
        <strong class="text-success block mb-1">Answer:</strong>
        {{ question.answer }}
      </div>
      <div v-if="question.relatedTopics?.length" class="flex flex-wrap gap-2 pt-2 border-t border-border/50">
        <span v-for="topic in question.relatedTopics" :key="topic" class="text-[10px] bg-surface text-text-secondary px-2 py-0.5 rounded">
          #{{ topic }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { InterviewQuestion } from '~/types/learning'

const props = defineProps<{
  question: InterviewQuestion
  forceExpand: boolean
}>()

const isExpanded = ref(props.forceExpand)

watch(() => props.forceExpand, (newVal) => {
  isExpanded.value = newVal
})

const difficultyColor = computed(() => {
  switch (props.question.difficulty) {
    case 'Beginner': return 'bg-success/10 text-success border-success/30'
    case 'Intermediate': return 'bg-warning/10 text-warning border-warning/30'
    case 'Advanced': return 'bg-danger/10 text-danger border-danger/30'
    default: return 'bg-surface text-text-secondary border-border'
  }
})
</script>
