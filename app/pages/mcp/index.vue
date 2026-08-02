<template>
  <div class="min-h-screen bg-background-base text-foreground-primary">
    <!-- Hero Section -->
    <section class="py-16 md:py-24 border-b border-border-subtle-subtle bg-background-surface/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center text-center">
          <Badge variant="primary" class="mb-6 animate-fade-in-up">AI Ready</Badge>
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground-primary mb-6"
          >
            Frontend Performance Lab MCP
          </h1>
          <p
            class="text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Connect your AI assistant to a specialized frontend performance knowledge graph. Use
            Frontend Performance Lab from Cursor, Claude Desktop, VS Code, Windsurf and any
            MCP-compatible client.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <NuxtLink
              to="/install"
              class="inline-flex items-center justify-center h-12 px-6 text-sm font-medium bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary-hover hover:shadow-lg transition-all"
            >
              Install CLI
            </NuxtLink>
            <a
              href="https://github.com/smg99/frontend-performance-lab"
              target="_blank"
              class="inline-flex items-center justify-center h-12 px-6 text-sm font-medium bg-background-surface border border-border-subtle-strong text-foreground-primary rounded-lg shadow-sm hover:bg-background-hover hover:border-primary/50 transition-all"
            >
              Documentation
            </a>
          </div>
          <div class="mt-12 flex flex-col items-center">
            <span class="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-4"
              >Works With</span
            >
            <div
              class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-foreground-muted font-medium"
            >
              <span class="flex items-center gap-2"
                ><CheckIcon class="w-4 h-4 text-primary" /> Cursor</span
              >
              <span class="flex items-center gap-2"
                ><CheckIcon class="w-4 h-4 text-primary" /> Claude Desktop</span
              >
              <span class="flex items-center gap-2"
                ><CheckIcon class="w-4 h-4 text-primary" /> VS Code</span
              >
              <span class="flex items-center gap-2"
                ><CheckIcon class="w-4 h-4 text-primary" /> Windsurf</span
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      <!-- Live Server Status -->
      <section>
        <div class="mb-8">
          <h2 class="text-2xl font-bold tracking-tight mb-2">Live Server Status</h2>
          <p class="text-foreground-muted text-sm">
            Real-time diagnostics from the running MCP API endpoint.
          </p>
        </div>
        <MCPStatusCard />
      </section>

      <!-- Capabilities -->
      <section>
        <div class="mb-8 text-center">
          <h2 class="text-2xl font-bold tracking-tight mb-2">
            What can Frontend Performance Lab do?
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card
            class="p-6 border border-border-subtle-subtle hover:border-primary/50 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4"
            >
              <FileSearchIcon class="w-5 h-5" />
            </div>
            <h3 class="font-bold mb-2">Review Component Performance</h3>
            <p class="text-sm text-foreground-muted">
              Analyze Vue and React code for hidden performance issues.
            </p>
          </Card>
          <Card
            class="p-6 border border-border-subtle-subtle hover:border-primary/50 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4"
            >
              <ZapIcon class="w-5 h-5" />
            </div>
            <h3 class="font-bold mb-2">Detect Rendering Bottlenecks</h3>
            <p class="text-sm text-foreground-muted">
              Identify layout thrashing and large component trees instantly.
            </p>
          </Card>
          <Card
            class="p-6 border border-border-subtle-subtle hover:border-primary/50 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4"
            >
              <BlocksIcon class="w-5 h-5" />
            </div>
            <h3 class="font-bold mb-2">Explain Browser APIs</h3>
            <p class="text-sm text-foreground-muted">
              Get structured documentation on performance APIs directly in your IDE.
            </p>
          </Card>
          <Card
            class="p-6 border border-border-subtle-subtle hover:border-primary/50 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4"
            >
              <CodeIcon class="w-5 h-5" />
            </div>
            <h3 class="font-bold mb-2">Recommend Optimizations</h3>
            <p class="text-sm text-foreground-muted">
              Provide actionable recipes to fix identified bottlenecks.
            </p>
          </Card>
          <Card
            class="p-6 border border-border-subtle-subtle hover:border-primary/50 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4"
            >
              <BoxesIcon class="w-5 h-5" />
            </div>
            <h3 class="font-bold mb-2">Search Performance Knowledge</h3>
            <p class="text-sm text-foreground-muted">
              Query a curated database of modern frontend patterns.
            </p>
          </Card>
          <Card
            class="p-6 border border-border-subtle-subtle hover:border-primary/50 transition-colors"
          >
            <div
              class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4"
            >
              <PuzzleIcon class="w-5 h-5" />
            </div>
            <h3 class="font-bold mb-2">Launch Interactive Experiments</h3>
            <p class="text-sm text-foreground-muted">
              Open live, sandboxed demonstrations of specific bugs.
            </p>
          </Card>
        </div>
      </section>

      <!-- Architecture -->
      <section>
        <div class="mb-8 text-center">
          <h2 class="text-2xl font-bold tracking-tight mb-2">Architecture</h2>
          <p class="text-foreground-muted text-sm">
            How the Frontend Performance Lab integrates with your IDE.
          </p>
        </div>
        <MCPArchitecture />
      </section>

      <!-- Example Workflow -->
      <section>
        <div class="mb-8 text-center">
          <h2 class="text-2xl font-bold tracking-tight mb-2">Example Workflow</h2>
          <p class="text-foreground-muted text-sm">
            The automated "aha" moment powered by MCP tools.
          </p>
        </div>
        <div class="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div
            class="bg-background-surface p-4 rounded-xl border border-border-subtle-subtle text-sm font-medium shadow-sm w-full md:w-auto text-center flex-1"
          >
            Paste Vue Component
          </div>
          <ArrowRightIcon class="hidden md:block w-5 h-5 text-foreground-muted shrink-0" />
          <div
            class="bg-primary/10 text-primary p-4 rounded-xl border border-primary/20 text-sm font-medium shadow-sm w-full md:w-auto text-center flex-1"
          >
            Analyzer detects Layout Thrashing
          </div>
          <ArrowRightIcon class="hidden md:block w-5 h-5 text-foreground-muted shrink-0" />
          <div
            class="bg-primary/10 text-primary p-4 rounded-xl border border-primary/20 text-sm font-medium shadow-sm w-full md:w-auto text-center flex-1"
          >
            Graph recommends ResizeObserver
          </div>
          <ArrowRightIcon class="hidden md:block w-5 h-5 text-foreground-muted shrink-0" />
          <div
            class="bg-primary/10 text-primary p-4 rounded-xl border border-primary/20 text-sm font-medium shadow-sm w-full md:w-auto text-center flex-1"
          >
            Recipe explains virtualization
          </div>
          <ArrowRightIcon class="hidden md:block w-5 h-5 text-foreground-muted shrink-0" />
          <div
            class="bg-background-surface p-4 rounded-xl border border-border-subtle-subtle text-sm font-medium shadow-sm w-full md:w-auto text-center flex-1"
          >
            Optimized Code
          </div>
        </div>
      </section>

      <!-- Try the MCP Server -->
      <section>
        <h2 class="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
          Try Frontend Performance Lab
          <Badge variant="secondary" class="text-[10px]">API Powered</Badge>
        </h2>
        <p class="text-foreground-muted text-sm mb-6 max-w-2xl">
          Execute real MCP tools directly from your browser. This playground communicates with the
          same unified core as the stdio server via the Nuxt
          <code class="text-primary bg-primary/10 px-1 rounded">/api/mcp/execute</code> endpoint.
        </p>
        <MCPPlayground />
      </section>

      <!-- Dynamic Explorers (Tools, Resources, Prompts) -->
      <section>
        <h2 class="text-2xl font-bold tracking-tight mb-6">Tools Explorer</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="tool in mcpTools"
            :key="tool.id"
            class="p-6 flex flex-col h-full hover:border-primary transition-colors group"
          >
            <div class="flex items-start justify-between mb-3">
              <h3 class="font-mono text-primary font-bold text-base leading-tight mt-0.5">
                {{ tool.name }}
              </h3>
              <span
                class="text-[10px] px-2 py-0.5 rounded-full bg-background-hover text-foreground-muted border border-border-subtle-subtle whitespace-nowrap ml-2"
              >
                {{ getToolCategory(tool.name) }}
              </span>
            </div>
            <p class="text-foreground-muted text-sm flex-1 mb-5 leading-relaxed">
              {{ tool.description }}
            </p>
            <div
              class="text-[10px] font-mono bg-background-base p-2.5 rounded border border-border-subtle-subtle overflow-x-auto text-foreground-secondary"
            >
              {{ tool.schema }}
            </div>
          </Card>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold tracking-tight mb-6">Resources Explorer</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            class="p-6 flex flex-col justify-center gap-3 border-l-4 border-l-primary hover:shadow-sm hover:-translate-y-[1px] hover:border-t-border-subtle-strong hover:border-r-border-subtle-strong hover:border-b-border-subtle-strong hover:border-l-blue-500 cursor-pointer transition-all min-h-[110px]"
          >
            <h3 class="font-bold text-sm">Experiments</h3>
            <code
              class="text-xs text-foreground-muted font-mono bg-background-base px-2 py-1.5 rounded border border-border-subtle-subtle w-fit"
              >performance://experiments/{id}</code
            >
          </Card>
          <Card
            class="p-6 flex flex-col justify-center gap-3 border-l-4 border-l-primary hover:shadow-sm hover:-translate-y-[1px] hover:border-t-border-subtle-strong hover:border-r-border-subtle-strong hover:border-b-border-subtle-strong hover:border-l-blue-500 cursor-pointer transition-all min-h-[110px]"
          >
            <h3 class="font-bold text-sm">Browser APIs</h3>
            <code
              class="text-xs text-foreground-muted font-mono bg-background-base px-2 py-1.5 rounded border border-border-subtle-subtle w-fit"
              >performance://browser-apis/{id}</code
            >
          </Card>
          <Card
            class="p-6 flex flex-col justify-center gap-3 border-l-4 border-l-primary hover:shadow-sm hover:-translate-y-[1px] hover:border-t-border-subtle-strong hover:border-r-border-subtle-strong hover:border-b-border-subtle-strong hover:border-l-blue-500 cursor-pointer transition-all min-h-[110px]"
          >
            <h3 class="font-bold text-sm">Recipes</h3>
            <code
              class="text-xs text-foreground-muted font-mono bg-background-base px-2 py-1.5 rounded border border-border-subtle-subtle w-fit"
              >performance://recipes/{id}</code
            >
          </Card>
          <Card
            class="p-6 flex flex-col justify-center gap-3 border-l-4 border-l-primary hover:shadow-sm hover:-translate-y-[1px] hover:border-t-border-subtle-strong hover:border-r-border-subtle-strong hover:border-b-border-subtle-strong hover:border-l-blue-500 cursor-pointer transition-all min-h-[110px]"
          >
            <h3 class="font-bold text-sm">Checklists</h3>
            <code
              class="text-xs text-foreground-muted font-mono bg-background-base px-2 py-1.5 rounded border border-border-subtle-subtle w-fit"
              >performance://checklists/{id}</code
            >
          </Card>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold tracking-tight mb-6">Prompt Explorer</h2>
        <Card class="p-6">
          <h3 class="text-lg font-bold mb-1">Review Performance</h3>
          <p class="text-xs font-mono text-primary mb-4 block">Tool: review_performance</p>
          <p class="text-foreground-muted text-sm mb-6">
            Ask the AI to review your current code for performance bottlenecks based on the lab
            guidelines.
          </p>
          <div class="mb-6">
            <span
              class="text-[10px] font-bold text-foreground-muted uppercase tracking-wider mb-2 block"
              >Example Prompt</span
            >
            <div
              class="text-sm text-foreground-primary bg-background-base p-4 rounded border border-border-subtle-subtle font-medium"
            >
              "Review this Vue component for rendering bottlenecks."
            </div>
          </div>
          <div
            class="text-xs font-mono bg-background-base p-3 rounded border border-border-subtle-subtle flex items-center justify-between"
          >
            <span class="text-foreground-muted">Arguments: { framework?: string }</span>
          </div>
        </Card>
      </section>
    </div>

    <!-- Footer -->
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import {
  CodeIcon,
  BlocksIcon,
  FileSearchIcon,
  BoxesIcon,
  ZapIcon,
  PuzzleIcon,
  GithubIcon,
  ArrowRightIcon,
  CheckIcon
} from 'lucide-vue-next'
import { mcpTools } from '@registry/mcp-tools'
import PageHeader from '../../components/patterns/PageHeader.vue'
import Badge from '../../components/ui/Badge.vue'
import Card from '../../components/ui/Card.vue'
import Accordion from '../../components/ui/Accordion.vue'
import SiteFooter from '../../components/landing/SiteFooter.vue'
import MCPStatusCard from '../../components/mcp/MCPStatusCard.vue'
import MCPArchitecture from '../../components/mcp/MCPArchitecture.vue'
import MCPPlayground from '../../components/mcp/MCPPlayground.vue'

const getToolCategory = (name: string) => {
  if (name.includes('search')) return 'Search'
  if (name.includes('review') || name.includes('diagnostic')) return 'Diagnostics'
  if (name.includes('api')) return 'Browser APIs'
  return 'Knowledge'
}

useHead({
  title: 'MCP Hub | Frontend Performance Lab',
  meta: [
    {
      name: 'description',
      content:
        'Connect your AI coding assistant to the Frontend Performance Lab using the Model Context Protocol (MCP).'
    },
    { property: 'og:title', content: 'MCP Hub | Frontend Performance Lab' },
    {
      property: 'og:description',
      content:
        'Connect your AI coding assistant to the Frontend Performance Lab using the Model Context Protocol (MCP).'
    }
  ],
  link: [{ rel: 'canonical', href: 'https://frontend-performance-lab.dev/mcp' }]
})
</script>
