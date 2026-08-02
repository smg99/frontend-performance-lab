#!/usr/bin/env node

import { defineCommand, runMain } from 'citty'
import { version } from '../package.json'
import { commands } from './commands'
import consola from 'consola'

const main = defineCommand({
  meta: {
    name: 'fpl',
    version,
    description: `Frontend Performance Lab CLI & MCP (v${version})\n\n  Optimize your Vue & React applications.`
  },
  subCommands: commands
})

runMain(main)
