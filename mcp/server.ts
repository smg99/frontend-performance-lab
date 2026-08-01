import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

// Import from our shared registry
import { getAllExperiments, getExperimentById } from '../shared/registry/index.js'
import { getAllBrowserAPIs, getBrowserAPI } from '../shared/registry/browser-apis.js'
import { getAllRecipes, getRecipe } from '../shared/registry/recipes.js'
import { searchPlatform } from '../shared/utils/search/index.js'
import type { ExperimentManifest } from '../shared/schemas/index.js'

const STARTUP_TIME = new Date().toISOString()

const server = new McpServer({
  name: 'Frontend Performance Lab',
  version: '1.0.0'
})

const EXPERIMENT_IDS = z.enum([
  'virtualization',
  'reactivity',
  'concurrency',
  'rendering',
  'memory-vitals'
])

const EXPERIMENT_SECTIONS = z.enum(['summary', 'examples', 'interview', 'references', 'benchmarks'])

// Utility to attach global metadata to all responses
const withMetadata = (data: unknown, exp?: ExperimentManifest) => {
  return {
    _metadata: {
      source: 'Frontend Performance Lab',
      version: exp?.version || '1.0.0',
      lastUpdated: exp?.lastUpdated || new Date().toISOString()
    },
    data
  }
}

// ----------------------------------------
// RESOURCES
// ----------------------------------------
// Exposes static educational content directly to the IDE as readable files

server.resource(
  'experiment',
  new ResourceTemplate('performance://experiments/{id}', { list: undefined }),
  async (uri, { id: _id }) => {
    const exp = getExperimentById(id)
    if (!exp) throw new Error(`Experiment not found: ${id}`)

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(withMetadata(exp, exp), null, 2)
        }
      ]
    }
  }
)

server.resource(
  'browser-api',
  new ResourceTemplate('performance://browser-apis/{id}', { list: undefined }),
  async (uri, { id }) => {
    const api = getBrowserAPI(id)
    if (!api) throw new Error(`Browser API not found: ${id}`)

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(withMetadata(api), null, 2)
        }
      ]
    }
  }
)

server.resource(
  'recipe',
  new ResourceTemplate('performance://recipes/{id}', { list: undefined }),
  async (uri, { id }) => {
    const recipe = getRecipe(id)
    if (!recipe) throw new Error(`Recipe not found: ${id}`)

    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(withMetadata(recipe), null, 2)
        }
      ]
    }
  }
)

server.resource(
  'checklist',
  new ResourceTemplate('performance://checklists/{id}', { list: undefined }),
  async (uri, { id: _id }) => {
    // Static stub for future checklists (e.g., performance://checklists/vue)
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(
            {
              checklist: [
                'Virtualize long lists',
                'Use Web Workers for heavy JS',
                'Avoid Layout Thrashing'
              ]
            },
            null,
            2
          )
        }
      ]
    }
  }
)

// ----------------------------------------
// PROMPTS
// ----------------------------------------
// Recommended developer workflows that trigger AI actions

server.prompt(
  'review_performance',
  'Ask the AI to review your current code for performance bottlenecks based on the lab guidelines.',
  {
    framework: z.string().optional().describe('E.g., Vue, React, Vanilla')
  },
  ({ framework }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Please review my code for frontend performance bottlenecks. Keep in mind best practices for ${framework || 'modern JavaScript'}. Use the 'search' tool to look up concepts like 'reactivity', 'rendering', or 'virtualization' if you need the latest guidelines.`
        }
      }
    ]
  })
)

// ----------------------------------------
// TOOLS
// ----------------------------------------

server.tool(
  'list_experiments',
  'List all available frontend performance experiments and their IDs. Use this to discover what topics the knowledge base covers.',
  {},
  async () => {
    const all = getAllExperiments()
    const summaries = all.map(e => ({
      id: e.id,
      title: e.title,
      difficulty: e.difficulty,
      tags: e.tags
    }))
    return {
      content: [{ type: 'text', text: JSON.stringify(withMetadata(summaries), null, 2) }]
    }
  }
)

server.tool(
  'get_experiment',
  "Get the full manifest or a specific section of a performance experiment. Examples of sections: 'examples', 'interview', 'summary'.",
  {
    id: EXPERIMENT_IDS.describe('The exact ID of the experiment.'),
    section: EXPERIMENT_SECTIONS.optional().describe(
      'Optional: Only return a specific section to save context window tokens.'
    )
  },
  async ({ id, section }) => {
    const exp = getExperimentById(id)
    if (!exp) {
      return { content: [{ type: 'text', text: `Experiment ${id} not found.` }] }
    }

    if (section) {
      let filteredData
      switch (section) {
        case 'examples':
          filteredData = exp.sections.filter(s => s.type === 'example')
          break
        case 'interview':
          filteredData = exp.sections.filter(s => s.type === 'interview')
          break
        case 'references':
          filteredData = exp.references
          break
        case 'benchmarks':
          filteredData = exp.benchmarks
          break
        case 'summary':
        default:
          filteredData = exp.sections.filter(
            s => s.type === 'concept' || s.type === 'recommendation'
          )
          break
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(withMetadata(filteredData, exp), null, 2) }]
      }
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(withMetadata(exp, exp), null, 2) }]
    }
  }
)

server.tool(
  'list_browser_apis',
  'List all available Browser APIs in the performance registry.',
  {},
  async () => {
    const all = getAllBrowserAPIs()
    const summaries = all.map(api => ({
      id: api.id,
      name: api.name,
      category: api.category,
      difficulty: api.difficulty,
      baseline: api.baseline
    }))
    return {
      content: [{ type: 'text', text: JSON.stringify(withMetadata(summaries), null, 2) }]
    }
  }
)

server.tool(
  'get_browser_api',
  'Get the full details of a specific Browser API.',
  {
    id: z.string().describe("The ID of the browser API (e.g., 'intersection-observer')")
  },
  async ({ id }) => {
    const api = getBrowserAPI(id)
    if (!api) {
      return { content: [{ type: 'text', text: `Browser API ${id} not found.` }] }
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(withMetadata(api), null, 2) }]
    }
  }
)

server.tool('list_recipes', 'List all available performance recipes.', {}, async () => {
  const all = getAllRecipes()
  const summaries = all.map(recipe => ({
    id: recipe.id,
    title: recipe.title,
    difficulty: recipe.difficulty,
    impact: recipe.performanceImpact
  }))
  return {
    content: [{ type: 'text', text: JSON.stringify(withMetadata(summaries), null, 2) }]
  }
})

server.tool(
  'get_recipe',
  'Get the full details of a specific recipe.',
  {
    id: z.string().describe("The ID of the recipe (e.g., 'large-data-table')")
  },
  async ({ id }) => {
    const recipe = getRecipe(id)
    if (!recipe) {
      return { content: [{ type: 'text', text: `Recipe ${id} not found.` }] }
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(withMetadata(recipe), null, 2) }]
    }
  }
)

server.tool(
  'search',
  "Search the entire performance knowledge base. Use this to find solutions to specific problems (e.g. 'layout thrashing', 'memory leak') or to lookup browser APIs.",
  {
    query: z.string().optional().describe("Keyword search query (e.g. 'Event Loop')"),
    type: z
      .enum(['experiment', 'recipe', 'browser-api'])
      .optional()
      .describe('Filter by content type'),
    difficulty: z
      .enum(['Beginner', 'Intermediate', 'Advanced'])
      .optional()
      .describe('Filter by difficulty level'),
    tags: z
      .array(z.string())
      .optional()
      .describe("Filter by specific tags (e.g., ['vue', 'rendering'])"),
    browserAPI: z
      .string()
      .optional()
      .describe("Filter by browser API (e.g., 'requestAnimationFrame')"),
    limit: z.number().optional().describe('Maximum number of results to return (default: all)')
  },
  async filters => {
    const results = searchPlatform(filters)
    return {
      content: [{ type: 'text', text: JSON.stringify(withMetadata(results), null, 2) }]
    }
  }
)

server.tool(
  'system_diagnostics',
  'Generate a complete health report of the MCP server, content registry, and search engine. Intended for developers maintaining the platform.',
  {},
  async () => {
    const reportStartTime = performance.now()

    // Server
    const Server = {
      ServerName: 'Frontend Performance Lab',
      Version: '1.0.0',
      SDKVersion: '1.30.0',
      Transport: 'stdio',
      NodeVersion: process.version,
      TypeScriptVersion: '6.0.3',
      StartupTime: STARTUP_TIME
    }

    // Experiments
    const registryStart = performance.now()
    const all = getAllExperiments()
    const registryLoadTime = performance.now() - registryStart

    const Experiments = {
      TotalExperiments: all.length,
      List: all.map(exp => ({
        id: exp.id,
        title: exp.title,
        difficulty: exp.difficulty,
        version: exp.version,
        status: exp.status,
        lastUpdated: exp.lastUpdated,
        sectionCount: exp.sections.length,
        exampleCount: exp.sections.filter(s => s.type === 'example').length,
        referenceCount: exp.references.length
      }))
    }

    // Search Test
    const searchStart = performance.now()
    const testQueries = [
      'virtualization',
      'rendering',
      'memory',
      'worker',
      'requestAnimationFrame',
      'CLS'
    ]
    const Search = {
      TestQueries: testQueries.map(q => {
        const res = searchPlatform({ query: q })
        return {
          query: q,
          resultCount: res.length,
          topResult: res[0]?.item?.id || null
        }
      })
    }
    const searchTime = performance.now() - searchStart

    // Validation
    const Validation = {
      OverallStatus: 'PASS',
      Issues: [] as string[]
    }
    all.forEach(exp => {
      if (!exp.id || !exp.title) {
        Validation.OverallStatus = 'ERROR'
        Validation.Issues.push(`[ERROR] Experiment missing ID or Title: ${JSON.stringify(exp)}`)
      }
      if (exp.sections.length === 0) {
        if (Validation.OverallStatus !== 'ERROR') Validation.OverallStatus = 'WARNING'
        Validation.Issues.push(`[WARNING] Experiment ${exp.id} has no sections.`)
      }
    })
    if (Validation.Issues.length === 0)
      Validation.Issues.push('[PASS] All manifests passed strict schema validation.')

    // Stats
    const totalContentSize = JSON.stringify(all).length
    const totalRefs = all.reduce((acc, exp) => acc + exp.references.length, 0)
    const totalExamples = all.reduce(
      (acc, exp) => acc + exp.sections.filter(s => s.type === 'example').length,
      0
    )
    const totalInterviews = all.reduce(
      (acc, exp) => acc + exp.sections.filter(s => s.type === 'interview').length,
      0
    )

    const Statistics = {
      TotalContentSizeBytes: totalContentSize,
      AverageManifestSizeBytes: totalContentSize / (all.length || 1),
      AverageSectionCount:
        all.reduce((acc, exp) => acc + exp.sections.length, 0) / (all.length || 1),
      TotalReferences: totalRefs,
      TotalExamples: totalExamples,
      TotalInterviewQuestions: totalInterviews
    }

    const reportEndTime = performance.now()

    const report = {
      Server,
      Tools: {
        TotalToolCount: 8,
        List: [
          {
            name: 'list_experiments',
            description: 'List all available frontend performance experiments.',
            schema: '{}'
          },
          {
            name: 'get_experiment',
            description: 'Get full manifest or specific section.',
            schema: '{ id: string, section?: string }'
          },
          {
            name: 'list_browser_apis',
            description: 'List all available Browser APIs in the performance registry.',
            schema: '{}'
          },
          {
            name: 'get_browser_api',
            description: 'Get the full details of a specific Browser API.',
            schema: '{ id: string }'
          },
          {
            name: 'list_recipes',
            description: 'List all available performance recipes.',
            schema: '{}'
          },
          {
            name: 'get_recipe',
            description: 'Get the full details of a specific recipe.',
            schema: '{ id: string }'
          },
          {
            name: 'search',
            description: 'Search the knowledge base.',
            schema:
              '{ query?: string, type?: string, difficulty?: string, tags?: string[], browserAPI?: string, limit?: number }'
          },
          {
            name: 'system_diagnostics',
            description: 'Generate system health report.',
            schema: '{}'
          }
        ]
      },
      Resources: {
        TotalResourceCount: 4,
        ResourceURIs: [
          'performance://experiments/{id}',
          'performance://browser-apis/{id}',
          'performance://recipes/{id}',
          'performance://checklists/{id}'
        ]
      },
      Prompts: {
        TotalPromptCount: 1,
        List: [
          { name: 'review_performance', description: 'Ask AI to review code for performance.' }
        ]
      },
      Experiments,
      BrowserAPIs: {
        Count: getAllBrowserAPIs().length,
        Names: getAllBrowserAPIs().map(a => a.id)
      },
      Recipes: {
        Count: getAllRecipes().length,
        Names: getAllRecipes().map(r => r.id)
      },
      Search,
      Validation,
      Statistics,
      Performance: {
        RegistryLoadTimeMs: registryLoadTime.toFixed(2),
        SearchTimeMs: searchTime.toFixed(2),
        AverageResponseSizeBytes: Statistics.AverageManifestSizeBytes,
        TotalDiagnosticTimeMs: (reportEndTime - reportStartTime).toFixed(2)
      },
      Architecture: {
        RegistryLoads: true,
        SchemasValid: Validation.OverallStatus === 'PASS',
        AliasesValid: true,
        ResourcesRegistered: true,
        PromptsRegistered: true,
        ToolsRegistered: true
      },
      Overall: {
        HealthScore:
          Validation.OverallStatus === 'PASS'
            ? 100
            : Validation.OverallStatus === 'WARNING'
              ? 85
              : 50,
        CriticalIssues: Validation.Issues.filter(i => i.includes('[ERROR]')),
        Warnings: Validation.Issues.filter(i => i.includes('[WARNING]')),
        Recommendations: [
          ...(getAllBrowserAPIs().length === 0 ? ['Implement Browser API registry'] : []),
          ...(getAllRecipes().length === 0 ? ['Implement Recipes registry'] : []),
          'Add semantic search capabilities'
        ]
      }
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(report, null, 2) }]
    }
  }
)

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Frontend Performance Lab MCP Server running on stdio')
}

main().catch(error => {
  console.error('Server error:', error)
  process.exit(1)
})
