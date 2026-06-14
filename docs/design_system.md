# Design System — "Neon Cartographer"

## Philosophy

Aurora uses a dark-mode, glassmorphism-heavy aesthetic with neon magenta and cyan accent colors. The UI should feel futuristic, like a cockpit dashboard from a sci-fi movie. All surfaces are dark with subtle transparency and blur. Interactions use glow effects rather than traditional shadows.

## Color Palette (Tailwind Custom Tokens)

These are defined in the inline `tailwind.config` in each HTML file's `<head>`.

### Core Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#f382ff` | Main accent, buttons, active states |
| `primary-dim` | `#ec63ff` | Slightly darker primary |
| `primary-container` | `#ed69ff` | Primary backgrounds |
| `on-primary` | `#540061` | Text on primary surfaces |
| `on-primary-fixed` | `#000000` | Text on primary-fixed (used for button text) |
| `secondary` | `#ac89ff` | Purple accent, academic category |
| `secondary-dim` | `#874cff` | Darker secondary |
| `tertiary` | `#8ff5ff` | Cyan accent, health indicators, transport |
| `tertiary-dim` | `#00deec` | Deeper cyan |
| `error` | `#ff6e84` | Error/warning states |
| `error-dim` | `#d73357` | Darker error |

### Surface Colors (Dark Mode)

| Token | Hex | Usage |
|-------|-----|-------|
| `background` / `surface` | `#0e0e12` | Page background |
| `surface-dim` | `#0e0e12` | Same as background |
| `surface-container-lowest` | `#000000` | Deepest container (inputs, sunken cards) |
| `surface-container-low` | `#131317` | Low-level containers (category buttons, list items) |
| `surface-container` | `#19191e` | Standard containers (expense items, cards) |
| `surface-container-high` | `#1f1f25` | Elevated containers (icon backgrounds) |
| `surface-container-highest` | `#25252b` | Most elevated (photo upload button) |
| `surface-bright` | `#2c2b32` | Hover states on containers |
| `on-surface` | `#f3eff6` | Primary text color |
| `on-surface-variant` | `#acaab0` | Secondary/muted text |
| `outline` | `#76757a` | Borders |
| `outline-variant` | `#48474c` | Subtle borders (used heavily with `/10`, `/20` opacity) |

### Hardcoded Accent (Not in Tailwind Config)

| Value | Usage |
|-------|-------|
| `#d946ef` | Used as a raw hex throughout for the neon magenta glow. Appears in `bg-[#d946ef]`, `text-[#d946ef]`, and `shadow-[0_0_Xpx_rgba(217,70,239,Y)]` |
| `#050508` | True-black body background, sidebar background |
| `#0e0e12` | Header backgrounds (with opacity) |

## Typography

| Font | Tailwind Class | Usage |
|------|---------------|-------|
| **Space Grotesk** | `font-headline` or `font-['Space_Grotesk']` | Headlines, hero numbers, amounts, logo |
| **Inter** | `font-body` or `font-label` or `font-['Inter']` | Body text, labels, metadata, buttons |

### Text Style Patterns

- **Hero numbers**: `font-headline text-[7rem] font-bold text-primary neon-glow-primary`
- **Section headers**: `font-['Space_Grotesk'] text-xs font-bold uppercase tracking-[0.2em] text-zinc-400`
- **Amounts**: `font-headline font-bold text-primary` (or `text-tertiary`, `text-secondary` by category)
- **Metadata**: `text-[11px] text-on-surface-variant uppercase tracking-widest`
- **Labels**: `font-label text-xs uppercase tracking-widest text-on-surface-variant`

## Custom CSS Classes

### `.glass-panel`
```css
background: rgba(25, 25, 30, 0.6);
backdrop-filter: blur(20px);
```
Used for: Hero card, timeline panel, analytics cards.

### `.glass-card` (add_expense.html only)
```css
background: rgba(25, 25, 30, 0.6);
backdrop-filter: blur(20px);
```
Same as glass-panel, different name on the add expense page.

### `.neon-glow-primary`
```css
/* On index.html: */
text-shadow: 0 0 10px rgba(243, 130, 255, 0.5), 0 0 20px rgba(243, 130, 255, 0.3);

/* On analytics.html & add_expense.html: */
box-shadow: 0 0 15px rgba(243, 130, 255, 0.4);
```
Used for: Active primary elements that need a "glow" effect.

### `.wireframe-bg` / `.wireframe-grid`
Creates a subtle grid pattern in the background.
```css
background-image:
    linear-gradient(to right, rgba(72, 71, 76, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(72, 71, 76, 0.05) 1px, transparent 1px);
background-size: 40px 40px;
```

## Layout Structure (Desktop)

Every page follows this layout:

```
┌──────────┬──────────────────────────────────────────────┐
│          │  Sticky Header (backdrop-blur)               │
│  Fixed   ├──────────────────────────────────────────────┤
│  Sidebar │                                              │
│  w-64    │  Scrollable Main Content                     │
│          │  (max-w-7xl or max-w-5xl, mx-auto)           │
│          │                                              │
│          │                                              │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

- **Sidebar**: `w-64 fixed inset-y-0 left-0`, z-index 50
- **Main panel**: `flex-1 ml-64`, scrollable
- **Header**: `sticky top-0`, z-index 40, backdrop blur
- **Content**: padded `p-10`, max-width centered

## Icon System

Uses **Google Material Symbols Outlined** with variable font settings:
```css
font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
```

Some icons use filled variant: `style="font-variation-settings: 'FILL' 1;"`

Icons used throughout:
- `home`, `insights`, `add_circle`, `account_balance_wallet`, `person`, `settings`
- `notifications`, `restaurant`, `directions_car`, `print`, `location_on`
- `analytics`, `local_fire_department`, `category`, `history_edu`, `schedule`
- `calendar_today`, `wallet`, `add_a_photo`, `bolt`, `arrow_back`, `chevron_right`
