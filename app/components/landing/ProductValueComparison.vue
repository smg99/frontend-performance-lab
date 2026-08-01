<template>
  <section class="py-24 w-full bg-background-base overflow-hidden border-b border-border-subtle">
    <div class="max-w-5xl mx-auto px-4">
      
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold tracking-tight text-foreground-primary mb-4">A Better Way to Optimize</h2>
        <p class="text-foreground-muted text-lg max-w-2xl mx-auto">Stop guessing why your app is slow. Use static analysis to instantly identify performance bottlenecks.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        
        <!-- Traditional Workflow -->
        <div class="flex flex-col gap-4 p-8 rounded-2xl bg-background-surface/50 border border-border-subtle opacity-70">
          <h3 class="text-sm font-mono tracking-widest text-foreground-muted uppercase mb-2">Traditional Workflow</h3>
          <div class="flex flex-col gap-3">
            <WorkflowStep text="Google 'why is my react app slow'" icon="SearchIcon" :is-bad="true" />
            <div class="h-4 border-l-2 border-dashed border-border-strong ml-5"></div>
            <WorkflowStep text="Copy from StackOverflow" icon="CopyIcon" :is-bad="true" />
            <div class="h-4 border-l-2 border-dashed border-border-strong ml-5"></div>
            <WorkflowStep text="Read random blogs" icon="BookOpenIcon" :is-bad="true" />
            <div class="h-4 border-l-2 border-dashed border-border-strong ml-5"></div>
            <WorkflowStep text="Guess the problem" icon="HelpCircleIcon" :is-bad="true" />
            <div class="h-4 border-l-2 border-dashed border-border-strong ml-5"></div>
            <WorkflowStep text="Hope it's fixed" icon="RefreshCwIcon" :is-bad="true" />
          </div>
        </div>

        <!-- FPL Workflow -->
        <div class="flex flex-col gap-4 p-8 rounded-2xl bg-background-surface border border-primary/20 shadow-xl relative overflow-hidden group">
          <div class="absolute inset-0 bg-radial-gradient from-primary/5 to-transparent opacity-100 pointer-events-none"></div>
          
          <h3 class="text-sm font-mono tracking-widest text-primary uppercase mb-2 relative z-10">Frontend Performance Lab</h3>
          <div class="flex flex-col gap-3 relative z-10">
            <WorkflowStep text="Paste Code" icon="CodeIcon" />
            <div class="h-4 border-l-2 border-primary/40 ml-5"></div>
            <WorkflowStep text="Analyze" icon="ActivityIcon" />
            <div class="h-4 border-l-2 border-primary/40 ml-5"></div>
            <WorkflowStep text="Understand" icon="BrainCircuitIcon" />
            <div class="h-4 border-l-2 border-primary/40 ml-5"></div>
            <WorkflowStep text="Optimize" icon="ZapIcon" />
            <div class="h-4 border-l-2 border-primary/40 ml-5"></div>
            <WorkflowStep text="Validate" icon="CheckCircleIcon" :is-final="true" />
          </div>
        </div>
        
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { 
  SearchIcon, CopyIcon, BookOpenIcon, HelpCircleIcon, RefreshCwIcon,
  CodeIcon, ActivityIcon, BrainCircuitIcon, ZapIcon, CheckCircleIcon 
} from 'lucide-vue-next'

const WorkflowStep = {
  props: ['text', 'icon', 'isBad', 'isFinal'],
  components: { 
    SearchIcon, CopyIcon, BookOpenIcon, HelpCircleIcon, RefreshCwIcon,
    CodeIcon, ActivityIcon, BrainCircuitIcon, ZapIcon, CheckCircleIcon
  },
  template: `
    <div 
      class="flex items-center gap-4 p-3 rounded-lg border transition-colors"
      :class="[
        isBad ? 'bg-background-base border-border-subtle text-foreground-muted' : 
        isFinal ? 'bg-success/10 border-success/30 text-success' : 'bg-primary/10 border-primary/20 text-foreground-primary'
      ]"
    >
      <component :is="icon" class="w-5 h-5 shrink-0" :class="isBad ? 'opacity-50' : (isFinal ? 'text-success' : 'text-primary')" />
      <span class="font-medium text-sm">{{ text }}</span>
    </div>
  `
}
</script>

<style scoped>
.bg-radial-gradient {
  background-image: radial-gradient(circle at 50% 50%, var(--tw-gradient-from) 0%, var(--tw-gradient-to) 100%);
}
</style>
