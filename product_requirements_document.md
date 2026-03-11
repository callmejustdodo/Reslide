# Reslide — Product Requirements Document

## 1. Overview

**Product:** Reslide — An open-source React framework for creating presentations programmatically.

**Vision:** Enable developers to build beautiful, exportable slide decks using React components, with an AI-native authoring experience that lets users prompt their way to a finished presentation.

**Target Users:**
- Developers who prefer code over drag-and-drop tools
- Teams wanting version-controlled, reviewable presentations
- AI-assisted content creators who want to generate decks from prompts
- Conference speakers who need code-heavy, customizable slides

---

## 2. Problem Statement

Existing presentation tools fall into two camps:

1. **GUI tools** (Google Slides, Keynote, PowerPoint) — not version-controllable, hard to automate, inconsistent styling across team decks
2. **Code-based tools** (Spectacle, Slidev, MDX Deck) — lack polished export (PDF/PPTX), poor theming, no file-based routing, no AI integration, dated component APIs

**Gap:** No React slide framework offers all of: file-based slide routing, modern component library (shadcn), triple export (Web/PDF/PPTX), and AI skills for prompt-driven creation.

---

## 3. Goals

| Goal | Success Metric |
|------|---------------|
| Easy to start | `npx create-reslide` to working deck in < 2 minutes |
| File-based routing | Each slide = its own file, ordered by filename or config |
| Beautiful defaults | Ship with polished themes built on shadcn/ui |
| Export everywhere | Web, PDF, and PPTX export from CLI |
| AI-native | Claude Code (or any AI) can generate full decks via skills |
| Open-source adoption | MIT licensed, npm installable, community-friendly |
| Monetizable | Clear open-core boundary for future paid features |

---

## 4. User Stories

### 4.1 Developer Creating a Talk

> As a developer, I want to create a conference talk by writing React components in individual files, so I can version-control my slides and use my existing dev tools (VS Code, TypeScript, Git).

**Acceptance Criteria:**
- Each slide is a separate `.tsx` file in `src/slides/`
- Slides are ordered by filename prefix (`01-`, `02-`, ...) or `reslide.config.ts`
- `reslide dev` starts a hot-reloading preview
- Arrow keys navigate between slides
- `reslide export pdf` produces a print-ready PDF
- `reslide export pptx` produces a PowerPoint file with speaker notes

### 4.2 AI-Assisted Deck Creation

> As a developer, I want to describe my presentation in natural language to Claude Code and get a working slide deck, so I can skip the boilerplate and focus on content.

**Acceptance Criteria:**
- `create-reslide` offers to install AI skills during setup
- Skills are installed at `.claude/skills/reslide/`
- Claude Code can read the skills and generate valid slide files
- Generated slides use correct Reslide components and conventions
- The generated deck renders without errors

### 4.3 Team Standardization

> As a team lead, I want a shared theme and component library for presentations, so all team decks look consistent and professional.

**Acceptance Criteria:**
- Custom themes via `createTheme()` or `reslide.config.ts`
- Themes control colors, fonts, spacing, slide dimensions
- shadcn/ui components available for custom slide content
- Theme can be packaged and shared as an npm package

### 4.4 Presenting

> As a presenter, I want a presenter mode with speaker notes, timer, and next-slide preview, so I can deliver my talk confidently.

**Acceptance Criteria:**
- Press `P` to open presenter view in a new window
- Presenter view shows: current slide, next slide, notes, timer
- Navigation syncs between presenter and audience windows
- Notes defined via `<Notes>` component or `meta.notes` export

---

## 5. Functional Requirements

### 5.1 Slide Authoring

| ID | Requirement |
|----|------------|
| F-01 | Slides authored as TSX files, one component per file |
| F-02 | File-based routing: `src/slides/01-name.tsx` or `src/slides/01-name/index.tsx` |
| F-03 | Dual ordering: filename prefix (default) or explicit `slides[]` in config |
| F-04 | Default export = slide component; named `meta` export = per-slide config |
| F-05 | JSX/TSX only — no MDX support |
| F-06 | Hot module replacement during development |

### 5.2 Components

| ID | Requirement |
|----|------------|
| F-10 | Layout components: `SlideLayout.Center`, `.Default`, `.TwoColumn`, `.Section`, `.Blank` |
| F-11 | Text components: `Title`, `Subtitle`, `Body` with size/color/weight/align props |
| F-12 | `Code` component with syntax highlighting (shiki) and line highlighting |
| F-13 | `Image` component with fit/sizing controls |
| F-14 | `List` component for bullet and numbered lists |
| F-15 | `Fragment` component for step-based reveal animations |
| F-16 | `Notes` component for speaker notes |
| F-17 | `Columns` component for multi-column layouts |
| F-18 | All components built on shadcn/ui primitives and Tailwind CSS |

### 5.3 Navigation & Interaction

| ID | Requirement |
|----|------------|
| F-20 | Keyboard navigation: arrow keys, space, escape |
| F-21 | Fragment/step progression within slides before advancing |
| F-22 | Slide transitions: fade, slide-left, slide-right, zoom, none |
| F-23 | URL-based slide addressing (`#/3` for slide 3) |
| F-24 | Touch/swipe support for mobile |

### 5.4 Theming

| ID | Requirement |
|----|------------|
| F-30 | Theme object controls colors, fonts, spacing, slide dimensions |
| F-31 | CSS variable injection on deck root (`--rs-*` prefix) |
| F-32 | `createTheme(overrides)` merges with defaults |
| F-33 | Built-in themes: default, dark, minimal |
| F-34 | shadcn CSS variables synced with Reslide theme |
| F-35 | Per-slide background color/image override via `meta` export |

### 5.5 Export

| ID | Requirement |
|----|------------|
| F-40 | Web export: static HTML SPA via Vite build |
| F-41 | PDF export: Playwright-based, one page per slide (optionally per step) |
| F-42 | PPTX export: screenshot-based with speaker notes preserved |
| F-43 | Export options configurable via CLI flags and `reslide.config.ts` |
| F-44 | `window.__reslide` bridge for export tooling (slide count, navigation, notes) |

### 5.6 Presenter Mode

| ID | Requirement |
|----|------------|
| F-50 | Presenter view in separate window (keyboard shortcut `P`) |
| F-51 | Shows: current slide, next slide preview, speaker notes, elapsed timer |
| F-52 | BroadcastChannel sync between presenter and audience windows |

### 5.7 CLI

| ID | Requirement |
|----|------------|
| F-60 | `npx create-reslide` scaffolds a new project with prompts |
| F-61 | `reslide dev` — Vite dev server with HMR |
| F-62 | `reslide build` — production build (static SPA) |
| F-63 | `reslide preview` — preview production build |
| F-64 | `reslide export pdf` / `reslide export pptx` / `reslide export all` |
| F-65 | `create-reslide` offers AI skills installation during setup |

### 5.8 AI Skills

| ID | Requirement |
|----|------------|
| F-70 | Skills follow agentskills.io specification |
| F-71 | `SKILL.md` manifest with YAML frontmatter and routing table |
| F-72 | 7 rule files covering all framework features |
| F-73 | Progressive disclosure: only load relevant rules on demand |
| F-74 | Installed at `.claude/skills/reslide/` in user projects |
| F-75 | Rules use hard constraints (MUST/FORBIDDEN) with copy-paste TSX examples |

---

## 6. Non-Functional Requirements

| ID | Requirement |
|----|------------|
| NF-01 | TypeScript-first: all packages fully typed, no `any` |
| NF-02 | Bundle size: core < 50KB gzip (excluding shiki) |
| NF-03 | Dev server startup: < 1 second |
| NF-04 | PDF export: < 5 seconds for a 20-slide deck |
| NF-05 | Zero-config defaults: works out of the box with `create-reslide` |
| NF-06 | Node.js >= 18 required |
| NF-07 | React >= 18 peer dependency |

---

## 7. Monetization Strategy (Open-Core)

### Free (MIT License)

- Core component library (`@reslide/core`)
- CLI (`@reslide/cli`, `create-reslide`)
- PDF export (`@reslide/export-pdf`)
- Basic PPTX export (screenshot-based)
- Built-in themes (default, dark, minimal)
- AI skills (`@reslide/skills`)
- Presenter mode
- Community themes

### Paid (Future — reslide.dev platform)

| Feature | Tier |
|---------|------|
| One-click web hosting for decks | Pro |
| Custom domains | Pro |
| Structural PPTX export (editable slides) | Pro |
| Team collaboration & shared themes | Team |
| Analytics (views, engagement, time per slide) | Pro |
| Password-protected decks | Pro |
| Premium theme marketplace | Revenue share |
| AI slide generation (hosted) | Pro |
| Version history & branching | Team |

---

## 8. Out of Scope (v1)

- MDX/Markdown authoring
- Real-time collaboration
- Cloud hosting platform
- Structural PPTX export (editable elements)
- Video/audio embedding
- Charts/data visualization components
- Plugin/extension system
- i18n support

---

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Playwright dependency size (~150MB) | Slow first export | Make `@reslide/export-pdf` and `export-pptx` optional peer deps |
| shadcn/ui updates breaking Reslide | Component breakage | Pin shadcn versions, test matrix in CI |
| Competing with Slidev/Spectacle | Low adoption | Differentiate on file routing + AI skills + export quality |
| PPTX screenshot quality | User disappointment | High-DPI screenshots (2x), clear docs on limitations |
| AI skills spec (agentskills.io) is young | Spec changes | Keep skills simple, easy to migrate |
