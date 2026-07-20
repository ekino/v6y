# Design

## Color Palette

Using OKLCH for consistent, perceptually uniform color throughout light and dark modes.

### Light Mode (Default)

- **Background**: `oklch(100% 0.00011 271.152)` — near-white, almost pure white
- **Foreground**: `oklch(0.145 0 0)` — almost black, high contrast for text
- **Primary**: `oklch(0.205 0 0)` — dark gray, used for key actions and sidebars
- **Primary Foreground**: `oklch(0.985 0 0)` — near-white, text on dark backgrounds
- **Secondary**: `oklch(0.97 0 0)` — very light gray, for subtle accents
- **Muted**: `oklch(0.97 0 0)` — very light gray, for disabled/secondary states
- **Muted Foreground**: `oklch(0.556 0 0)` — medium gray, subtle text
- **Card**: `oklch(1 0 0)` — pure white, card and surface containers
- **Border**: `oklch(0.922 0 0)` — light gray, subtle dividers
- **Input**: `oklch(0.922 0 0)` — light gray, form field backgrounds
- **Destructive**: `oklch(0.577 0.245 27.325)` — warm red, alerts and errors
- **Chart 1–5**: Warm, cool, cool, light, muted orange — for data visualization series

### Dark Mode

- **Background**: `oklch(0.145 0 0)` — dark gray/charcoal
- **Foreground**: `oklch(0.985 0 0)` — near-white, high contrast text
- **Primary**: `oklch(0.922 0 0)` — light gray, bright actions
- **Card**: `oklch(0.205 0 0)` — dark surface
- **Destructive**: `oklch(0.704 0.191 22.216)` — lighter red for dark backgrounds
- **Border**: `oklch(1 0 0 / 10%)` — white at 10% opacity, subtle dividers

### Sidebar

- **Light**: `oklch(0.985 0 0)` (near-white background) on foreground text
- **Dark**: `oklch(0.205 0 0)` (dark background) on light text
- **Primary button**: `oklch(0.205 0 0)` — acts as highlight/active state

## Typography

- **Font Family**: Inter, sans-serif (system fallback)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Strategy**: Clean, neutral, highly legible. Single-family hierarchy via weight variation.

### Recommended Scale

- **Display**: 28–36px, weight 700, line-height 1.2
- **Heading 1**: 24–28px, weight 600, line-height 1.3
- **Heading 2**: 20–24px, weight 600, line-height 1.3
- **Heading 3**: 18–20px, weight 600, line-height 1.4
- **Body**: 14–16px, weight 400, line-height 1.5
- **Small**: 12–14px, weight 400, line-height 1.5
- **Label**: 12–13px, weight 500, line-height 1.4

## Spacing & Rhythm

- **Base Unit**: 0.25rem (4px)
- **Radius**: 0.625rem (10px) — slightly rounded, modern but restrained
- **Breakpoints**: sm, md, lg (Tailwind defaults)
- **Max Content Width**: 1400px with consistent side gutters

## Components

Built with Radix UI + class-variance-authority (CVA) for consistent variants.

### Core Components

- **Button**: Primary (dark), secondary (light), outline, ghost variants. Sizes: sm, md, lg.
- **Input / Textarea**: Light gray background, dark text, clear focus states via `--ring`
- **Select / Dropdown**: Radix-based, inherits theme colors
- **Card**: White background (light) / dark gray (dark), subtle border or shadow
- **Badge**: Primary, secondary, destructive variants
- **Alert**: Destructive (red) for errors, semantic use
- **Pagination**: Minimal, inherits button and text styling
- **Breadcrumb**: Text-based, slash-separated, low visual weight
- **Avatar**: Circular, supports initials or images
- **Checkbox / Radio**: Radix-based, accessible
- **Accordion**: Smooth expand/collapse, `accordion-down` / `accordion-up` animations
- **Sidebar**: Dedicated color role with primary/accent highlights

## Motion

### Animations

- **Accordion**: 0.2s ease-out, smooth open/close
- **Custom Fade-In**: 0.5s ease-out, subtle upward motion (0–12px)
- **Gradient Pan** (optional): 8s ease infinite, for animated backgrounds

### Principles

- Ease-out curves (no bounce, no elastic)
- Duration: 200–500ms for micro-interactions, 500ms+ for larger reveals
- Respect `prefers-reduced-motion: reduce`

## Dark Mode

- Implemented via `.dark` class on document root or parent container
- Full color system override via CSS variables
- No separate file; light/dark variants coexist in single CSS layer

## Design Principles for This System

1. **Restrained Palette**: Nearly monochromatic with one warm accent (red for destructive). Lets data and content speak.
2. **High Contrast**: Dark text on light, light text on dark. Every color pair meets WCAG AA minimum.
3. **GitHub-Like Aesthetic**: Clean, professional, developer-friendly. No decorative gradients or excess personality.
4. **Accessible by Default**: Color is never the only signal; text, icons, and positioning reinforce meaning.
5. **Progressive Disclosure**: Secondary options and advanced settings hidden until needed; primary surfaces remain clear.

## File Locations

- **Colors & Theme**: CSS variables in `src/styles.css` (ui-kit-front)
- **Components**: `src/components/atoms/` (fundamental) and `src/components/molecules/` (composed)
- **Animations**: Keyframes in `src/styles.css`
- **Tailwind Config**: Imported via `@import 'tailwindcss'` in `src/styles.css`
