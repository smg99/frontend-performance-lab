import fs from 'fs'

export const InstallationValidator = {
  validate(configPath: string): boolean {
    if (!fs.existsSync(configPath)) return false
    try {
      const configObj = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      const server = configObj.mcpServers?.['frontend-performance-lab']
      return server && server.command === 'npx' && server.args.includes('frontend-performance-lab')
    } catch (e) {
      return false
    }
  }
}
