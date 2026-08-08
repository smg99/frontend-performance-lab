import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: networkBatching', () => {
  it('detects multiple unbatched fetches in the same block', () => {
    const code = loadFixture('react', 'network-batching', 'missing', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'network-batching')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe(
      "Multiple independent network requests ('/api/users', '/api/posts') executed sequentially instead of in parallel with Promise.all."
    )
  })

  it('does not flag single fetch', () => {
    const code = `
      async function fetchUser() {
        return await fetch('/api/user');
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'network-batching')
    expect(issues.length).toBe(0)
  })

  it('ignores requests batched with Promise.all', () => {
    const code = `
      async function loadAll() {
        const [users, posts] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/posts')
        ]);
        return { users, posts };
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'network-batching')
    expect(issues.length).toBe(0)
  })

  it('detects network request inside a loop (N+1 waterfall)', () => {
    const code = `
      async function loadDetails(ids) {
        for (const id of ids) {
          await fetch('/api/items/' + id);
        }
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'network-batching')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe(
      "Network request 'dynamic URL' inside loop causes sequential N+1 network waterfall."
    )
  })

  it('ignores dependent sequential requests', () => {
    const code = `
      async function loadUserData() {
        const user = await fetch('/api/user');
        const profile = await fetch('/api/profiles/' + user.id);
        return { user, profile };
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'network-batching')
    expect(issues.length).toBe(0)
  })

  it('detects 2 independent unbatched fetches', () => {
    const code = `
      async function loadDashboard() {
        const users = await fetch('/api/users');
        const stats = await fetch('/api/stats');
        return { users, stats };
      }
    `
    const report = runAnalyzer(code, 'js', 'vanilla')
    const issues = report.issues.filter(i => i.ruleId === 'network-batching')
    expect(issues.length).toBe(1)
    expect(issues[0].description).toBe(
      "Multiple independent network requests ('/api/users', '/api/stats') executed sequentially instead of in parallel with Promise.all."
    )
  })
})
