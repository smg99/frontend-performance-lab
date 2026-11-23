import { describe, expect, it } from 'vitest'
import { auditHtmlAccessibility, type HtmlAuditDocument } from '../../shared/audit/accessibility'

const passDocument: HtmlAuditDocument = {
  path: '/index.html',
  html: '<html lang="en"><head><title>Frontend Performance Lab</title></head><body><main><h1>FPL</h1><img src="/logo.svg" alt="Frontend Performance Lab"><a href="/about">About</a><button type="button">Analyze</button></main></body></html>'
}

describe('accessibility smoke audit', () => {
  it('passes a document with the required accessible structure', () => {
    expect(auditHtmlAccessibility(passDocument).violations).toEqual([])
  })

  it('reports missing language, title and landmarks', () => {
    const report = auditHtmlAccessibility({
      path: '/broken.html',
      html: '<html><head></head><body><h2>Missing</h2><img src="a.png"></body></html>'
    })

    expect(report.violations.map(violation => violation.rule)).toEqual([
      'html-has-lang',
      'document-title',
      'landmark-main',
      'page-has-heading-one',
      'image-alt'
    ])
  })

  it('reports unnamed links and buttons and duplicate ids', () => {
    const report = auditHtmlAccessibility({
      path: '/controls.html',
      html: '<html lang="en"><head><title>Controls</title></head><body><main><h1>Controls</h1><a href="/"></a><button></button><div id="x"></div><div id="x"></div></main></body></html>'
    })

    expect(report.violations.map(violation => violation.rule)).toEqual([
      'link-name',
      'button-name',
      'duplicate-id'
    ])
  })

  it('escapes no violation details and identifies the exact document path', () => {
    const report = auditHtmlAccessibility({
      path: '/nested/page.html',
      html: '<html><head></head><body></body></html>'
    })

    expect(report.path).toBe('/nested/page.html')
    expect(report.violations[0].path).toBe('/nested/page.html')
  })
})
