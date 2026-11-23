export interface HtmlAuditDocument {
  path: string
  html: string
}

export interface AccessibilityViolation {
  path: string
  rule:
    | 'html-has-lang'
    | 'document-title'
    | 'landmark-main'
    | 'page-has-heading-one'
    | 'image-alt'
    | 'link-name'
    | 'button-name'
    | 'duplicate-id'
  detail: string
}

export interface AccessibilityReport {
  path: string
  violations: AccessibilityViolation[]
}

function tags(html: string, name: string): string[] {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? []
}

function hasAttribute(tag: string, name: string): boolean {
  return new RegExp(`(?:^|\\s)${name}(?:\\s*=|\\s|\\s*/?>)`, 'i').test(tag)
}

function attributeValue(tag: string, name: string): string | null {
  const match = tag.match(
    new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i')
  )
  return match ? (match[1] ?? match[2] ?? match[3] ?? '') : null
}

function openingAndContent(html: string, name: string): Array<{ opening: string; text: string }> {
  const matches = html.matchAll(new RegExp(`<${name}\\b([^>]*)>(.*?)</${name}>`, 'gis'))
  return Array.from(matches, match => {
    const textWithImageAlts = match[2].replace(
      /<img\b[^>]*\balt\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>/gi,
      (_tag, doubleQuoted: string, singleQuoted: string, unquoted: string) =>
        doubleQuoted ?? singleQuoted ?? unquoted ?? ''
    )
    return {
      opening: `<${name}${match[1]}>`,
      text: textWithImageAlts
        .replace(/<[^>]+>/g, '')
        .replace(/&(?:nbsp|#160);/gi, ' ')
        .trim()
    }
  })
}

export function auditHtmlAccessibility(document: HtmlAuditDocument): AccessibilityReport {
  const violations: AccessibilityViolation[] = []
  const add = (rule: AccessibilityViolation['rule'], detail: string) => {
    violations.push({ path: document.path, rule, detail })
  }

  const htmlTags = tags(document.html, 'html')
  if (
    htmlTags.length === 0 ||
    !hasAttribute(htmlTags[0], 'lang') ||
    !attributeValue(htmlTags[0], 'lang')?.trim()
  ) {
    add('html-has-lang', 'The html element must declare a non-empty lang attribute.')
  }

  const title = document.html
    .match(/<title\b[^>]*>(.*?)<\/title>/is)?.[1]
    ?.replace(/<[^>]+>/g, '')
    .trim()
  if (!title) add('document-title', 'The document must include a non-empty title.')

  if (!/<main\b[^>]*>/i.test(document.html)) {
    add('landmark-main', 'The document should contain a main landmark.')
  }

  const h1Count = openingAndContent(document.html, 'h1').filter(h1 => h1.text.length > 0).length
  if (h1Count === 0)
    add('page-has-heading-one', 'The document should contain a non-empty h1 heading.')

  for (const image of tags(document.html, 'img')) {
    if (!hasAttribute(image, 'alt')) {
      add('image-alt', 'An img element must include an alt attribute.')
    }
  }

  for (const link of openingAndContent(document.html, 'a')) {
    if (!link.text && !attributeValue(link.opening, 'aria-label')?.trim()) {
      add('link-name', 'An a element must have accessible text or an aria-label.')
    }
  }

  for (const button of openingAndContent(document.html, 'button')) {
    if (!button.text && !attributeValue(button.opening, 'aria-label')?.trim()) {
      add('button-name', 'A button must have accessible text or an aria-label.')
    }
  }

  const ids = tags(document.html, 'div')
    .concat(
      tags(document.html, 'section'),
      tags(document.html, 'button'),
      tags(document.html, 'a'),
      tags(document.html, 'input')
    )
    .map(tag => attributeValue(tag, 'id'))
    .filter((id): id is string => Boolean(id))
  const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))]
  if (duplicateIds.length > 0) {
    add('duplicate-id', `Duplicate id values: ${duplicateIds.join(', ')}`)
  }

  return { path: document.path, violations }
}
