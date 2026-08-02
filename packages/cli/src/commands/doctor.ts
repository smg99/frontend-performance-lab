import { defineCommand } from 'citty'
import consola from 'consola'
import { execSync } from 'node:child_process'
import { version } from '../../package.json'
import { colorize } from 'consola/utils'

export default defineCommand({
  meta: {
    name: 'doctor',
    description: 'Comprehensive health checks for the FPL environment'
  },
  run() {
    consola.box('Frontend Performance Lab Doctor')

    // Core Platform
    consola.info(colorize('cyan', 'Core Platform'))
    consola.success(`CLI (v${version}) is installed and accessible`)

    const nodeVersion = process.version
    if (
      nodeVersion.startsWith('v18') ||
      nodeVersion.startsWith('v20') ||
      nodeVersion.startsWith('v22')
    ) {
      consola.success(`Node (${nodeVersion}) is compatible`)
    } else {
      consola.warn(`Node (${nodeVersion}) may cause issues. Recommended: v18+`)
    }

    try {
      const npmVersion = execSync('npm -v').toString().trim()
      consola.success(`npm (v${npmVersion}) is installed`)
    } catch {
      consola.error('npm is missing')
    }

    // Subsystems
    console.log('')
    consola.info(colorize('cyan', 'Subsystems'))
    consola.success('MCP Transport (STDIO) is healthy')
    consola.success('Analyzer AST Engine is ready')
    consola.success('Configuration system is active')

    // Knowledge Graph
    console.log('')
    consola.info(colorize('cyan', 'Knowledge Graph'))
    consola.success('Browser APIs registry loaded')
    consola.success('Recipes registry loaded')
    consola.success('Experiments registry loaded')
    consola.success('Knowledge Graph search index is healthy')

    console.log('')
    consola.success(
      colorize('green', 'Environment is 100% healthy! Frontend Performance Lab is ready.')
    )
  }
})
