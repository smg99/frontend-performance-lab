<script setup lang="ts">
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'radix-vue'
import { cn } from '../../utils/cn'

interface Props {
  defaultValue?: string
  tabs: { value: string; label: string }[]
  class?: string
}

defineProps<Props>()
</script>

<template>
  <TabsRoot :default-value="defaultValue" :class="cn('flex flex-col w-full', $props.class)">
    <TabsList class="flex border-b border-border-subtle">
      <TabsTrigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        class="px-4 py-2 -mb-px text-sm font-medium text-foreground-muted border-b-2 border-transparent hover:text-foreground-primary focus-ring data-[state=active]:text-foreground-primary data-[state=active]:border-primary transition-all duration-200"
      >
        {{ tab.label }}
      </TabsTrigger>
    </TabsList>
    <TabsContent v-for="tab in tabs" :key="tab.value" :value="tab.value" class="pt-4 focus-ring">
      <slot :name="tab.value" />
    </TabsContent>
  </TabsRoot>
</template>
