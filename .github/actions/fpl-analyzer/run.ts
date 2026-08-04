import { resolve, extname, join } from 'path'
import { readFileSync, statSync, readdirSync, existsSync } from 'fs'
import { getConfiguredEngine } from '../../../shared/utils/analyzer/rules/index'
import type { AnalyzerContext } from '../../../shared/schemas/analyzer'

const SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']

function walkDir(dir: string, fileList: string[] = []): string[] {
  const files = readdirSync(dir)
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === '.fpl' || file === 'dist') continue

    const filePath = join(dir, file)
    let stat
    try {
      stat = statSync(filePath)
    } catch {
      continue
    }

    if (stat.isDirectory()) {
      walkDir(filePath, fileList)
    } else if (stat.isFile() && SUPPORTED_EXTENSIONS.includes(extname(filePath))) {
      fileList.push(filePath)
    }
  }
  return fileList
}

function detectFramework(filePath: string, content: string): 'react' | 'vue' | 'js' | 'svelte' {
  if (filePath.endsWith('.vue')) return 'vue'
  if (filePath.endsWith('.svelte')) return 'svelte'
  if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) return 'react'
  if (content.includes('import React') || content.includes("from 'react'")) return 'react'
  if (content.includes("from 'vue'")) return 'vue'
  if (content.includes("from 'svelte'")) return 'svelte'
  return 'js'
}

function detectLanguage(filePath: string): 'js' | 'jsx' | 'ts' | 'tsx' | 'vue' | 'svelte' {
  const ext = extname(filePath).slice(1)
  return ext as 'js' | 'jsx' | 'ts' | 'tsx' | 'vue' | 'svelte'
}

async function run() {
  const targetArg = process.argv[2] || '.'
  const targetPath = resolve(process.cwd(), targetArg)

  if (!existsSync(targetPath)) {
    console.error(`Target path does not exist: ${targetPath}`)
    process.exit(1)
  }

  const stat = statSync(targetPath)
  let filesToAnalyze: string[] = []

  if (stat.isDirectory()) {
    filesToAnalyze = walkDir(targetPath)
  } else if (stat.isFile() && SUPPORTED_EXTENSIONS.includes(extname(targetPath))) {
    filesToAnalyze = [targetPath]
  } else {
    console.error(`Unsupported target. Please provide a directory or a supported file.`)
    process.exit(1)
  }

  if (filesToAnalyze.length === 0) {
    console.log('No supported files found to analyze.')
    return
  }

  const engine = getConfiguredEngine()
  const contexts: AnalyzerContext[] = []

  for (const filePath of filesToAnalyze) {
    try {
      const content = readFileSync(filePath, 'utf8')
      contexts.push({
        filename: filePath,
        code: content,
        language: detectLanguage(filePath),
        framework: detectFramework(filePath, content)
      })
    } catch (e) {
      console.warn(`Failed to read file ${filePath}: ${e}`)
    }
  }

  const report = engine.analyze(contexts)

  if (report.issues.length === 0) {
    console.log('No performance issues detected! 🎉')
    return
  }

  // Map issues to GitHub Action Annotations
  // Format: ::error file={name},line={line},endLine={endLine},title={title}::{message}
  let hasCritical = false

  report.issues.forEach(issue => {
    const isError = issue.severity === 'Critical' || issue.severity === 'High'
    const command = isError ? 'error' : 'warning'

    if (isError) hasCritical = true

    const title = `[FPL ${issue.severity}] ${issue.title}`
    const message = `${issue.description}\nFix: ${issue.fix}`
    const file = issue.filename || ''

    // Fallback to line 1 if no line numbers
    const lines = issue.lineNumbers && issue.lineNumbers.length > 0 ? issue.lineNumbers : [1]

    lines.forEach(line => {
      // Escape newlines in message for GitHub Actions
      const escapedMessage = message.replace(/\n/g, '%0A').replace(/\r/g, '%0D')
      console.log(`::${command} file=${file},line=${line},title=${title}::${escapedMessage}`)
    })
  })

  // Set workflow output for summary using the modern GITHUB_OUTPUT env file
  const outputFile = process.env.GITHUB_OUTPUT
  if (outputFile) {
    const { appendFileSync } = await import('fs')
    appendFileSync(outputFile, `issues_count=${report.issues.length}\n`)
    appendFileSync(outputFile, `overall_score=${report.overallScore}\n`)
  }

  if (hasCritical) {
    console.log('Critical or High severity performance issues detected. Failing CI build.')
    process.exit(1) // Fail the GitHub Action step
  }
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
