import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BRAND_DIR = path.join(__dirname, '../public/branding');
const MANIFEST_DIR = path.join(BRAND_DIR, 'manifest-icons');

// Ensure directories exist
if (!fs.existsSync(BRAND_DIR)) fs.mkdirSync(BRAND_DIR, { recursive: true });
if (!fs.existsSync(MANIFEST_DIR)) fs.mkdirSync(MANIFEST_DIR, { recursive: true });

// Colors
const colors = {
  primary: '#2563EB',
  secondary: '#7C3AED',
  accent: '#10B981',
  white: '#FFFFFF',
  black: '#0F172A',
  textDark: '#F8FAFC',
  textLight: '#0F172A',
  bgDark: '#020420',
};

// SVG components
const generateFlaskIcon = (fillColor) => `
  <!-- Flask Lip -->
  <path d="M 38 18 h 24 c 1.1 0 2 0.9 2 2 v 4 c 0 1.1 -0.9 2 -2 2 H 38 c -1.1 0 -2 -0.9 -2 -2 v -4 c 0 -1.1 0.9 -2 2 -2 z" fill="${fillColor}" />
  <!-- Flask Body -->
  <path d="M 43 26 V 40 L 22.3 75.3 C 20.5 78.4 22.8 82 26.3 82 h 47.4 c 3.6 0 5.8 -3.6 4.1 -6.7 L 57 40 V 26" fill="none" stroke="${fillColor}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
  <!-- Code Brackets < > -->
  <path d="M 42 58 L 32 66 L 42 74 M 58 58 L 68 66 L 58 74" fill="none" stroke="${colors.primary}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
`;

const generateIconSVG = (fillColor) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
${generateFlaskIcon(fillColor)}
</svg>`;

const generateWordmarkOnly = (textColor) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="100%" height="100%">
  <text x="0" y="55" font-family="Inter, -apple-system, sans-serif" font-weight="700" font-size="28" fill="${textColor}">Frontend</text>
  <text x="0" y="85" font-family="Inter, -apple-system, sans-serif" font-weight="600" font-size="28" fill="${textColor}">Performance Lab</text>
</svg>`;

const generateLogo = (iconColor, textColor) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 100" width="100%" height="100%">
  <g transform="translate(0, 0)">
    ${generateFlaskIcon(iconColor)}
  </g>
  <g transform="translate(110, 0)">
    <text x="0" y="46" font-family="Inter, -apple-system, sans-serif" font-weight="700" font-size="32" fill="${textColor}">Frontend</text>
    <text x="0" y="78" font-family="Inter, -apple-system, sans-serif" font-weight="600" font-size="32" fill="${textColor}" opacity="0.8">Performance Lab</text>
  </g>
</svg>`;

const generateGradientLogo = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 100" width="100%" height="100%">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.primary}" />
      <stop offset="100%" stop-color="${colors.secondary}" />
    </linearGradient>
  </defs>
  <g transform="translate(0, 0)">
    <path d="M 38 18 h 24 c 1.1 0 2 0.9 2 2 v 4 c 0 1.1 -0.9 2 -2 2 H 38 c -1.1 0 -2 -0.9 -2 -2 v -4 c 0 -1.1 0.9 -2 2 -2 z" fill="url(#grad1)" />
    <path d="M 43 26 V 40 L 22.3 75.3 C 20.5 78.4 22.8 82 26.3 82 h 47.4 c 3.6 0 5.8 -3.6 4.1 -6.7 L 57 40 V 26" fill="none" stroke="url(#grad1)" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M 42 58 L 32 66 L 42 74 M 58 58 L 68 66 L 58 74" fill="none" stroke="${colors.accent}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
  </g>
  <g transform="translate(110, 0)">
    <text x="0" y="46" font-family="Inter, -apple-system, sans-serif" font-weight="700" font-size="32" fill="${colors.black}">Frontend</text>
    <text x="0" y="78" font-family="Inter, -apple-system, sans-serif" font-weight="600" font-size="32" fill="${colors.black}" opacity="0.8">Performance Lab</text>
  </g>
</svg>`;

const generateFaviconSVG = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <path d="M 40 20 h 20 v 4 h -20 z" fill="${colors.primary}" />
  <path d="M 45 24 V 40 L 20 80 H 80 L 55 40 V 24" fill="${colors.primary}" stroke="${colors.primary}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M 41 53 L 28 65 L 41 77 M 59 53 L 72 65 L 59 77" fill="none" stroke="${colors.white}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

const generateSocialPreviewSVG = () => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="${colors.bgDark}" />
  <g transform="translate(400, 180) scale(4)">
    ${generateFlaskIcon(colors.primary)}
  </g>
  <text x="600" y="460" font-family="Inter, -apple-system, sans-serif" font-weight="700" font-size="64" fill="${colors.white}" text-anchor="middle">Frontend Performance Lab</text>
  <text x="600" y="520" font-family="Inter, -apple-system, sans-serif" font-weight="500" font-size="32" fill="${colors.accent}" text-anchor="middle">AI-Powered Frontend Engineering Platform</text>
  <text x="600" y="570" font-family="Inter, -apple-system, sans-serif" font-weight="400" font-size="24" fill="${colors.white}" opacity="0.6" text-anchor="middle">Analyze • Understand • Optimize</text>
</svg>`;

// Helper to write SVG
const writeSVG = (name, content) => {
  const filePath = path.join(BRAND_DIR, name);
  fs.writeFileSync(filePath, content);
  return filePath;
};

async function generateAll() {
  console.log('Generating SVGs...');
  const logoIconSvg = writeSVG('logo-icon.svg', generateIconSVG(colors.primary));
  const logoLightSvg = writeSVG('logo-light.svg', generateLogo(colors.primary, colors.textLight));
  writeSVG('logo-dark.svg', generateLogo(colors.primary, colors.textDark));
  writeSVG('logo.svg', generateLogo(colors.primary, colors.textLight));
  writeSVG('logo-gradient.svg', generateGradientLogo());

  writeSVG('wordmark-light.svg', generateWordmarkOnly(colors.textLight));
  writeSVG('wordmark-dark.svg', generateWordmarkOnly(colors.textDark));
  writeSVG('wordmark.svg', generateWordmarkOnly(colors.textLight));

  const faviconSvg = writeSVG('favicon.svg', generateFaviconSVG());
  const socialSvg = writeSVG('social-preview-source.svg', generateSocialPreviewSVG());

  console.log('Generating Rasters with Sharp...');
  
  // Favicons
  const faviconBuffer = await sharp(faviconSvg).resize(64, 64).png().toBuffer();
  // Save temp png for ico conversion
  const tempPngPath = path.join(BRAND_DIR, 'temp-favicon.png');
  fs.writeFileSync(tempPngPath, faviconBuffer);
  
  const icoBuffer = await pngToIco(tempPngPath);
  fs.writeFileSync(path.join(BRAND_DIR, 'favicon.ico'), icoBuffer);
  fs.unlinkSync(tempPngPath);

  // App icons
  await sharp(faviconSvg).resize(180, 180).png().toFile(path.join(BRAND_DIR, 'apple-touch-icon.png'));
  await sharp(faviconSvg).resize(192, 192).png().toFile(path.join(MANIFEST_DIR, 'icon-192.png'));
  await sharp(faviconSvg).resize(512, 512).png().toFile(path.join(MANIFEST_DIR, 'icon-512.png'));
  
  // For maskable icon, adding some padding (background is solid white or dark, let's use dark bg)
  await sharp(faviconSvg)
    .resize(400, 400, { fit: 'contain', background: { r: 15, g: 23, b: 42, alpha: 1 } })
    .extend({ top: 56, bottom: 56, left: 56, right: 56, background: { r: 15, g: 23, b: 42, alpha: 1 } })
    .png()
    .toFile(path.join(MANIFEST_DIR, 'maskable-icon-512.png'));

  await sharp(faviconSvg).resize(150, 150).png().toFile(path.join(BRAND_DIR, 'mstile-150.png'));

  // Social Previews
  await sharp(socialSvg).png().toFile(path.join(BRAND_DIR, 'social-preview.png'));
  await sharp(socialSvg).png().toFile(path.join(BRAND_DIR, 'github-social.png'));
  await sharp(socialSvg).png().toFile(path.join(BRAND_DIR, 'og-image.png'));
  await sharp(socialSvg).png().toFile(path.join(BRAND_DIR, 'twitter-card.png'));

  // GitHub Avatar (Square)
  await sharp(faviconSvg)
    .resize(512, 512, { fit: 'contain', background: { r: 15, g: 23, b: 42, alpha: 1 } })
    .extend({ top: 40, bottom: 40, left: 40, right: 40, background: { r: 15, g: 23, b: 42, alpha: 1 } })
    .png()
    .toFile(path.join(BRAND_DIR, 'github-avatar.png'));

  // Copy favicon to root for easier Nuxt serving
  fs.copyFileSync(path.join(BRAND_DIR, 'favicon.ico'), path.join(__dirname, '../public/favicon.ico'));
  fs.copyFileSync(path.join(BRAND_DIR, 'apple-touch-icon.png'), path.join(__dirname, '../public/apple-touch-icon.png'));

  console.log('All brand assets generated successfully!');
}

generateAll().catch(console.error);
