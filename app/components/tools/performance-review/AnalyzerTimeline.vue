<template>
  <div class="px-6 py-4 bg-background-base border-b border-border-subtle flex items-center justify-between text-xs font-mono overflow-x-auto">
    <div v-for="(stage, idx) in stages" :key="stage.id" class="flex items-center flex-shrink-0">
      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500 border"
        :class="getStateClass(stage.id)"
      >
        <component :is="stage.icon" class="w-4 h-4" :class="{ 'animate-spin': isCurrent(stage.id) }" />
        <span>{{ stage.label }}</span>
      </div>
      <div v-if="idx < stages.length - 1" class="w-6 h-[2px] mx-2 transition-all duration-500 relative overflow-hidden" :class="getLineClass(idx)">
        <div v-if="isCurrent(stage.id)" class="absolute inset-0 bg-primary/50 translate-x-[-100%] animate-[slideRight_1s_infinite]" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FileCodeIcon, CpuIcon, NetworkIcon, ShieldAlertIcon, CheckCircleIcon } from 'lucide-vue-next'

const props = defineProps<{ state: 'idle' | 'parsing' | 'ast' | 'rules' | 'done' }>()

const stages = [
  { id: 'source', label: 'Source', icon: FileCodeIcon },
  { id: 'parsing', label: 'Parser', icon: CpuIcon },
  { id: 'ast', label: 'AST', icon: NetworkIcon },
  { id: 'rules', label: 'Rules Engine', icon: ShieldAlertIcon },
  { id: 'done', label: 'Report', icon: CheckCircleIcon }
]

const stageIndexMap: Record<string, number> = { idle: 0, source: 0, parsing: 1, ast: 2, rules: 3, done: 4 }
const currentIndex = computed(() => stageIndexMap[props.state])

const isCurrent = (stageId: string) => stageIndexMap[stageId] === currentIndex.value && props.state !== 'done'

const getStateClass = (stageId: string) => {
  const stageIdx = stageIndexMap[stageId]
  if (stageIdx < currentIndex.value || props.state === 'done') return 'bg-success/10 border-success/30 text-success' // Completed
  if (stageIdx === currentIndex.value) return 'bg-primary/20 border-primary text-primary shadow-[0_0_10px_rgba(var(--color-primary),0.3)]' // Active
  return 'bg-background-surface border-border-subtle text-text-muted opacity-50' // Pending
}

const getLineClass = (idx: number) => {
  if (idx < currentIndex.value || props.state === 'done') return 'bg-success/50'
  if (idx === currentIndex.value) return 'bg-primary/50'
  return 'bg-border-subtle/50'
}
</script>

<style scoped>
@keyframes slideRight {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
