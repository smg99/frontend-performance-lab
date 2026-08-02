import { defineCommand } from 'citty'
import consola from 'consola'
import { version } from '../../package.json'
import os from 'node:os'
import fs from 'node:fs'
import path from 'node:path'
import { colorize } from 'consola/utils'

import { execSync } from 'node:child_process'

export default defineCommand({
  meta: {
    name: 'info',
    description: 'Print installation information, versions, and resource counts'
  },
  async run() {
    consola.box(`Frontend Performance Lab (v${version})`)

    consola.info(colorize('cyan', 'System Information:'))
    consola.log(`  OS: ${os.type()} ${os.release()} (${os.arch()})`)
    consola.log(`  Node: ${process.version}`)
    try {
      const npmVersion = execSync('npm -v').toString().trim()
      consola.log(`  npm: v${npmVersion}`)
    } catch {
      // Ignore if npm fails
    }

    console.log('')
    consola.info(colorize('cyan', 'Knowledge Graph Resources:'))
    try {
      const { getAllExperiments, getAllBrowserAPIs, getAllRecipes } =
        await import('../../../../shared/registry/index')

      consola.log(`  Experiments:  ${getAllExperiments().length}`)
      consola.log(`  Browser APIs: ${getAllBrowserAPIs().length}`)
      consola.log(`  Recipes:      ${getAllRecipes().length}`)
    } catch (error) {
      console.log(`  Unable to load resource counts: ${error}`)
    }

    console.log('')
    consola.info(colorize('cyan', 'Detected IDEs:'))
    const home = os.homedir()
    const ides = [
      {
        name: 'VS Code',
        path: path.join(home, 'Library/Application Support/Code/User/globalStorage')
      },
      {
        name: 'Cursor',
        path: path.join(home, 'Library/Application Support/Cursor/User/workspaceStorage')
      },
      {
        name: 'Claude Desktop',
        path: path.join(home, 'Library/Application Support/Claude/claude_desktop_config.json')
      },
      { name: 'Windsurf', path: path.join(home, '.codeium/windsurf/mcp_config.json') }
    ]

    for (const ide of ides) {
      if (fs.existsSync(ide.path)) {
        consola.success(`  ${ide.name} (Detected)`)
      } else {
        consola.log(`  ${ide.name} (Not found)`)
      }
    }
  }
})
