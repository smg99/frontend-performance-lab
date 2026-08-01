import { defineEventHandler, readBody } from 'h3'
import { getConfiguredEngine } from '../../shared/utils/analyzer/rules/index'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Expecting { files: [{ filename, code, language, framework }] }
  if (!body || !body.files || !Array.isArray(body.files)) {
    return { error: 'Invalid payload. Expected { files: AnalyzerContext[] }' }
  }

  const engine = getConfiguredEngine()
  
  try {
    const report = engine.analyze(body.files)
    return report
  } catch (err: any) {
    console.error('Analyzer error:', err)
    return { error: 'Analysis failed.', details: err.message }
  }
})
