const fs = require('fs')
const path = require('path')

const BRAND_DIR = path.join(__dirname, '../public/branding')

// Ensure directory exists
if (!fs.existsSync(BRAND_DIR)) {
  fs.mkdirSync(BRAND_DIR, { recursive: true })
}

// Colors
const colors = {
  primary: '#2563EB',
  secondary: '#7C3AED',
  accent: '#10B981',
  white: '#FFFFFF',
  black: '#0F172A',
  textDark: '#F8FAFC',
  textLight: '#0F172A'
}

// SVG components
const generateFlaskIcon = fillColor => `
  <!-- Flask Lip -->
  <path d="M 38 18 h 24 c 1.1 0 2 0.9 2 2 v 4 c 0 1.1 -0.9 2 -2 2 H 38 c -1.1 0 -2 -0.9 -2 -2 v -4 c 0 -1.1 0.9 -2 2 -2 z" fill="${fillColor}" />
  <!-- Flask Body -->
  <path d="M 43 26 V 40 L 22.3 75.3 C 20.5 78.4 22.8 82 26.3 82 h 47.4 c 3.6 0 5.8 -3.6 4.1 -6.7 L 57 40 V 26" fill="none" stroke="${fillColor}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
  <!-- Code Brackets < > -->
  <path d="M 42 58 L 32 66 L 42 74 M 58 58 L 68 66 L 58 74" fill="none" stroke="${colors.primary}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
`

const generateIconSVG =
  fillColor => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
${generateFlaskIcon(fillColor)}
</svg>`

const generateWordmarkOnly =
  textColor => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="100%" height="100%">
  <text x="0" y="55" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="700" font-size="28" fill="${textColor}">Frontend</text>
  <text x="0" y="85" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="600" font-size="28" fill="${textColor}">Performance Lab</text>
</svg>`

const generateLogo = (
  iconColor,
  textColor
) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 100" width="100%" height="100%">
  <g transform="translate(0, 0)">
    ${generateFlaskIcon(iconColor)}
  </g>
  <g transform="translate(110, 0)">
    <text x="0" y="46" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="700" font-size="32" fill="${textColor}">Frontend</text>
    <text x="0" y="78" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="600" font-size="32" fill="${textColor}" opacity="0.8">Performance Lab</text>
  </g>
</svg>`

const generateGradientLogo =
  () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 100" width="100%" height="100%">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.primary}" />
      <stop offset="100%" stop-color="${colors.secondary}" />
    </linearGradient>
  </defs>
  <g transform="translate(0, 0)">
    <!-- Flask Lip -->
    <path d="M 38 18 h 24 c 1.1 0 2 0.9 2 2 v 4 c 0 1.1 -0.9 2 -2 2 H 38 c -1.1 0 -2 -0.9 -2 -2 v -4 c 0 -1.1 0.9 -2 2 -2 z" fill="url(#grad1)" />
    <!-- Flask Body -->
    <path d="M 43 26 V 40 L 22.3 75.3 C 20.5 78.4 22.8 82 26.3 82 h 47.4 c 3.6 0 5.8 -3.6 4.1 -6.7 L 57 40 V 26" fill="none" stroke="url(#grad1)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
    <!-- Code Brackets < > -->
    <path d="M 42 58 L 32 66 L 42 74 M 58 58 L 68 66 L 58 74" fill="none" stroke="${colors.accent}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <g transform="translate(110, 0)">
    <text x="0" y="46" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="700" font-size="32" fill="${colors.black}">Frontend</text>
    <text x="0" y="78" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-weight="600" font-size="32" fill="${colors.black}" opacity="0.8">Performance Lab</text>
  </g>
</svg>`

const generateFaviconSVG =
  () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <!-- Simplified solid flask for tiny rendering -->
  <path d="M 40 20 h 20 v 4 h -20 z" fill="${colors.primary}" />
  <path d="M 45 24 V 40 L 20 80 H 80 L 55 40 V 24" fill="${colors.primary}" stroke="${colors.primary}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M 41 53 L 28 65 L 41 77 M 59 53 L 72 65 L 59 77" fill="none" stroke="${colors.white}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
</svg>`

// Write standard SVGs
fs.writeFileSync(path.join(BRAND_DIR, 'logo-icon.svg'), generateIconSVG(colors.primary))
fs.writeFileSync(
  path.join(BRAND_DIR, 'logo-light.svg'),
  generateLogo(colors.primary, colors.textLight)
)
fs.writeFileSync(
  path.join(BRAND_DIR, 'logo-dark.svg'),
  generateLogo(colors.primary, colors.textDark)
)
fs.writeFileSync(path.join(BRAND_DIR, 'logo.svg'), generateLogo(colors.primary, colors.textLight))
fs.writeFileSync(path.join(BRAND_DIR, 'logo-gradient.svg'), generateGradientLogo())

fs.writeFileSync(path.join(BRAND_DIR, 'wordmark-light.svg'), generateWordmarkOnly(colors.textLight))
fs.writeFileSync(path.join(BRAND_DIR, 'wordmark-dark.svg'), generateWordmarkOnly(colors.textDark))
fs.writeFileSync(path.join(BRAND_DIR, 'wordmark.svg'), generateWordmarkOnly(colors.textLight))

fs.writeFileSync(path.join(BRAND_DIR, 'favicon.svg'), generateFaviconSVG())

console.log('SVGs generated successfully!')
