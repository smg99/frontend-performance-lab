// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      'shared/utils/analyzer/test-fixtures/**',
      'coverage/**',
      '.snapshots/**',
      'dist/**',
      '.output/**',
      '.generated/**',
      'ANALYZER_COVERAGE.md'
    ]
  },
  {
    files: ['shared/utils/analyzer/test-fixtures/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
)
