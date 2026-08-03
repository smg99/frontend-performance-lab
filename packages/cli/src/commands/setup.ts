import { defineCommand } from 'citty'
import consola from 'consola'
import * as p from '@clack/prompts'
import { colorize } from 'consola/utils'
import { execSync } from 'node:child_process'

import { IDEFinder, type SupportedIDE } from '../setup/IDEFinder.js'
import { ConfigLocator } from '../setup/ConfigLocator.js'
import { BackupManager, RollbackManager } from '../setup/RollbackManager.js'
import { ConfigPatcher } from '../setup/ConfigPatcher.js'
import { InstallationValidator } from '../setup/InstallationValidator.js'

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
    const s2 = p.spinner()
    s2.start('Scanning system for supported IDEs...')
    const ides = IDEFinder.findInstalledIDEs()

    if (ides.length === 0) {
      s2.stop('No supported IDEs found.')
      p.cancel('Could not detect Claude Desktop, Cursor, VSCode, or Antigravity.')
      return process.exit(0)
    }
    
    s2.stop(`Found IDEs: ${ides.join(', ')}`)

    // 3. IDE Selection
    const selectedIdes = await p.multiselect({
      message: 'Which IDEs would you like to configure for MCP?',
      options: ides.map((ide: string) => ({ value: ide, label: ide }))
    })

    if (p.isCancel(selectedIdes) || selectedIdes.length === 0) {
      p.cancel('Setup cancelled.')
      return process.exit(0)
    }

    // 4. Config Generation & Patching
    for (const ide of selectedIdes as SupportedIDE[]) {
      const configPath = ConfigLocator.getConfigPath(ide)
      
      if (!configPath) {
        consola.warn(`Configuration path for ${ide} could not be resolved on this OS.`)
        continue
      }

      const s3 = p.spinner()
      s3.start(`Configuring ${ide}...`)

      let backupPath: string | null = null
      try {
        ConfigLocator.ensureConfigDir(configPath)
        backupPath = BackupManager.backup(configPath)
        
        ConfigPatcher.patch(configPath)
        
        const isValid = InstallationValidator.validate(configPath)
        if (isValid) {
          s3.stop(colorize('green', `Successfully configured ${ide} MCP integration.`))
        } else {
          throw new Error('Validation failed post-patching. JSON is invalid.')
        }
      } catch (e: unknown) {
        s3.stop(colorize('red', `Failed to configure ${ide}.`))
        const msg = e instanceof Error ? e.message : String(e)
        consola.error(msg)
        
        consola.info(`Rolling back ${ide} configuration...`)
        RollbackManager.rollback(configPath, backupPath)
        consola.success(`Rollback successful for ${ide}. Config was not modified.`)
      }
    }

    p.outro(
      colorize(
        'green',
        'Setup complete! You can now use Frontend Performance Lab inside your AI Assistant. Remember to restart your IDE.'
      )
    )
  }
})
