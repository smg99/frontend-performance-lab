<template>
  <div class="page-container">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Enterprise Dashboard</h1>
      <p class="text-muted-foreground mt-2">Organization-wide performance governance, CI analytics, and historical reporting.</p>
    </div>
    
    <div class="mt-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="border border-border rounded-lg p-6 bg-background-surface">
          <h3 class="text-sm font-medium text-muted-foreground">Total CI Runs (30d)</h3>
          <div class="mt-2 text-2xl font-bold">4,821</div>
        </div>
        <div class="border border-border rounded-lg p-6 bg-background-surface">
          <h3 class="text-sm font-medium text-muted-foreground">Critical Regressions</h3>
          <div class="mt-2 text-2xl font-bold"><span class="text-red-500">12</span></div>
        </div>
        <div class="border border-border rounded-lg p-6 bg-background-surface">
          <h3 class="text-sm font-medium text-muted-foreground">Avg Score</h3>
          <div class="mt-2 text-2xl font-bold"><span class="text-green-500">92/100</span></div>
        </div>
        <div class="border border-border rounded-lg p-6 bg-background-surface">
          <h3 class="text-sm font-medium text-muted-foreground">Private Plugins</h3>
          <div class="mt-2 text-2xl font-bold">3 Active</div>
        </div>
      </div>

      <div class="bg-background-surface border border-border rounded-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold">Governance Policies</h2>
          <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
            Create Policy
          </button>
        </div>

        <div class="space-y-4">
          <div class="flex items-center justify-between border border-border p-4 rounded-md bg-background-base">
            <div>
              <h3 class="font-medium">Block PRs with Critical Regressions</h3>
              <p class="text-sm text-muted-foreground mt-1">Automatically fails GitHub status checks if a critical memory or rendering issue is detected.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">Active</span>
            </div>
          </div>

          <div class="flex items-center justify-between border border-border p-4 rounded-md bg-background-base">
            <div>
              <h3 class="font-medium">Require React Virtualization</h3>
              <p class="text-sm text-muted-foreground mt-1">Enforce the `react-large-map` rule on all components exceeding 100 list items.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded">Warning Only</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-background-surface border border-border rounded-lg p-6 mt-8">
         <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold">Private Plugin Registry</h2>
          <button class="border border-border text-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors">
            Connect NPM Token
          </button>
        </div>
        <p class="text-sm text-muted-foreground mb-4">You have securely linked your `@my-org` private registry. The FPL CLI will automatically download private rules during CI runs.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Enterprise Dashboard Logic
</script>
