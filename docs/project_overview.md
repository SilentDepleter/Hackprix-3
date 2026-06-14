# Project Overview & Architecture

## Tech Stack

| Technology | Role | Version / Source |
|------------|------|------------------|
| **Vite** | Dev server & bundler | `^8.0.4` (via `package.json`) |
| **Tailwind CSS** | Utility-first CSS | CDN (`cdn.tailwindcss.com`) with `forms` & `container-queries` plugins |
| **Google Fonts** | Typography | Space Grotesk (headlines), Inter (body/labels) |
| **Material Symbols** | Icons | Google Material Symbols Outlined (variable weight/fill) |
| **Vanilla JS** | Logic (to be built) | ES Modules (`"type": "module"` in package.json) |

> **Important**: Tailwind is loaded via CDN `<script>` tag, NOT as a PostCSS plugin. The Tailwind config is defined inline in each HTML file inside a `<script id="tailwind-config">` block. This means Tailwind classes are processed at runtime in the browser.

## File Structure

```
aurora/
├── docs/                    # ← You are here. Documentation for backend work.
│   ├── README.md
│   ├── project_overview.md
│   ├── design_system.md
│   ├── screen_inventory.md
│   ├── backend_plan.md
│   └── element_id_map.md
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   ├── counter.js           # Vite boilerplate (unused, can be deleted)
│   ├── main.js              # Vite boilerplate entry (unused by our pages)
│   └── style.css            # Vite boilerplate styles (unused by our pages)
├── index.html               # Dashboard page (322 lines)
├── analytics.html           # Analytics page (279 lines)
├── add_expense.html          # Add Expense page (257 lines)
├── package.json
├── package-lock.json
└── .gitignore
```

### Important Notes on Structure

1. **Pages are standalone HTML files** — Each page (`index.html`, `analytics.html`, `add_expense.html`) is a self-contained HTML document with its own `<head>`, Tailwind config, and styles. They are **not** a single-page app.
2. **No shared JS yet** — There is no shared JavaScript module. When building backend logic, you should create a shared `src/aurora.js` (or similar) module and import it via `<script type="module">` in each page.
3. **The `src/` folder** currently has Vite boilerplate from project init. The files there (`main.js`, `counter.js`, `style.css`) are **not used** by any of our three pages. They can be cleaned up or ignored.
4. **Vite serves the root** — Vite serves the project root, so `index.html` is at `/`, `analytics.html` is at `/analytics.html`, etc.

## Page Navigation Map

```
┌──────────────────────┐
│     LEFT SIDEBAR     │  (identical on all 3 pages)
│                      │
│  [Dashboard]  ──────────→  index.html
│  [Analytics]  ──────────→  analytics.html
│  [Add Expense] ─────────→  add_expense.html
│  [Wallet]     ──────────→  (not built yet)
│  [Profile]    ──────────→  (not built yet)
│  [Settings]   ──────────→  (not built yet)
│                      │
└──────────────────────┘
```

## How Pages Load

1. Browser requests e.g. `/index.html`
2. Vite serves the HTML
3. Tailwind CDN script processes the inline config and applies utility classes
4. Google Fonts and Material Symbols load via their CDN links
5. No JavaScript logic runs — everything is static HTML content
