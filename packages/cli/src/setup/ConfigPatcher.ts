import fs from 'fs'

export const ConfigPatcher = {
  patch(configPath: string): boolean {
    let configStr = '{}'
    if (fs.existsSync(configPath)) {
      configStr = fs.readFileSync(configPath, 'utf8')
      if (!configStr.trim()) configStr = '{}'
    }

    let configObj: Record<string, unknown>
    try {
      configObj = JSON.parse(configStr) as Record<string, unknown>
    } catch (e) {
      throw new Error(`Invalid JSON in configuration file: ${configPath}`, { cause: e })
    }

    if (!configObj.mcpServers || typeof configObj.mcpServers !== 'object') {
      configObj.mcpServers = {}
    }

    const mcpServers = configObj.mcpServers as Record<string, unknown>
    mcpServers['frontend-performance-lab'] = {
      command: 'npx',
      args: ['-y', 'frontend-performance-lab']
    }

    fs.writeFileSync(configPath, JSON.stringify(configObj, null, 2), 'utf8')
    return true
  }
}
