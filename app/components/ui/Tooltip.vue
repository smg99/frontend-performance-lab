<script setup lang="ts">
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow
} from 'radix-vue'
import { cn } from '../../utils/cn'

interface Props {
  content: string
  side?: 'top' | 'right' | 'bottom' | 'left'
}

withDefaults(defineProps<Props>(), {
  side: 'top'
})
</script>

<template>
  <TooltipProvider>
    <TooltipRoot>
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          :side="side"
          :class="
            cn(
              'z-50 overflow-hidden rounded-md bg-foreground-primary px-3 py-1.5 text-xs text-foreground-inverse animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
            )
          "
        >
          {{ content }}
          <TooltipArrow class="fill-foreground-primary" :width="8" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
