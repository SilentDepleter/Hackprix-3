# Aurora — Expense Tracker for Students

## What Is This?

Aurora is a **student-first expense tracker** web application with a futuristic dark-mode glassmorphism UI called the "Neon Cartographer" design system. It is currently a **frontend-only scaffold** — all data displayed is hardcoded placeholder content. The next phase is to build the JavaScript backend logic to make everything functional.

## Project Status

| Layer | Status |
|-------|--------|
| UI / HTML / CSS | ✅ Complete — 3 fully designed desktop pages |
| Navigation | ✅ Complete — Persistent left sidebar with working links |
| JavaScript Logic | ❌ Not started — All data is hardcoded |
| Data Persistence | ❌ Not started — No storage layer |
| User Authentication | ❌ Not started |

## Quick Start

```bash
cd aurora
npm install
npm run dev
# Opens at http://localhost:5173/
```

## Documentation Index

Read these files **in order** to understand the full picture:

| # | File | Purpose |
|---|------|---------|
| 1 | `project_overview.md` | Architecture, tech stack, file structure |
| 2 | `design_system.md` | Color tokens, fonts, CSS classes, UI patterns |
| 3 | `screen_inventory.md` | Every UI element on every page with its current state |
| 4 | `backend_plan.md` | The full backend implementation plan — data models, functions, storage, and wiring instructions |
| 5 | `element_id_map.md` | Mapping of every interactive HTML element to the JS function it needs |

## Key Principle

> The frontend is **complete and should not be redesigned**. The backend work is about wiring JavaScript logic into the existing HTML structure — reading from inputs, writing to DOM elements, and persisting data via localStorage.
