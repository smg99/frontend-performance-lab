import { parse } from '@babel/parser'

export function parseBabel(code: string, isTsx = false) {
  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: [
        'jsx',
        isTsx ? 'typescript' : 'flow'
      ]
    })
    return { ast }
  } catch (e) {
    console.error('Failed to parse JS/TS/JSX', e)
    return { ast: null }
  }
}
