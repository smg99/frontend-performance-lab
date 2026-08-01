export function parseVue(code: string) {
  try {
    // Hide from Rollup/Nitro static analysis to prevent it from bundling consolidate/template engines
    const compiler = typeof process !== 'undefined' ? eval("require('@vue/compiler-sfc')") : require('@vue/compiler-sfc')
    const { descriptor } = compiler.parse(code)
    return { ast: descriptor }
  } catch (e) {
    console.error('Failed to parse Vue SFC', e)
    return { ast: null }
  }
}
