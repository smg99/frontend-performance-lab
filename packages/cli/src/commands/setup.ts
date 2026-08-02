import { defineCommand } from 'citty'
import consola from 'consola'
import os from 'node:os'
import fs from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'
import { colorize } from 'consola/utils'
import { execSync } from 'node:child_process'

export default defineCommand({
  meta: {
    name: 'setup',
    description: 'Setup the Frontend Performance Lab environment (IDE detection, MCP config)'
  },
  async run() {
    console.clear()
    p.intro(colorize('bgBlue', ' Frontend Performance Lab Setup '))

    // 1. Verify Node & NPM
    const s = p.spinner()
    s.start('Verifying environment...')

    const nodeVersion = process.version
    let npmVersion = ''
    try {
      npmVersion = execSync('npm -v').toString().trim()
    } catch {
      s.stop('Failed to find npm.')
      p.cancel('npm is required to use this tool.')
      return process.exit(1)
    }

    if (
      nodeVersion.startsWith('v18') ||
      nodeVersion.startsWith('v20') ||
      nodeVersion.startsWith('v22')
    ) {
      s.stop(`Environment verified (Node ${nodeVersion}, npm ${npmVersion})`)
    } else {
      s.stop(`Node ${nodeVersion} detected. We recommend v18+.`)
    }

    // 2. IDE Detection
    const home = os.homedir()
    const ides = [
      {
        value: 'cursor',
        label: 'Cursor',
        path: path.join(home, 'Library/Application Support/Cursor/User/workspaceStorage')
      },
      {
        value: 'claude',
        label: 'Claude Desktop',
        path: path.join(home, 'Library/Application Support/Claude/claude_desktop_config.json')
      },
      {
        value: 'windsurf',
        label: 'Windsurf',
        path: path.join(home, '.codeium/windsurf/mcp_config.json')
      },
      {
        value: 'vscode',
        label: 'VS Code (Roo/Cline)',
        path: path.join(home, 'Library/Application Support/Code/User/globalStorage')
      },
      { value: 'manual', label: 'Manual Setup', path: '' }
    ]

    const detectedIdes = ides.filter(ide => ide.value === 'manual' || fs.existsSync(ide.path))

    // 3. IDE Selection
    const selectedIde = await p.select({
      message: 'Which IDE would you like to configure MCP for?',
      options: detectedIdes.length > 1 ? detectedIdes : ides
    })

    if (p.isCancel(selectedIde)) {
      p.cancel('Setup cancelled.')
      return process.exit(0)
    }

    // 4. Config Generation
    const mcpConfig = {
      mcpServers: {
        'frontend-performance-lab': {
          command: 'npx',
          args: ['-y', '@smg99/frontend-performance-lab-cli', 'mcp']
        }
      }
    }

    p.note(JSON.stringify(mcpConfig, null, 2), 'Add this to your MCP configuration file:')

    // 5. Verification
    const confirmed = await p.confirm({
      message: 'Did you successfully add the configuration?'
    })

    if (p.isCancel(confirmed) || !confirmed) {
      p.cancel('Setup aborted.')
      return process.exit(0)
    }

    p.outro(
      colorize(
        'green',
        'Setup complete! You can now use Frontend Performance Lab inside your AI Assistant.'
      )
    )
  }
})
