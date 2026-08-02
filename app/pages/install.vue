<template>
  <div class="min-h-screen bg-background-base text-foreground-primary">
    <!-- Header -->
    <section class="py-16 md:py-24 border-b border-border-subtle-subtle bg-background-surface/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col items-center text-center">
          <div class="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="secondary">CLI First</Badge>
            <Badge variant="primary">MCP Ready</Badge>
            <Badge variant="secondary">Cursor</Badge>
            <Badge variant="secondary">Claude</Badge>
            <Badge variant="secondary">VS Code</Badge>
            <Badge variant="outline">Open Source</Badge>
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Install Frontend Performance Lab
          </h1>
          <p
            class="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Bring AI-powered frontend performance analysis directly into Cursor, Claude, VS Code and
            every MCP-compatible IDE. Ready in under 2 minutes.
          </p>
          <div class="w-full max-w-md mx-auto mb-8">
            <CodeSnippet code="npm install -g @frontend-performance-lab/cli" />
          </div>
          <div class="flex flex-wrap justify-center gap-4">
            <button
              class="inline-flex items-center justify-center h-12 px-6 text-sm font-medium bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-primary-hover hover:shadow-lg transition-all"
              @click="copyInstall"
            >
              <CopyIcon class="w-4 h-4 mr-2" /> Copy Install Command
            </button>
            <a
              href="https://github.com/smg99/frontend-performance-lab"
              target="_blank"
              class="inline-flex items-center justify-center h-12 px-6 text-sm font-medium bg-background-surface border border-border-subtle-strong text-foreground-primary rounded-lg shadow-sm hover:bg-background-hover hover:border-primary/50 transition-all"
            >
              ⭐ Star on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 py-12 space-y-16">
      <!-- Stepper / Checklist -->
      <section>
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">Installation Steps</h2>
        <div class="space-y-6">
          <Card class="p-6 border-l-4 border-l-primary relative overflow-hidden group">
            <div
              class="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity"
            >
              <CodeIcon class="w-40 h-40" />
            </div>
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold"
              >
                1
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold mb-2">Install the CLI</h3>
                <p class="text-sm text-foreground-muted mb-4">
                  Install the standalone package globally using npm.
                </p>
                <CodeSnippet code="npm install -g @frontend-performance-lab/cli" />
              </div>
            </div>
          </Card>

          <Card class="p-6 border-l-4 border-l-primary relative overflow-hidden group">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold"
              >
                2
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold mb-2">Run the Setup Wizard</h3>
                <p class="text-sm text-foreground-muted mb-4">
                  Run the interactive wizard. It will detect your installed IDEs (Cursor, Claude
                  Desktop, VS Code, Windsurf) and automatically configure the MCP server.
                </p>
                <CodeSnippet code="fpl setup" />
              </div>
            </div>
          </Card>

          <Card class="p-6 border-l-4 border-l-primary">
            <div class="flex items-start gap-4">
              <div
                class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold"
              >
                3
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold mb-2">Restart Your IDE</h3>
                <p class="text-sm text-foreground-muted">
                  Restart your IDE so the new MCP settings take effect. You're ready to go!
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <!-- Verification -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Verify Installation</h2>
        <Card class="p-6 border-l-4 border-l-success">
          <p class="text-sm text-foreground-muted mb-4">
            Run the doctor command to verify everything is working.
          </p>
          <div class="mb-4">
            <CodeSnippet code="fpl doctor" />
          </div>
          <div
            class="bg-background-base p-4 rounded border border-border-subtle-subtle font-mono text-sm space-y-2"
          >
            <div class="text-success flex items-center gap-2">
              <CheckIcon class="w-4 h-4" /> CLI Installed
            </div>
            <div class="text-success flex items-center gap-2">
              <CheckIcon class="w-4 h-4" /> Node Compatible
            </div>
            <div class="text-success flex items-center gap-2">
              <CheckIcon class="w-4 h-4" /> MCP Ready
            </div>
            <div class="text-success flex items-center gap-2">
              <CheckIcon class="w-4 h-4" /> Knowledge Graph Loaded
            </div>
            <div class="text-success flex items-center gap-2">
              <CheckIcon class="w-4 h-4" /> Analyzer Ready
            </div>
          </div>
        </Card>
      </section>

      <!-- Advanced Manual Configuration -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Advanced Manual Configuration</h2>
        <div class="space-y-4">
          <Accordion title="Manual IDE Configuration (JSON)">
            <p class="text-sm text-foreground-muted mb-4">
              If you prefer not to use the automated <code>fpl setup</code> wizard, you can manually
              configure your IDE to point to the global npx package.
            </p>
            <Tabs :tabs="ideTabs" default-value="cursor">
              <template v-for="tab in ideTabs" :key="tab.value" #[tab.value]>
                <CodeSnippet :code="tab.content" />
              </template>
            </Tabs>
          </Accordion>
        </div>
      </section>

      <!-- FAQ -->
      <section>
        <h2 class="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div class="space-y-4">
          <Accordion v-for="(item, i) in faqs" :key="i" :title="item.q">
            <p class="text-foreground-muted text-sm leading-relaxed">{{ item.a }}</p>
          </Accordion>
        </div>
      </section>
    </div>
    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
import { CodeIcon, CopyIcon, CheckIcon } from 'lucide-vue-next'

import Card from '../components/ui/Card.vue'
import Badge from '../components/ui/Badge.vue'
import CodeSnippet from '../components/common/learning/CodeSnippet.vue'
import Tabs from '../components/ui/Tabs.vue'
import Accordion from '../components/ui/Accordion.vue'
import SiteFooter from '../components/landing/SiteFooter.vue'

useHead({
  title: 'Install Frontend Performance Lab',
  meta: [
    {
      name: 'description',
      content:
        'Install the Frontend Performance Lab CLI and MCP server in Cursor, Claude Code, Windsurf, or VS Code.'
    }
  ]
})

const copyInstall = async () => {
  await navigator.clipboard.writeText('npm install -g @frontend-performance-lab/cli')
}

const configJson = () => {
  return `{
  "mcpServers": {
    "frontend-performance-lab": {
      "command": "npx",
      "args": ["-y", "@frontend-performance-lab/cli", "mcp"],
      "env": {}
    }
  }
}`
}

const ideTabs = [
  {
    value: 'cursor',
    label: 'Cursor',
    content: `Navigate to Settings > Features > MCP.\nAdd a new server of type "command".\nCommand:\n\nnpx -y @frontend-performance-lab/cli mcp`
  },
  {
    value: 'claude',
    label: 'Claude Code',
    content: `Run this command in your terminal:\n\nclaude mcp add frontend-performance-lab npx -y @frontend-performance-lab/cli mcp`
  },
  {
    value: 'vscode',
    label: 'VS Code (Cline/Roo)',
    content: `Open your MCP settings JSON file and append:\n\n${configJson()}`
  },
  {
    value: 'windsurf',
    label: 'Windsurf',
    content: `Open ~/.codeium/windsurf/mcp_config.json and append:\n\n${configJson()}`
  },
  {
    value: 'continue',
    label: 'Continue.dev',
    content: `Open ~/.continue/config.json and append to mcpServers array:\n\n{\n  "name": "frontend-performance-lab",\n  "command": "npx",\n  "args": ["-y", "@frontend-performance-lab/cli", "mcp"]\n}`
  },
  {
    value: 'gemini',
    label: 'Gemini CLI',
    content: `Configure via your CLI tool's JSON configuration:\n\n${configJson()}`
  }
]

const faqs = [
  {
    q: 'Do I need to clone the repository?',
    a: 'No. The CLI installs everything you need globally. You only need to clone the repository if you plan to contribute to the core analyzer rules or MCP server.'
  },
  {
    q: 'My IDE says "Disconnected". What is wrong?',
    a: 'Ensure you restarted your IDE after running `fpl setup`. You can also run `fpl doctor` to verify your environment health.'
  },
  {
    q: 'Can I use this without AI?',
    a: 'Yes! The `fpl` CLI includes an AST analyzer that works independently of the MCP server.'
  }
]
</script>
