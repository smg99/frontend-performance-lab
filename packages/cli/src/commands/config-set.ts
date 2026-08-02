import { defineCommand } from 'citty'
import consola from 'consola'

export default defineCommand({
  meta: { name: 'set', description: 'Set a configuration setting' },
  run() {
    consola.info('Config set')
  }
})
