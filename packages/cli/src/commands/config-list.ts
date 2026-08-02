import { defineCommand } from 'citty'
import consola from 'consola'

export default defineCommand({
  meta: { name: 'list', description: 'List all configuration settings' },
  run() {
    consola.info('Config list')
  }
})
