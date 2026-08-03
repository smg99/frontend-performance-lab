<template>
  <div class="page-container">
    <PageHeader 
      title="Enterprise Dashboard"
      description="Organization-wide performance governance, CI analytics, and historical reporting."
    />
    
    <div class="mt-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total CI Runs (30d)">
          <template #value>4,821</template>
        </StatCard>
        <StatCard title="Critical Regressions">
          <template #value><span class="text-red-500">12</span></template>
        </StatCard>
        <StatCard title="Avg Score">
          <template #value><span class="text-green-500">92/100</span></template>
        </StatCard>
        <StatCard title="Private Plugins">
          <template #value>3 Active</template>
        </StatCard>
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
import PageHeader from '~/components/PageHeader.vue'
import StatCard from '~/components/ui/StatCard.vue'
</script>
