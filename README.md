# BUILDING MY WORLD

An interactive 3D architectural developer portfolio for **Armin Tayebi** — telling a scroll-driven visual story in which a digital glass-and-wireframe construct emerges from an empty void across five chapters.

## Concept & Sections

1. **01 // THE FOUNDATION** — Opening digital void, emerging geometric plinth, introduction, and interactive scroll cue.
2. **02 // THE BLUEPRINT** — Technical wireframe drafting plane mapping my learning journey across Computer Science, Python, Java, practical engineering, and AI exploration.
3. **03 // THE CORE SYSTEMS** — Multi-tiered interactive 3D stack (`Python`, `Java`, `FastAPI`, `SQLite`, `Git & GitHub`, `API Integration`, `Artificial Intelligence`, `Machine Learning`) with honest proficiency tiers.
4. **04 // THE PROJECT CHAMBERS** — Five suspended architectural chambers showcasing verified repositories under [`ArminT13`](https://github.com/ArminT13):
   - **StudyMate** (`github.com/ArminT13/StudyMate`)
   - **California House Price Prediction** (`github.com/ArminT13/house-price-prediction`)
   - **FreelanceFlow** (`github.com/ArminT13/FreelanceFlow`)
   - **Predict & Bet** (`github.com/ArminT13/predict-bet-telegram-bot`)
   - **Warehouse Management System** (`github.com/ArminT13/warehouse-management`)
5. **05 // THE HORIZON** — Panoramic pullback revealing the completed structure (`THIS WORLD IS STILL UNDER CONSTRUCTION.`), verified GitHub link, and contact placeholders.

## Stack & Architecture

- **Framework**: React 19 + TypeScript + Vite + Tailwind CSS v4
- **3D Rendering**: Three.js (`WorldEngine`) with procedural architectural geometry, `EdgesGeometry` energy ribs, `InstancedMesh` particles, lightweight custom GLSL conduit shaders, GPU capability budgeting, and a 2D SVG architectural fallback when WebGL is unavailable
- **Scroll & Motion**: GSAP + ScrollTrigger + Lenis smooth scrolling, with stabilized sticky reading zones and `prefers-reduced-motion` support
- **Typography**: Space Grotesk (headlines) & Inter (body) bundled locally via `@fontsource`

## Development & Verification

```bash
npm install
npm run dev      # Start local dev server
npm test         # Run Vitest unit & UI tests
npm run lint     # Run oxlint checks
npm run build    # Type-check with tsc -b and build dist/
npm run preview  # Preview production bundle
```

## Updating Placeholders

All profile, skill, project, screenshot-placeholder, email-placeholder, and social-placeholder entries live in [`src/data/portfolio.ts`](src/data/portfolio.ts).
