import { executeMCPTool } from '../../../shared/mcp/core'

export default defineEventHandler(async () => {
  try {
    const diagnostics = await executeMCPTool('system_diagnostics')
    // Return parsed JSON of the text for easier usage on client
    if (diagnostics.content && diagnostics.content[0] && diagnostics.content[0].type === 'text') {
      return JSON.parse(diagnostics.content[0].text)
    }
    return diagnostics
  } catch (err: unknown) {
    throw createError({
      statusCode: 500,
      statusMessage: err instanceof Error ? err.message : 'Failed to fetch status'
    })
  }
})
