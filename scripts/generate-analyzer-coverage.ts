import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { builtInRules } from '../shared/utils/analyzer/rules/index.js'
import prettier from 'prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.join(__dirname, '..')

interface CoverageSummary {
  lines?: { pct?: number | 'Unknown' }
}

type CoverageReport = Record<string, CoverageSummary>

const coveragePath = path.join(ROOT, 'coverage/coverage-summary.json')
const coverage: CoverageReport = fs.existsSync(coveragePath)
  ? JSON.parse(fs.readFileSync(coveragePath, 'utf8'))
  : {}

let md = `# AST Analyzer Coverage Report\n\n`
md += `This report separates executable test coverage from fixture inventory. A fixture is not a test unless an executable test loads it and asserts the expected analyzer result.\n\n`

md += `## 1. Executable Rule Coverage\n\n`
md += `| Rule ID | Test file | Measured line coverage | Positive fixtures | Negative fixtures | Edge fixtures |\n`
md += `| --- | --- | ---: | ---: | ---: | ---: |\n`

const testFilesRoot = path.join(ROOT, 'test/unit/analyzer/rules')
const fixturesRoot = path.join(ROOT, 'shared/utils/analyzer/tests/fixtures')

let rulesWithTests = 0
let positiveFixtures = 0
let negativeFixtures = 0
let edgeFixtures = 0

function countFixtures(ruleId: string) {
  let posCount = 0
  let negCount = 0
  let edgeCount = 0

  for (const lang of ['vue', 'react', 'javascript', 'typescript']) {
    const aliases =
      ruleId === 'passive-event-listener-missing'
        ? [ruleId, 'passive-event-listener']
        : ruleId === 'react-unmemoized-context-provider'
          ? [ruleId, 'react-unmemoized-context']
          : [ruleId]

    for (const alias of aliases) {
      const ruleFixturePath = path.join(fixturesRoot, lang, alias)
      if (!fs.existsSync(ruleFixturePath)) continue

      for (const file of fs.readdirSync(ruleFixturePath)) {
        if (file.startsWith('ignores-')) negCount++
        else if (file.startsWith('handles-') || file.startsWith('edge-')) edgeCount++
        else posCount++
      }
    }
  }

  return { edgeCount, negCount, posCount }
}

function measuredLineCoverage(ruleId: string): string {
  const suffix = `/shared/utils/analyzer/rules/${ruleId}.ts`
  const entry = Object.entries(coverage).find(([filename]) => filename.endsWith(suffix))?.[1]
  const percentage = entry?.lines?.pct
  return typeof percentage === 'number' ? `${percentage.toFixed(2)}%` : 'Not measured'
}

for (const rule of builtInRules) {
  const testFile = path.join(testFilesRoot, `${rule.id}.test.ts`)
  const hasTestFile = fs.existsSync(testFile)
  const { edgeCount, negCount, posCount } = countFixtures(rule.id)

  if (hasTestFile) rulesWithTests++
  positiveFixtures += posCount
  negativeFixtures += negCount
  edgeFixtures += edgeCount

  md += `| \`${rule.id}\` | ${hasTestFile ? 'Yes' : '**No**'} | ${measuredLineCoverage(rule.id)} | ${posCount} | ${negCount} | ${edgeCount} |\n`
}

md += `\n- **Registered rules:** ${builtInRules.length}\n`
md += `- **Rules with executable test files:** ${rulesWithTests}\n`
md += `- **Declared fixture files:** ${positiveFixtures + negativeFixtures + edgeFixtures}\n`
md += `  - Positive: ${positiveFixtures}\n`
md += `  - Negative: ${negativeFixtures}\n`
md += `  - Edge/handling: ${edgeFixtures}\n`

md += `\n## 2. Interpretation\n\n`
md += `- Measured line coverage comes from Vitest's V8 coverage output for the executable analyzer suite.\n`
md += `- Fixture counts are inventory only and make no accuracy or coverage claim.\n`
md += `- Precision and recall remain unmeasured until the versioned evaluation corpus is implemented.\n`
md += `- A rule test file does not by itself prove production accuracy; it only confirms that executable assertions exist.\n`

md += `\n## 3. Known Evaluation Gaps\n\n`
md += `- Some files named as positive fixtures are placeholders or do not currently trigger their associated rule.\n`
md += `- Complete data-flow analysis across multiple files (cross-file imports).\n`
md += `- Advanced hook/composable abstraction resolution.\n`
md += `- Precise array size determination where runtime data is required.\n`
md += `- Versioned real-project corpus with measured precision, recall and false-positive rate.\n`

const formattedMarkdown = await prettier.format(md, { parser: 'markdown' })
fs.writeFileSync(path.join(ROOT, 'ANALYZER_COVERAGE.md'), formattedMarkdown)
console.log('Generated ANALYZER_COVERAGE.md')
