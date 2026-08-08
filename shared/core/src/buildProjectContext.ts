// shared/core/src/buildProjectContext.ts
import { promises as fs } from 'fs'
import type { DetectionResult } from './detectFramework'
import { extname } from 'path'
import type { AnalyzerContext } from '../../schemas/analyzer'
import { detectFramework } from './detectFramework'

/**
 * Asynchronously build an array of AnalyzerContext objects from a list of absolute file paths.
 * Returns a Promise of AnalyzerContext[].
 */
export async function buildProjectContext(filePaths: string[]): Promise<AnalyzerContext[]> {
  const contexts: AnalyzerContext[] = []
  for (const filePath of filePaths) {
    let code: string
    try {
      code = await fs.readFile(filePath, 'utf8')
    } catch {
      // If a file cannot be read, skip it.
      continue
    }
    const language = extname(filePath).slice(1) as AnalyzerContext['language']
    const detection: DetectionResult = detectFramework({
      filename: filePath,
      code,
      language,
      framework: ''
    })
    const framework = detection.framework
    contexts.push({ filename: filePath, code, language, framework })
  }
  return contexts
}
