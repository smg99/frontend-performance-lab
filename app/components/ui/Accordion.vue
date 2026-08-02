<script setup lang="ts">
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent
} from 'radix-vue'
import { ChevronDownIcon } from 'lucide-vue-next'
import { cn } from '../../utils/cn'

interface Props {
  items: { value: string; title: string; content?: string }[]
  type?: 'single' | 'multiple'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'single'
})
</script>

<template>
  <AccordionRoot
    :type="type"
    :class="cn('w-full border-b border-border-subtle-subtle', props.class)"
    collapsible
  >
    <AccordionItem
      v-for="item in items"
      :key="item.value"
      :value="item.value"
      class="border-t border-border-subtle-subtle"
    >
      <AccordionHeader class="flex">
        <AccordionTrigger
          class="flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 focus-ring"
        >
          {{ item.title }}
          <ChevronDownIcon
            class="h-4 w-4 shrink-0 text-foreground-muted transition-transform duration-200"
          />
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent
        class="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      >
        <div class="pb-4 pt-0 text-foreground-muted">
          <slot :name="item.value">{{ item.content }}</slot>
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>

<style>
@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}
@keyframes accordion-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}
.animate-accordion-down {
  animation: accordion-down 0.2s ease-out;
}
.animate-accordion-up {
  animation: accordion-up 0.2s ease-out;
}
</style>
