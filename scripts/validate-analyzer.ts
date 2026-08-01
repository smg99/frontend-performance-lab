/* eslint-disable @typescript-eslint/no-unused-vars */
import { execSync } from 'child_process'

try {
  console.log('Running Analyzer Tests & Coverage...')
  execSync('npx vitest run -c vitest-analyzer.config.ts --coverage', { stdio: 'inherit' })

  console.log('Generating ANALYZER_COVERAGE.md...')
  execSync('npx tsx scripts/generate-analyzer-coverage.ts', { stdio: 'inherit' })

  console.log('Verifying rules synchronization...')
  try {
    execSync('git diff --exit-code ANALYZER_COVERAGE.md', { stdio: 'inherit' })
    console.log('✅ Analyzer Validation Passed')
  } catch (err) {
    console.error(
      '❌ ANALYZER_COVERAGE.md is out of sync. Please run the generation script and commit the changes.'
    )
    process.exit(1)
  }
} catch (err) {
  console.error('❌ Analyzer Validation Failed')
  process.exit(1)
}
