import { describe, it, expect } from 'vitest'
import { runAnalyzer, loadFixture } from '../../../../shared/utils/analyzer/tests/helpers'

describe('Rule: lazyLoadImageMisses', () => {
  it('detects missing lazy loading in react when >= 5 images exist', () => {
    const code = loadFixture('react', 'lazy-load-image-misses', 'missing', 'jsx')
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'lazy-load-image-misses')
    // 4 images are missing the loading="lazy" attribute in the fixture
    expect(issues.length).toBe(4)
  })

  it('does not flag if less than 5 images are present', () => {
    const code = `
      export default function SmallGallery() {
        return (
          <div>
            <img src="1.jpg" />
            <img src="2.jpg" />
            <img src="3.jpg" />
          </div>
        )
      }
    `
    const report = runAnalyzer(code, 'jsx', 'react')
    const issues = report.issues.filter(i => i.ruleId === 'lazy-load-image-misses')
    expect(issues.length).toBe(0)
  })
})
