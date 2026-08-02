import { defineCommand } from 'citty'
import consola from 'consola'

export default defineCommand({
  meta: {
    name: 'config',
    description: 'Manage FPL settings (list, get, set, reset)'
  },
  subCommands: {
    list: () => import('./config-list').then(r => r.default),
    get: () => import('./config-get').then(r => r.default),
    set: () => import('./config-set').then(r => r.default),
    reset: () => import('./config-reset').then(r => r.default)
  }
})
