// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: [
      'test/fixtures/**',
      'shared/utils/analyzer/tests/fixtures/**',
      'shared/utils/analyzer/test-fixtures/**',
      'coverage/**',
      '.snapshots/**',
      'dist/**',
      '.output/**',
      '.generated/**',
      'ANALYZER_COVERAGE.md',
    ],
  },
  {
    files: ['**/*.{js,cjs,mjs,ts,vue}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'vue/require-default-prop': 'off',
      'vue/html-self-closing': 'off',
      'vue/no-v-html': 'off',
      'vue/attributes-order': 'off',
      'vue/require-v-for-key': 'off',
      'vue/no-unused-vars': 'off',
      'vue/v-slot-style': 'off',
      'no-useless-assignment': 'off',
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  }
);
