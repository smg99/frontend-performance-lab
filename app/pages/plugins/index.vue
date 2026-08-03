<template>
  <div class="page-container">
    <div class="mb-8">
      <h1 class="text-3xl font-bold">Plugin Marketplace</h1>
      <p class="text-muted-foreground mt-2">Discover and install custom performance analysis rules built by the community.</p>
    </div>
    
    <div class="mt-8 space-y-6">
      <div class="flex items-center justify-between border-b border-border pb-4">
        <h2 class="text-xl font-semibold">Featured Plugins</h2>
        <div class="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="text" placeholder="Search plugins..." class="bg-muted px-3 py-1.5 rounded-md border border-border outline-none focus:ring-1 focus:ring-primary w-64" />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="plugin in plugins" :key="plugin.id" class="border border-border rounded-lg p-6 bg-background-surface flex flex-col">
          <div class="flex items-center gap-3 mb-2">
            <Icon name="lucide:package" class="w-5 h-5 text-muted-foreground" />
            <h3 class="font-semibold">{{ plugin.name }}</h3>
          </div>
          <div class="text-sm font-normal text-muted-foreground mt-2 flex-1">
            {{ plugin.description }}
          </div>
          <div class="flex items-center gap-4 mt-4 text-xs font-medium">
            <span class="flex items-center gap-1 text-primary">
              <Icon name="lucide:download" class="w-4 h-4" /> {{ plugin.downloads }}
            </span>
            <span class="flex items-center gap-1 text-yellow-500">
              <Icon name="lucide:star" class="w-4 h-4" /> {{ plugin.rating }}
            </span>
            <span v-if="plugin.verified" class="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
              <Icon name="lucide:check-circle" class="w-3 h-3" /> Verified
            </span>
          </div>
        </div>
      </div>

      <div class="bg-primary/5 rounded-lg border border-primary/20 p-6 mt-12 flex flex-col items-center justify-center text-center">
        <Icon name="lucide:rocket" class="w-12 h-12 text-primary mb-4" />
        <h3 class="text-lg font-bold text-foreground">Build Your Own Plugin</h3>
        <p class="text-muted-foreground max-w-lg mt-2 text-sm">
          Leverage the FPL Plugin SDK to write custom AST traversal rules. Publish them to the marketplace and earn revenue sharing for high-quality rules.
        </p>
        <button class="mt-6 bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium text-sm hover:opacity-90 transition-opacity">
          View SDK Documentation
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const plugins = [
  {
    id: 'fpl-plugin-react-native',
    name: '@fpl/react-native',
    description: 'Specialized performance rules for React Native and Expo architectures.',
    downloads: '12.4k',
    rating: '4.9',
    verified: true
  },
  {
    id: 'fpl-plugin-threejs',
    name: 'fpl-plugin-threejs',
    description: 'Detects memory leaks in WebGL contexts and un-disposed geometries.',
    downloads: '8.2k',
    rating: '4.7',
    verified: true
  },
  {
    id: 'fpl-plugin-a11y',
    name: 'fpl-plugin-accessibility',
    description: 'Extends the analyzer to flag missing ARIA attributes and focus traps.',
    downloads: '45.1k',
    rating: '5.0',
    verified: true
  }
]
</script>
