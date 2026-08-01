export const mcpTools = [
  {
    id: 'list_experiments',
    name: 'list_experiments',
    description: 'List all available frontend performance experiments.',
    schema: '{}'
  },
  {
    id: 'get_experiment',
    name: 'get_experiment',
    description: 'Get full manifest or specific section.',
    schema: '{ id: string, section?: string }'
  },
  {
    id: 'list_browser_apis',
    name: 'list_browser_apis',
    description: 'List all available Browser APIs in the performance registry.',
    schema: '{}'
  },
  {
    id: 'get_browser_api',
    name: 'get_browser_api',
    description: 'Get the full details of a specific Browser API.',
    schema: '{ id: string }'
  },
  {
    id: 'list_recipes',
    name: 'list_recipes',
    description: 'List all available performance recipes.',
    schema: '{}'
  },
  {
    id: 'get_recipe',
    name: 'get_recipe',
    description: 'Get the full details of a specific recipe.',
    schema: '{ id: string }'
  },
  {
    id: 'search',
    name: 'search',
    description: 'Search the knowledge base.',
    schema:
      '{ query?: string, type?: string, difficulty?: string, tags?: string[], browserAPI?: string, limit?: number }'
  },
  {
    id: 'system_diagnostics',
    name: 'system_diagnostics',
    description: 'Generate system health report.',
    schema: '{}'
  }
]
