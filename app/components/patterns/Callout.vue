<script setup lang="ts">
import { computed } from 'vue'
import { InfoIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon } from 'lucide-vue-next'
import { cn } from '../../utils/cn'

interface Props {
  title?: string
  variant?: 'info' | 'warning' | 'success' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info'
})

const icon = computed(() => {
  switch (props.variant) {
    case 'info':
      return InfoIcon
    case 'warning':
      return AlertTriangleIcon
    case 'success':
      return CheckCircleIcon
    case 'danger':
      return XCircleIcon
    default:
      return undefined
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'info':
      return 'bg-background-surface border-border-subtle-strong text-foreground-primary'
    case 'warning':
      return 'bg-warning-bg border-warning-border text-warning'
    case 'success':
      return 'bg-success-bg border-success-border text-success'
    case 'danger':
      return 'bg-danger-bg border-danger-border text-danger'
    default:
      return ''
  }
})
</script>

<template>
  <div :class="cn('rounded-xl border p-4 flex gap-3', variantClasses)">
    <component :is="icon" class="w-5 h-5 shrink-0 mt-0.5" />
    <div class="flex flex-col gap-1 text-sm">
      <strong v-if="title" class="font-semibold">{{ title }}</strong>
      <div class="opacity-90 leading-relaxed">
        <slot />
      </div>
    </div>
  </div>
</template>
