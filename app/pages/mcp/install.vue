<template>
  <div class="min-h-screen bg-background-base text-foreground-primary">
    <!-- Header -->
    <section class="py-12 border-b border-border-subtle bg-background-surface/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader>
          <div class="flex flex-col items-center text-center">
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Install MCP Server
            </h1>
            <p class="text-lg text-foreground-muted max-w-2xl mx-auto mb-8">
              Connect your AI IDE directly to the Frontend Performance Lab's AST Analyzer and Knowledge Graph.
            </p>
          </div>
        </PageHeader>
      </div>
    </section>

    <div class="max-w-4xl mx-auto px-4 py-12 space-y-16">
      
      <!-- Stepper / Checklist -->
      <section>
        <h2 class="text-2xl font-bold mb-6 flex items-center gap-2">
          Installation Steps
        </h2>
        <div class="space-y-6">
          <Card class="p-6 border-l-4 border-l-primary relative overflow-hidden group">
            <div class="absolute -right-10 -top-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <CodeIcon class="w-40 h-40" />
            </div>
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
              <div class="flex-1">
                <h3 class="text-lg font-bold mb-2">Clone the Repository</h3>
                <p class="text-sm text-foreground-muted mb-4">The AST analyzer requires local file system access to parse your code.</p>
                <CodeSnippet code="git clone https://github.com/smg99/frontend-performance-lab.git" />
              </div>
            </div>
          </Card>

          <Card class="p-6 border-l-4 border-l-primary">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
              <div class="flex-1">
                <h3 class="text-lg font-bold mb-2">Install Dependencies</h3>
                <p class="text-sm text-foreground-muted mb-4">Install all required Node modules.</p>
                <CodeSnippet code="cd frontend-performance-lab && npm install" />
              </div>
            </div>
          </Card>

          <Card class="p-6 border-l-4 border-l-primary">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
              <div class="flex-1">
                <h3 class="text-lg font-bold mb-2">Configure Your IDE</h3>
                <p class="text-sm text-foreground-muted mb-4">Use the absolute path to `mcp/server.ts` when configuring your IDE.</p>
                <Tabs :tabs="ideTabs" default-value="cursor">
                  <template v-for="tab in ideTabs" :key="tab.value" #[tab.value]>
                    <CodeSnippet :code="tab.content" />
                  </template>
                </Tabs>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <!-- Verification -->
      <section class="bg-background-surface/50 border border-border-subtle rounded-xl p-8">
        <h2 class="text-2xl font-bold mb-6">Verification Checklist</h2>
        <div class="space-y-4">
          <label class="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" class="mt-1 w-4 h-4 text-primary bg-background-base border-border-strong rounded focus:ring-primary focus:ring-2" />
            <span class="text-foreground-primary group-hover:text-primary transition-colors">I have cloned the repo and run `npm install`.</span>
          </label>
          <label class="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" class="mt-1 w-4 h-4 text-primary bg-background-base border-border-strong rounded focus:ring-primary focus:ring-2" />
            <span class="text-foreground-primary group-hover:text-primary transition-colors">I replaced `/YOUR/ABSOLUTE/PATH/TO/` with the real path to the repo on my machine.</span>
          </label>
          <label class="flex items-start gap-3 cursor-pointer group">
            <input type="checkbox" class="mt-1 w-4 h-4 text-primary bg-background-base border-border-strong rounded focus:ring-primary focus:ring-2" />
            <span class="text-foreground-primary group-hover:text-primary transition-colors">My IDE shows a green "Connected" status for `frontend-performance-lab`.</span>
          </label>
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
import { useHead } from '@unhead/vue'
import { CodeIcon } from 'lucide-vue-next'
import PageHeader from '../../components/patterns/PageHeader.vue'
import Card from '../../components/ui/Card.vue'
import CodeSnippet from '../../components/common/learning/CodeSnippet.vue'
import Tabs from '../../components/ui/Tabs.vue'
import Accordion from '../../components/ui/Accordion.vue'
import SiteFooter from '../../components/landing/SiteFooter.vue'

useHead({
  title: 'Install MCP | Frontend Performance Lab',
  meta: [
    {
      name: 'description',
      content: 'Install the Frontend Performance Lab MCP server in Cursor, Claude Code, Windsurf, or VS Code.'
    }
  ]
})

const getPath = () => '/YOUR/ABSOLUTE/PATH/TO/frontend-performance-lab'

const configJson = (clientName?: string) => {
  return `{
  "mcpServers": {
    "frontend-performance-lab": {
      "command": "npx",
      "args": ["tsx", "${getPath()}/mcp/server.ts"],
      "env": {}
    }
  }
}`
}

const ideTabs = [
  {
    value: 'cursor',
    label: 'Cursor',
    content: `Navigate to Settings > Features > MCP.\nAdd a new server of type "command".\nCommand:\n\nnpx tsx ${getPath()}/mcp/server.ts`
  },
  {
    value: 'claude',
    label: 'Claude Code',
    content: `Run this command in your terminal:\n\nclaude mcp add frontend-performance-lab npx -y tsx ${getPath()}/mcp/server.ts`
  },
  {
    value: 'vscode',
    label: 'VS Code (Cline/Roo)',
    content: `Open your MCP settings JSON file and append:\n\n${configJson('vscode')}`
  },
  {
    value: 'windsurf',
    label: 'Windsurf',
    content: `Open ~/.codeium/windsurf/mcp_config.json and append:\n\n${configJson('windsurf')}`
  },
  {
    value: 'continue',
    label: 'Continue.dev',
    content: `Open ~/.continue/config.json and append to mcpServers array:\n\n{\n  "name": "frontend-performance-lab",\n  "command": "npx",\n  "args": ["tsx", "${getPath()}/mcp/server.ts"]\n}`
  },
  {
    value: 'gemini',
    label: 'Gemini CLI',
    content: `Configure via your CLI tool's JSON configuration:\n\n${configJson('gemini')}`
  }
]

const faqs = [
  {
    q: 'Why do I need to clone the repository?',
    a: 'Because this is a Local-first architecture. The AST Analyzer requires direct file-system access to parse your components. A hosted website cannot securely access your local files.'
  },
  {
    q: 'My IDE says "Disconnected". What is wrong?',
    a: 'Ensure you replaced /YOUR/ABSOLUTE/PATH/TO with the actual path on your machine. Also ensure you ran `npm install` inside the cloned directory.'
  },
  {
    q: 'Can I use this without AI?',
    a: 'Yes! The `npm run dev` dashboard provides a visual AST analyzer and an extensive learning playground without needing an AI IDE.'
  }
]
</script>
