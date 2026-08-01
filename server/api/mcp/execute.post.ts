import { executeMCPTool } from '../../../shared/mcp/core'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const { tool, arguments: args } = body

  if (!tool) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tool name is required'
    })
  }

  try {
    const result = await executeMCPTool(tool, args)
    return result
  } catch (err: unknown) {
    throw createError({
      statusCode: 500,
      statusMessage: err instanceof Error ? err.message : 'Internal Server Error'
    })
  }
})
