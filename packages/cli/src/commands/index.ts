export const commands = {
  setup: () => import('./setup').then(r => r.default),
  doctor: () => import('./doctor').then(r => r.default),
  info: () => import('./info').then(r => r.default),
  config: () => import('./config').then(r => r.default),
  analyze: () => import('./analyze').then(r => r.default),
  mcp: () => import('./mcp').then(r => r.default)
}
