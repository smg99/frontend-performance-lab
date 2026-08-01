import { parse } from '@vue/compiler-sfc'

export function parseVue(code: string) {
  try {
    const { descriptor } = parse(code)
    return { ast: descriptor }
  } catch (e) {
    console.error('Failed to parse Vue SFC', e)
    return { ast: null }
  }
}
