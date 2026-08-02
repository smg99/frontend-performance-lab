# Brand Guidelines: Frontend Performance Lab

## Brand Philosophy

The brand identity for Frontend Performance Lab is rooted in precision, analysis, and modern frontend engineering. It intentionally avoids cartoonish or generic representations in favor of a clean, technical aesthetic that feels at home alongside premium developer tools like Linear, Vercel, Raycast, Cursor, and GitHub.

The primary concept combines a **Laboratory Flask** and **Code Brackets `< >`**. It represents an engineering laboratory dedicated to dissecting, analyzing, and optimizing code performance.

## Color Palette

- **Primary (Blue)**: `#2563EB`
- **Secondary (Purple)**: `#7C3AED`
- **Accent (Emerald)**: `#10B981`
- **Background Dark**: `#020420` (or standard dark slate `#0F172A`)
- **Background Light**: `#FFFFFF`
- **Text Dark**: `#F8FAFC`
- **Text Light**: `#0F172A`

## Typography

The wordmark uses **Inter** (SemiBold/Bold), a clean, open-source geometric sans-serif font designed for highly legible interfaces.

## Asset Types

### Vector Assets (SVGs)

All primary logos are rendered as clean, flat SVGs. No AI-generated raster scaling artifacts.

- `logo-light.svg` (for light backgrounds)
- `logo-dark.svg` (for dark backgrounds)
- `logo.svg` (default standard)
- `logo-icon.svg` (just the flask symbol)
- `wordmark.svg`, `wordmark-light.svg`, `wordmark-dark.svg` (textual logotypes)
- `logo-gradient.svg` (special edition with linear gradients)
- `favicon.svg` (bolded solid version optimized for extreme scaling)

### Raster Assets

For platforms that require rasters (PWA, social previews), SVG elements were cleanly rendered down using `sharp` at precise bounds.

- Favicons: `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `maskable-icon-512.png`, `mstile-150.png`
- Social Previews: `social-preview.png`, `github-social.png`, `og-image.png`, `twitter-card.png`
- Avatars: `github-avatar.png`

## Allowed Usage

1. Maintain consistent aspect ratios (do not stretch the logo).
2. Ensure high contrast against the background (use `logo-dark` on dark backgrounds, `logo-light` on light backgrounds).
3. Provide adequate clear space around the logo (at least the height of the flask).

## Incorrect Usage

- Do not outline the wordmark text.
- Do not add arbitrary drop shadows to the flat logo elements.
- Do not use raster images for web UI where SVGs are possible.
- Do not alter the color palette or gradient stops without updating the underlying generation script (`scripts/generate-brand-assets.mjs`).

## Export Process

If you wish to tweak the brand identity (e.g. changing stroke thickness or colors), you must:

1. Update `scripts/generate-brand-assets.mjs`
2. Run `node scripts/generate-brand-assets.mjs` to regenerate all SVGs and high-quality scaled rasters simultaneously.
