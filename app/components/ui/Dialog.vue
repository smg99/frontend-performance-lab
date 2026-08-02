<script setup lang="ts">
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose
} from 'radix-vue'
import { XIcon } from 'lucide-vue-next'

interface Props {
  title: string
  description?: string
  open?: boolean
}

defineProps<Props>()
const emit = defineEmits(['update:open'])
</script>

<template>
  <DialogRoot :open="open" @update:open="emit('update:open', $event)">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <DialogContent
        class="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-xl border border-border-subtle-subtle bg-background-base p-6 shadow-dialog animate-zoom-in focus:outline-none"
      >
        <DialogTitle class="text-lg font-semibold text-foreground-primary m-0">
          {{ title }}
        </DialogTitle>
        <DialogDescription v-if="description" class="mt-2 text-sm text-foreground-muted">
          {{ description }}
        </DialogDescription>

        <div class="mt-4">
          <slot />
        </div>

        <DialogClose
          class="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus-ring text-foreground-muted"
        >
          <XIcon class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
