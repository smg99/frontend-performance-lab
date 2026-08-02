import { defineCommand } from 'citty'
import consola from 'consola'

export default defineCommand({
  meta: { name: 'get', description: 'Get a configuration setting' },
  run() {
    consola.info('Config get')
  }
})
