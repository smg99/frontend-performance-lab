import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

import { getExperimentById } from '../shared/registry/index.js'
import { getBrowserAPI } from '../shared/registry/browser-apis.js'
import { getRecipe } from '../shared/registry/recipes.js'
import { mcpCore } from '../shared/mcp/core.js'

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
    return await mcpCore.list_experiments()
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
  async args => {
    return await mcpCore.get_experiment(args)
  }
)

server.tool(
  'list_browser_apis',
  'List all available Browser APIs in the performance registry.',
  {},
  async () => {
    return await mcpCore.list_browser_apis()
  }
)

server.tool(
  'get_browser_api',
  'Get the full details of a specific Browser API.',
  {
    id: z.string().describe("The ID of the browser API (e.g., 'intersection-observer')")
  },
  async args => {
    return await mcpCore.get_browser_api(args)
  }
)

server.tool('list_recipes', 'List all available performance recipes.', {}, async () => {
  return await mcpCore.list_recipes()
})

server.tool(
  'get_recipe',
  'Get the full details of a specific recipe.',
  {
    id: z.string().describe("The ID of the recipe (e.g., 'large-data-table')")
  },
  async args => {
    return await mcpCore.get_recipe(args)
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
    return await mcpCore.search(filters)
  }
)

server.tool(
  'system_diagnostics',
  'Generate a complete health report of the MCP server, content registry, and search engine. Intended for developers maintaining the platform.',
  {},
  async () => {
    return await mcpCore.system_diagnostics()
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
