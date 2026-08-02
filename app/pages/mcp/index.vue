<template>
  <div class="min-h-screen bg-background-base text-foreground-primary">
    <!-- Hero Section -->
    <section class="py-16 md:py-24 border-b border-border-subtle-subtle bg-background-surface/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader>
          <div class="flex flex-col items-center text-center">
            <Badge variant="primary" class="mb-6 animate-fade-in-up">AI Ready</Badge>
            <h1
              class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground-primary mb-6"
            >
              Model Context Protocol (MCP)
            </h1>
            <p
              class="text-lg md:text-xl text-foreground-muted max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Supercharge your AI coding assistant with the definitive frontend performance
              knowledge graph. The MCP server exposes deep AST diagnostics, proven recipes, and
              browser API documentation directly to your IDE.
            </p>
            <div class="flex flex-wrap justify-center gap-4">
              <NuxtLink
                to="/install"
                class="inline-flex items-center justify-center h-12 px-6 text-sm font-medium bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary-hover hover:shadow-lg transition-all"
              >
                Install Frontend Performance Lab
              </NuxtLink>
              <a
                href="https://github.com/smg99/frontend-performance-lab"
                target="_blank"
                class="inline-flex items-center justify-center h-12 px-6 text-sm font-medium bg-background-surface border border-border-subtle-strong text-foreground-primary rounded-lg shadow-sm hover:bg-background-hover hover:border-primary/50 transition-all"
              >
                View GitHub
              </a>
              <NuxtLink
                to="/tools/performance-review"
                class="inline-flex items-center justify-center h-12 px-6 text-sm font-medium bg-transparent text-foreground-primary rounded-lg hover:underline transition-all"
              >
                Open Analyzer
              </NuxtLink>
            </div>
          </div>
        </PageHeader>
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

      <!-- Live Playground -->
      <section>
        <h2 class="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
          Live Playground
          <Badge variant="secondary" class="text-[10px]">API Powered</Badge>
        </h2>
        <p class="text-foreground-muted text-sm mb-6 max-w-2xl">
          Test the shared MCP service layer directly in your browser. This playground communicates
          with the same unified core as the stdio server via the Nuxt
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
            class="p-5 flex flex-col h-full hover:border-primary transition-colors group"
          >
            <h3 class="font-mono text-primary font-bold mb-2 text-sm">{{ tool.name }}</h3>
            <p class="text-foreground-muted text-sm flex-1 mb-4">{{ tool.description }}</p>
            <div
              class="text-[10px] font-mono bg-background-base p-2 rounded border border-border-subtle-subtle overflow-x-auto text-foreground-secondary"
            >
              {{ tool.schema }}
            </div>
          </Card>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold tracking-tight mb-6">Resources Explorer</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card class="p-4 flex flex-col gap-2 border-l-4 border-l-primary">
            <h3 class="font-bold text-sm">Experiments</h3>
            <code
              class="text-xs text-foreground-muted font-mono bg-background-base px-2 py-1 rounded"
              >performance://experiments/{id}</code
            >
          </Card>
          <Card class="p-4 flex flex-col gap-2 border-l-4 border-l-primary">
            <h3 class="font-bold text-sm">Browser APIs</h3>
            <code
              class="text-xs text-foreground-muted font-mono bg-background-base px-2 py-1 rounded"
              >performance://browser-apis/{id}</code
            >
          </Card>
          <Card class="p-4 flex flex-col gap-2 border-l-4 border-l-primary">
            <h3 class="font-bold text-sm">Recipes</h3>
            <code
              class="text-xs text-foreground-muted font-mono bg-background-base px-2 py-1 rounded"
              >performance://recipes/{id}</code
            >
          </Card>
          <Card class="p-4 flex flex-col gap-2 border-l-4 border-l-primary">
            <h3 class="font-bold text-sm">Checklists</h3>
            <code
              class="text-xs text-foreground-muted font-mono bg-background-base px-2 py-1 rounded"
              >performance://checklists/{id}</code
            >
          </Card>
        </div>
      </section>

      <section>
        <h2 class="text-2xl font-bold tracking-tight mb-6">Prompt Explorer</h2>
        <Card class="p-6">
          <h3 class="font-mono text-primary font-bold mb-2">review_performance</h3>
          <p class="text-foreground-muted text-sm mb-4">
            Ask the AI to review your current code for performance bottlenecks based on the lab
            guidelines.
          </p>
          <div
            class="text-xs font-mono bg-background-base p-3 rounded border border-border-subtle-subtle"
          >
            Arguments: { framework?: string }
          </div>
        </Card>
      </section>

      <!-- FAQ -->
      <section class="max-w-3xl mx-auto">
        <h2 class="text-2xl font-bold tracking-tight mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div class="space-y-4">
          <Accordion v-for="(item, i) in faqs" :key="i" :title="item.q">
            <p class="text-foreground-muted text-sm leading-relaxed">{{ item.a }}</p>
          </Accordion>
        </div>
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
  ArrowRightIcon
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

const faqs = [
  {
    q: 'What is MCP?',
    a: 'The Model Context Protocol (MCP) is an open standard that enables AI models to securely interact with local tools and data sources. It allows AI assistants like Claude, Cursor, and Windsurf to understand your specific codebase and domain knowledge.'
  },
  {
    q: 'How is this different from REST?',
    a: 'While REST is designed for client-server web communication, MCP is specifically optimized for LLMs. It standardizes how AI agents discover tools, read resources, and trigger prompts, removing the need for custom API glue code.'
  },
  {
    q: 'Which IDEs are supported?',
    a: 'Any IDE or agent that supports the MCP standard. This currently includes Cursor, VS Code (via extensions like Cline), Windsurf, Claude Code CLI, and Continue.dev.'
  },
  {
    q: 'Can I extend this server?',
    a: 'Absolutely. The architecture is modular. You can add new tools in `shared/registry/mcp-tools.ts` and implement the logic in `shared/mcp/core.ts`.'
  },
  {
    q: 'How do I build my own tools?',
    a: 'Define the tool schema in the registry, then add an async function handler to `mcpCore` in `shared/mcp/core.ts`. It will automatically be available in both the Nuxt API Playground and the stdio server.'
  }
]
</script>
