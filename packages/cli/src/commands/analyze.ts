import { defineCommand } from 'citty'
import consola from 'consola'
import { resolve, extname, join, relative } from 'path'
import { readFileSync, statSync, readdirSync, existsSync } from 'fs'
import { loadConfig } from 'c12'
import { getConfiguredEngine } from '../../../../shared/utils/analyzer/rules/index'
import type { AnalyzerContext } from '../../../../shared/schemas/analyzer'

const SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.vue']

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

function detectFramework(filePath: string, content: string): 'react' | 'vue' | 'js' {
  if (filePath.endsWith('.vue')) return 'vue'
  if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) return 'react'
  if (content.includes('import React') || content.includes('from \'react\'')) return 'react'
  if (content.includes('from \'vue\'')) return 'vue'
  return 'js'
}

function detectLanguage(filePath: string): 'js' | 'jsx' | 'ts' | 'tsx' | 'vue' {
  const ext = extname(filePath).slice(1)
  return ext as 'js' | 'jsx' | 'ts' | 'tsx' | 'vue'
}

export default defineCommand({
  meta: {
    name: 'analyze',
    description: 'Analyze files or folders for performance issues'
  },
  args: {
    target: {
      type: 'positional',
      description: 'Target file or directory to analyze',
      required: false
    }
  },
  async run({ args }) {
    const targetPath = resolve(process.cwd(), args.target || '.')
    
    if (!existsSync(targetPath)) {
      consola.error(`Target path does not exist: ${targetPath}`)
      process.exit(1)
    }

    // Load FPL Config
    const { config } = await loadConfig({
      name: 'fpl',
      cwd: process.cwd(),
      defaultConfig: { plugins: [] }
    })

    const stat = statSync(targetPath)
    let filesToAnalyze: string[] = []

    if (stat.isDirectory()) {
      consola.start(`Scanning directory: ${targetPath}`)
      filesToAnalyze = walkDir(targetPath)
    } else if (stat.isFile() && SUPPORTED_EXTENSIONS.includes(extname(targetPath))) {
      filesToAnalyze = [targetPath]
    } else {
      consola.error(`Unsupported target. Please provide a directory or a supported file (${SUPPORTED_EXTENSIONS.join(', ')}).`)
      process.exit(1)
    }

    if (filesToAnalyze.length === 0) {
      consola.warn('No supported files found to analyze.')
      return
    }

    consola.info(`Found ${filesToAnalyze.length} file(s). Running Performance Analyzer...`)
    
    const engine = getConfiguredEngine()
    
    if (config?.plugins && Array.isArray(config.plugins)) {
      for (const plugin of config.plugins) {
        engine.registerPlugin(plugin)
      }
      consola.info(`Loaded ${config.plugins.length} external plugins from fpl.config.ts`)
    }

    const contexts: AnalyzerContext[] = []

    for (const filePath of filesToAnalyze) {
      try {
        const content = readFileSync(filePath, 'utf8')
        contexts.push({
          code: content,
          language: detectLanguage(filePath),
          framework: detectFramework(filePath, content)
        })
      } catch (e) {
        consola.warn(`Failed to read file ${filePath}: ${e}`)
      }
    }

    const report = engine.analyze(contexts)

    console.log('\n--- Frontend Performance Lab Report ---\n')
    
    // Print Score
    const scoreColor = report.performanceScore >= 90 ? 'green' : report.performanceScore >= 70 ? 'yellow' : 'red'
    consola.box(`Overall Grade: ${report.overallScore} (${report.performanceScore}/100)`)
    
    // Print Estimates
    consola.info(`Estimated Impact: ${report.estimates.performanceGain} | TTR: ${report.estimates.timeToFix}`)
    
    console.log('\n')

    if (report.issues.length === 0) {
      consola.success('No performance issues detected! 🎉')
      return
    }

    // Print Issues
    consola.error(`Found ${report.issues.length} issue(s) across ${report.analyzedFiles} file(s):\n`)
    
    report.issues.forEach((issue, index) => {
      const severityStr = issue.severity === 'Critical' || issue.severity === 'High' ? '🔴' : issue.severity === 'Warning' ? '🟡' : '🔵'
      console.log(`${index + 1}. ${severityStr} [${issue.ruleId}] ${issue.title}`)
      console.log(`   Description: ${issue.description}`)
      console.log(`   Fix: ${issue.fix}`)
      if (issue.lineNumbers && issue.lineNumbers.length > 0) {
        console.log(`   Lines affected: ${issue.lineNumbers.join(', ')}`)
      }
      console.log('')
    })

    const hasCritical = report.issues.some(i => i.severity === 'Critical' || i.severity === 'High')
    if (hasCritical) {
      consola.warn('Critical or High severity issues detected.')
      process.exit(1)
    } else {
      consola.success('Analysis complete. No critical issues found.')
    }
  }
})
