import { defineCommand } from 'citty'
import consola from 'consola'
import { resolve, extname } from 'path'
import { readFileSync, writeFileSync, statSync, existsSync } from 'fs'
import { loadConfig } from 'c12'
import { getConfiguredEngine } from '../../../../shared/utils/analyzer/rules/index'
import { buildProjectContext, discoverFiles } from '../../../../shared/core/src/index'

const SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte']

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
    },
    'auto-fix': {
      type: 'boolean',
      description: 'Automatically fix detectable performance bottlenecks',
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
      filesToAnalyze = discoverFiles(targetPath, SUPPORTED_EXTENSIONS)
    } else if (stat.isFile() && SUPPORTED_EXTENSIONS.includes(extname(targetPath))) {
      filesToAnalyze = [targetPath]
    } else {
      consola.error(
        `Unsupported target. Please provide a directory or a supported file (${SUPPORTED_EXTENSIONS.join(', ')}).`
      )
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

    const contexts = await buildProjectContext(filesToAnalyze)

    const autoFixEnabled = args['auto-fix'] === true
    if (autoFixEnabled) {
      consola.info('Auto-fix is enabled. Modifiable issues will be overwritten in source files.')
    }

    const report = engine.analyze(contexts, { autoFix: autoFixEnabled })

    if (autoFixEnabled) {
      // Save any files that were mutated
      let fixedCount = 0
      for (const ctx of contexts) {
        // Read original to compare
        const original = readFileSync(ctx.filename, 'utf8')
        if (original !== ctx.code) {
          try {
            writeFileSync(ctx.filename, ctx.code)
            fixedCount++
          } catch (e) {
            consola.warn(`Failed to auto-fix ${ctx.filename}:`, e)
          }
        }
      }
      if (fixedCount > 0) {
        consola.success(`Auto-fixed ${fixedCount} file(s)!`)
      }
    }

    console.log('\n--- Frontend Performance Lab Report ---\n')

    // Print Score
    const scoreColor =
      report.performanceScore >= 90 ? 'green' : report.performanceScore >= 70 ? 'yellow' : 'red'
    consola.box(`Overall Grade: ${report.overallScore} (${report.performanceScore}/100)`)

    // Print Estimates
    consola.info(
      `Estimated Impact: ${report.estimates.performanceGain} | TTR: ${report.estimates.timeToFix}`
    )

    console.log('\n')

    if (report.warnings && report.warnings.length > 0) {
      for (const warning of report.warnings) {
        consola.warn(`[WARNING] ${warning}`)
      }
    }

    if (report.suggestions.length) {
      for (const suggestion of report.suggestions) {
        consola.info(`[SUGGESTION] ${suggestion.title}: ${suggestion.description}`)
      }
    }

    if (report.issues.length === 0) {
      const hasWarnings = report.warnings && report.warnings.length > 0
      const hasSuggestions = report.suggestions.length > 0

      if (!hasWarnings && !hasSuggestions) {
        consola.success('No performance issues detected! 🎉')
      } else if (hasWarnings) {
        consola.warn(
          'Analysis completed with warnings. Some files may not have been fully analyzed.'
        )
      }
      return
    }

    // Print Issues
    consola.error(
      `Found ${report.issues.length} issue(s) across ${report.analyzedFiles} file(s):\n`
    )

    report.issues.forEach((issue, index) => {
      const severityStr =
        issue.severity === 'Critical' || issue.severity === 'High'
          ? '🔴'
          : issue.severity === 'Warning'
            ? '🟡'
            : '🔵'
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
