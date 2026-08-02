<template>
  <div class="py-12 flex items-center justify-center overflow-x-auto hide-scrollbar">
    <div class="flex flex-col lg:flex-row items-center gap-6 min-w-max px-4">
      <!-- Node: IDE -->
      <div class="flex flex-col items-center">
        <div
          class="w-24 h-24 rounded-2xl bg-background-surface border border-border-subtle-strong flex items-center justify-center shadow-md relative group"
        >
          <div
            class="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <span class="font-bold text-foreground-primary">IDE</span>
        </div>
        <span class="mt-2 text-xs text-foreground-muted font-medium">Cursor / VS Code</span>
      </div>

      <!-- Arrow -->
      <div class="hidden lg:flex w-16 items-center justify-center text-border-strong">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
      <div class="flex lg:hidden h-12 items-center justify-center text-border-strong rotate-90">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>

      <!-- Node: MCP Client -->
      <div class="flex flex-col items-center">
        <div
          class="w-32 h-24 rounded-2xl bg-background-base border-2 border-primary/30 flex items-center justify-center shadow-md relative group overflow-hidden"
        >
          <div
            class="absolute inset-0 bg-primary/10 transition-transform duration-1000 -translate-x-full group-hover:translate-x-full"
          />
          <span class="font-bold text-primary">MCP Client</span>
        </div>
        <span class="mt-2 text-xs text-foreground-muted font-medium">JSON-RPC</span>
      </div>

      <!-- Arrow -->
      <div class="hidden lg:flex w-16 items-center justify-center text-border-strong">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
      <div class="flex lg:hidden h-12 items-center justify-center text-border-strong rotate-90">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>

      <!-- Node: FPL Server -->
      <div class="flex flex-col items-center">
        <div
          class="w-32 h-24 rounded-2xl bg-foreground-primary text-background-base flex items-center justify-center shadow-xl relative group"
        >
          <div
            class="absolute inset-0 bg-primary/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <span class="font-bold text-center leading-tight">FPL<br />MCP Server</span>
        </div>
        <span class="mt-2 text-xs text-foreground-muted font-medium">Tools & Resources</span>
      </div>

      <!-- Arrow -->
      <div class="hidden lg:flex w-16 items-center justify-center text-border-strong">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
      <div class="flex lg:hidden h-12 items-center justify-center text-border-strong rotate-90">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>

      <!-- Node: Knowledge Graph -->
      <div class="flex flex-col gap-2">
        <div
          class="px-4 py-2 rounded border border-border-subtle-strong bg-background-surface text-sm font-medium text-foreground-primary"
        >
          Experiments
        </div>
        <div
          class="px-4 py-2 rounded border border-border-subtle-strong bg-background-surface text-sm font-medium text-foreground-primary"
        >
          Browser APIs
        </div>
        <div
          class="px-4 py-2 rounded border border-border-subtle-strong bg-background-surface text-sm font-medium text-foreground-primary"
        >
          Recipes
        </div>
        <div
          class="px-4 py-2 rounded border border-border-subtle-strong bg-background-surface text-sm font-medium text-foreground-primary"
        >
          Analyzer
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
