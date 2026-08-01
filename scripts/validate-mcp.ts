import { spawn } from 'child_process'
import { getAllExperiments } from '../shared/registry/index.js'
import { getAllBrowserAPIs } from '../shared/registry/browser-apis.js'
import { getAllRecipes } from '../shared/registry/recipes.js'

async function validate() {
  console.log('Validating Knowledge Graph Registries...')
  const experiments = getAllExperiments()
  const apis = getAllBrowserAPIs()
  const recipes = getAllRecipes()

  if (experiments.length === 0) throw new Error('Experiments count is 0')
  if (apis.length === 0) throw new Error('Browser APIs count is 0')
  if (recipes.length === 0) throw new Error('Recipes count is 0')

  console.log(
    `✓ Found ${experiments.length} experiments, ${apis.length} APIs, ${recipes.length} recipes.`
  )

  console.log('Validating MCP Server Startup...')
  await new Promise<void>((resolve, reject) => {
    const proc = spawn('npx', ['tsx', 'mcp/server.ts'], { stdio: ['pipe', 'pipe', 'pipe'] })

    let started = false
    proc.stderr.on('data', data => {
      const output = data.toString()
      if (output.includes('running on stdio')) {
        started = true
        console.log('✓ MCP Server started successfully and registered tools/resources.')
        proc.kill()
        resolve()
      }
    })

    proc.on('close', code => {
      if (!started && code !== null && code !== 0) {
        reject(new Error(`Server exited prematurely with code ${code}`))
      }
    })

    setTimeout(() => {
      if (!started) {
        proc.kill()
        reject(new Error('Server start timeout'))
      }
    }, 5000)
  })

  console.log('✅ MCP Validation Passed')
}

validate().catch(err => {
  console.error('❌ MCP Validation Failed:', err.message)
  process.exit(1)
})
