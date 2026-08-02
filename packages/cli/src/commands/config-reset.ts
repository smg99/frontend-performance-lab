import { defineCommand } from 'citty'
import consola from 'consola'

export default defineCommand({
  meta: { name: 'reset', description: 'Reset a configuration setting' },
  run() {
    consola.info('Config reset')
  }
})
