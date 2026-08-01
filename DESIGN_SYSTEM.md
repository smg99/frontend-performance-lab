# Frontend Performance Lab - Design System

The canonical source of truth for the visual language of the platform.

## Design Principles

- **Modern & Premium**: Clean lines, subtle gradients, highly refined shadows.
- **Minimal**: Less is more. Use spacing to create hierarchy, not borders.
- **Developer-focused**: Code-first typography (`Geist Mono`), dark mode by default aesthetic (even in light mode it feels technical).
- **Accessible**: Keyboard navigable, high contrast, WCAG AA compliant.

## Typography

We use the **Geist** font family to achieve a technical, crisp aesthetic.

- **Sans-serif**: `Geist Sans`
- **Monospace**: `Geist Mono`

_Tailwind mapping: `font-sans` and `font-mono`._

## Semantic Tokens

Do not use hardcoded hex values or generic tailwind colors like `bg-red-500` in the application. Always use semantic layer tokens.

### Backgrounds

- `bg-background-base`: The lowest level page background.
- `bg-background-surface`: Elevated elements (cards, dialogs).
- `bg-background-hover`: Hover state for surfaces or subtle highlights.

### Foreground (Text)

- `text-foreground-primary`: Main text (headings, body).
- `text-foreground-muted`: Secondary text (descriptions, metadata).
- `text-foreground-inverse`: Text on solid colored backgrounds (e.g. inside a primary button).

### Borders

- `border-border-subtle`: Dividers, structural lines.
- `border-border-strong`: Active borders, prominent outlines.
- `border-border-focus`: Focus rings.

### Feedback

- `success`, `warning`, `danger` (Text colors)
- `success-bg`, `warning-bg`, `danger-bg` (Light background tints)
- `success-border`, `warning-border`, `danger-border` (Subtle colored borders)

## Component Usage

All primitives are located in `/app/components/ui`. Composed patterns are in `/app/components/patterns`.

### Buttons

Buttons should clearly indicate their state.

- **Primary**: The main call to action.
- **Secondary**: Alternative actions.
- **Outline**: Actions that shouldn't draw immediate attention.
- **Ghost**: Tertiary actions, usually icon buttons or subtle links.
- **Destructive**: Destructive actions (Deletions).

### Layout System

Use the standard layout components in `/app/components/layout/` instead of manually applying max-widths and paddings.

- `Container`: Bounds the max-width of the page.
- `Section`: Vertical padding blocks.
- `SplitView`: For documentation sidebars or dashboards.

## Accessibility Guidelines

- **Focus**: Never remove focus outlines without providing a clear alternative. Use the global `.focus-ring` utility class.
- **Motion**: Respect `prefers-reduced-motion`. The UI automatically disables transitions via the CSS `@media` query and Tailwind utilities.
- **ARIA**: Use `radix-vue` for complex interactive components (Tabs, Dialogs, Accordion, Tooltips) as they automatically handle ARIA state.

## Do's and Don'ts

- **DO** use the `cn()` utility for merging Tailwind classes safely (`app/utils/cn.ts`).
- **DO** test your components on the `/design-system` page across all themes and densities.
- **DON'T** mix icon libraries. Only use `lucide-vue-next`.
- **DON'T** use `window.addEventListener('resize')` for layouts. Use CSS Grid/Flexbox or `ResizeObserver`.
