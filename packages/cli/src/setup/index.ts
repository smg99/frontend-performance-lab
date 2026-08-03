import readline from 'readline'
import { IDEFinder, type SupportedIDE } from './IDEFinder.js'
import { ConfigLocator } from './ConfigLocator.js'
import { BackupManager, RollbackManager } from './RollbackManager.js'
import { ConfigPatcher } from './ConfigPatcher.js'
import { InstallationValidator } from './InstallationValidator.js'
import { ProgressRenderer } from './ProgressRenderer.js'

export async function runSetup() {
  ProgressRenderer.info('Scanning system for supported IDEs...')
  const ides = IDEFinder.findInstalledIDEs()

  if (ides.length === 0) {
    ProgressRenderer.warn('No supported IDEs found. Exiting.')
    return
  }

  ProgressRenderer.success(`Found IDEs: ${ides.join(', ')}`)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const answer = await new Promise<string>(resolve => {
    rl.question(
      `Do you want to configure these IDEs with Frontend Performance Lab? [Y/n] `,
      resolve
    )
  })
  rl.close()

  if (answer.trim().toLowerCase() === 'n') {
    ProgressRenderer.info('Installation aborted.')
    return
  }

  for (const ide of ides) {
    ProgressRenderer.info(`Configuring ${ide}...`)
    const configPath = ConfigLocator.getConfigPath(ide)

    if (!configPath) {
      ProgressRenderer.warn(`${ide} configuration path could not be resolved on this OS. Skipping.`)
      continue
    }

    let backupPath: string | null = null
    try {
      ConfigLocator.ensureConfigDir(configPath)
      backupPath = BackupManager.backup(configPath)
      ConfigPatcher.patch(configPath)

      const isValid = InstallationValidator.validate(configPath)
      if (isValid) {
        ProgressRenderer.success(`Successfully configured ${ide}!`)
      } else {
        throw new Error('Validation failed post-patching. JSON is invalid.')
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      ProgressRenderer.error(`Failed to configure ${ide}: ${msg}`)
      ProgressRenderer.info(`Rolling back ${ide} configuration...`)
      RollbackManager.rollback(configPath, backupPath)
      ProgressRenderer.success(`Rollback successful for ${ide}. Config was not modified.`)
    }
  }

  ProgressRenderer.success(
    'Installation complete. Please restart your IDEs if tools do not appear.'
  )
}

// Allow execution
if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith('setup/index.ts')
) {
  runSetup().catch(e => {
    ProgressRenderer.error(`Unhandled error: ${e.message}`)
    process.exit(1)
  })
}
