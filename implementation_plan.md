# Reslide — Implementation Plan

> Based on [Architecture Document](./architecture.md) and [PRD](./product_requirements_document.md)

---

## Phase 1: Monorepo Foundation

**Goal:** Working monorepo with all packages scaffolded, builds passing, and a "hello world" slide rendering.

### 1.1 Monorepo Setup

- [x] Initialize pnpm workspace with `pnpm-workspace.yaml`
- [x] Create `turbo.json` with build/test/typecheck/lint pipelines
- [x] Create `tsconfig.base.json` with shared compiler options (strict, ESNext, React JSX)
- [x] Create package directories: `packages/core`, `packages/cli`, `packages/create-reslide`, `packages/export-pdf`, `packages/export-pptx`, `packages/skills`
- [x] Configure `tsup.config.ts` in each package (ESM + CJS dual output)
- [x] Configure `vitest.config.ts` in `packages/core`
- [x] Add root scripts: `dev`, `build`, `test`, `typecheck`

**Files created:**
```
package.json
pnpm-workspace.yaml
turbo.json
tsconfig.base.json
packages/core/package.json
packages/core/tsconfig.json
packages/core/tsup.config.ts
packages/core/vitest.config.ts
packages/cli/package.json
packages/cli/tsconfig.json
packages/cli/tsup.config.ts
packages/create-reslide/package.json
packages/create-reslide/tsconfig.json
packages/create-reslide/tsup.config.ts
packages/export-pdf/package.json
packages/export-pdf/tsconfig.json
packages/export-pdf/tsup.config.ts
packages/export-pptx/package.json
packages/export-pptx/tsconfig.json
packages/export-pptx/tsup.config.ts
packages/skills/package.json
```

### 1.2 Core Types

- [x] Define all TypeScript interfaces in `packages/core/src/types/index.ts`
  - `ReslideConfig`, `ReslideTheme`, `SlideMeta`, `SlideEntry`
  - `TransitionConfig`, `TransitionDefinition`
  - `StepAnimation`, `FragmentProps`
  - `DeckProps`, `DeckState`, `DeckContextValue`, `SlideContextValue`
  - `ReslideExportBridge`

**Files created:**
```
packages/core/src/types/index.ts
packages/core/src/index.ts          # Public barrel export
```

### 1.3 Context System

- [x] Implement `ThemeContext` + `ThemeProvider`
  - Accept `ReslideTheme`, inject CSS variables onto root element
  - Sync shadcn CSS variables (`--primary`, `--background`, etc.)
- [x] Implement `DeckContext` + `DeckProvider`
  - Manage `currentSlide`, `currentStep` state
  - Provide navigation functions (`goToSlide`, `next`, `prev`, `nextStep`, `prevStep`)
  - Step/slide advancement logic: steps first, then slide
- [x] Implement `SlideContext` + `SlideProvider`
  - Per-slide step registry via `registerFragment()`
  - Track `totalSteps` for the current slide

**Files created:**
```
packages/core/src/context/ThemeContext.tsx
packages/core/src/context/DeckContext.tsx
packages/core/src/context/SlideContext.tsx
```

### 1.4 Minimal Components

- [x] `Deck` — Root component. Renders `ThemeProvider` > `DeckProvider` > slides. Handles keyboard events (arrow keys, escape). Applies viewport scaling (`transform: scale`).
- [x] `SlideFrame` — Internal wrapper for each slide. Sets 1920×1080 container, applies background from `meta`.
- [x] `SlideLayout.Center` — Flex container, centered vertically and horizontally.
- [x] `SlideLayout.Default` — Top-left aligned with padding.
- [x] `Title` — Large heading text using theme fonts/colors.
- [x] `Body` — Body text.
- [x] `Notes` — Registers speaker notes in SlideContext (renders nothing visible).

**Files created:**
```
packages/core/src/components/Deck.tsx
packages/core/src/components/SlideFrame.tsx
packages/core/src/components/SlideLayout.tsx
packages/core/src/components/Title.tsx
packages/core/src/components/Body.tsx
packages/core/src/components/Notes.tsx
```

### 1.5 Hooks

- [ ] `useDeck()` — Returns `DeckContextValue`
- [ ] `useSlide()` — Returns `SlideContextValue`
- [ ] `useTheme()` — Returns `ReslideTheme`

**Files created:**
```
packages/core/src/hooks/useDeck.ts
packages/core/src/hooks/useSlide.ts
packages/core/src/hooks/useTheme.ts
```

### 1.6 Default Theme

- [x] Define `defaultTheme` with sensible colors, fonts, spacing
- [x] Implement `createTheme(overrides)` deep-merge utility

**Files created:**
```
packages/core/src/themes/types.ts        # (already in types/index.ts, re-export)
packages/core/src/themes/defaultTheme.ts
packages/core/src/themes/createTheme.ts
```

### 1.7 Verification

- [ ] Create `examples/basic/` with a 3-slide deck (hardcoded imports, no routing yet)
- [ ] Run with Vite (`vite dev` directly), verify slides render and navigate
- [ ] `pnpm build` succeeds across all packages
- [ ] `pnpm typecheck` passes

---

## Phase 2: File-Based Routing + Vite Plugin

**Goal:** Slides discovered from `src/slides/` automatically, ordered by filename or config.

### 2.1 Vite Plugin

- [ ] Create `packages/cli/src/vite/plugin.ts`
  - `resolveId()` — handle `virtual:reslide/slides` and `virtual:reslide/config`
  - `load()` — scan `src/slides/`, sort by filename prefix, generate import code
  - `handleHotUpdate()` — re-scan when files added/removed in `src/slides/`
- [ ] Implement ordering algorithm:
  - Extract numeric prefix (e.g., `01-intro` → order 1, name `intro`)
  - If `reslide.config.ts` has `slides[]`, use that order instead
  - Match config names to files (strip prefix for matching)
- [ ] Create `virtual:reslide/config` module from `reslide.config.ts`

**Files created:**
```
packages/cli/src/vite/plugin.ts
packages/cli/src/vite/discover.ts      # Slide file discovery + sorting logic
packages/cli/src/vite/virtual.ts       # Virtual module code generation
packages/cli/src/utils/config.ts       # Config loader
```

### 2.2 TypeScript Support for Virtual Modules

- [ ] Create `packages/cli/client.d.ts` with module declarations for `virtual:reslide/slides` and `virtual:reslide/config`

**Files created:**
```
packages/cli/client.d.ts
```

### 2.3 CLI Commands

- [ ] Implement CLI entry with `cac`
- [ ] `reslide dev` — calls `createServer()` from Vite with reslide plugin
- [ ] `reslide build` — calls `build()` from Vite
- [ ] `reslide preview` — calls `preview()` from Vite
- [ ] Add `bin` field to `@reslide/cli` package.json

**Files created:**
```
packages/cli/src/index.ts              # CLI entry (bin: reslide)
packages/cli/src/commands/dev.ts
packages/cli/src/commands/build.ts
packages/cli/src/commands/preview.ts
```

### 2.4 Update Deck to Use Virtual Modules

- [ ] Update `main.tsx` template to import from `virtual:reslide/slides`
- [ ] Update `Deck` component to accept `slides: SlideEntry[]` prop
- [ ] Render slides dynamically from the array

### 2.5 Verification

- [ ] Create a test project with 3 slide files in `src/slides/`
- [ ] `reslide dev` starts and slides are discovered in correct order
- [ ] Add a new slide file → HMR picks it up
- [ ] Add `slides[]` to config → order changes
- [ ] `reslide build` produces working static SPA

---

## Phase 3: Components + Animations

**Goal:** Full component library with step-based animations and slide transitions.

### 3.1 Remaining Components

- [ ] `Subtitle` — Styled subtitle text
- [ ] `Code` — Syntax highlighting with shiki
  - Async shiki initialization (load highlighter once)
  - `language`, `highlightLines`, `showLineNumbers` props
  - Wrapped in shadcn `Card` for visual framing
- [ ] `Image` — `<img>` with `fit`, `width`, `height` props
- [ ] `List` — Ordered/unordered with Tailwind styling
- [ ] `Columns` — CSS grid with `sizes` (column ratios) and `gap` props
- [ ] `SlideLayout.TwoColumn` — Shorthand two-column layout
- [ ] `SlideLayout.Section` — Large centered text for section dividers
- [ ] `SlideLayout.Blank` — No padding or styling

**Files created:**
```
packages/core/src/components/Subtitle.tsx
packages/core/src/components/Code.tsx
packages/core/src/components/Image.tsx
packages/core/src/components/List.tsx
packages/core/src/components/Columns.tsx
```

### 3.2 Fragment + Step System

- [ ] `Fragment` component
  - Calls `registerFragment()` on mount to get step order
  - Reads `currentStep` from `SlideContext`
  - Applies CSS class based on visibility (`visible = step >= order`)
  - Supports `animation` prop: `appear`, `fadeIn`, `flyIn`
- [ ] `useStep()` hook — low-level hook for custom step animations
- [ ] CSS transition classes for each animation type
- [ ] Update `DeckProvider` navigation: right arrow advances step first, then slide

**Files created:**
```
packages/core/src/components/Fragment.tsx
packages/core/src/hooks/useStep.ts
packages/core/src/animations/appear.ts
packages/core/src/animations/fadeIn.ts
packages/core/src/animations/flyIn.ts
packages/core/src/styles/animations.css
```

### 3.3 Slide Transitions

- [ ] `TransitionContainer` component
  - Renders current + previous slide during transition
  - Applies enter/exit CSS styles
  - Blocks navigation during transition
- [ ] Built-in transitions: `fade`, `slideLeft`, `slideRight`, `zoom`, `none`
- [ ] Per-slide transition override via `meta.transition`

**Files created:**
```
packages/core/src/components/TransitionContainer.tsx
packages/core/src/transitions/fade.ts
packages/core/src/transitions/slideLeft.ts
packages/core/src/transitions/slideRight.ts
packages/core/src/transitions/zoom.ts
packages/core/src/transitions/none.ts
packages/core/src/transitions/index.ts
```

### 3.4 Additional Themes

- [ ] `darkTheme` — Dark background, light text
- [ ] `minimalTheme` — Muted colors, clean typography

**Files created:**
```
packages/core/src/themes/darkTheme.ts
packages/core/src/themes/minimalTheme.ts
packages/core/src/themes/index.ts
```

### 3.5 Tailwind + shadcn Setup for Core

- [ ] Add Tailwind config for the core package
- [ ] Configure shadcn component dependencies
- [ ] Ensure theme CSS variables sync with shadcn variables

### 3.6 Verification

- [ ] All components render correctly with default theme
- [ ] Fragments reveal in correct order with animations
- [ ] Slide transitions animate between slides
- [ ] Dark theme applies consistently
- [ ] Unit tests for Fragment step registration and ordering
- [ ] Unit tests for transition state machine

---

## Phase 4: `create-reslide` Scaffolding

**Goal:** `npx create-reslide my-deck` creates a ready-to-run project.

### 4.1 Scaffolding CLI

- [ ] Interactive prompts using `@clack/prompts`:
  1. Project name (default: directory argument)
  2. Theme: default / dark / minimal
  3. Install AI skills? (Y/n)
  4. Package manager: pnpm / npm / yarn / bun
- [ ] Template file generation (from embedded templates):
  - `package.json` with `@reslide/core`, `@reslide/cli` deps
  - `vite.config.ts` with react + reslide plugins
  - `reslide.config.ts` with chosen theme
  - `tailwind.config.ts`
  - `tsconfig.json`
  - `index.html`
  - `src/main.tsx`
  - `src/slides/01-intro.tsx` (starter slide)
  - `src/slides/02-content.tsx` (example with Fragment)
  - `src/slides/03-closing.tsx`
  - `src/lib/utils.ts` (cn utility)
  - `src/components/ui/` (pre-installed shadcn components)
  - `components.json` (shadcn config)
- [ ] If skills selected: copy `@reslide/skills` files to `.claude/skills/reslide/`
- [ ] Run `<pm> install` after scaffolding
- [ ] Print success message with next steps

**Files created:**
```
packages/create-reslide/src/index.ts
packages/create-reslide/src/prompts.ts
packages/create-reslide/src/scaffold.ts
packages/create-reslide/src/templates/    # Template files (embedded or file-based)
```

### 4.2 Verification

- [ ] `npx create-reslide test-project` creates a working project
- [ ] `cd test-project && pnpm dev` starts dev server
- [ ] Starter slides render and navigate correctly
- [ ] shadcn components usable inside slides

---

## Phase 5: Export Pipeline

**Goal:** `reslide export pdf` and `reslide export pptx` produce output files.

### 5.1 Export Bridge

- [ ] Create `ExportBridge` component in core
  - Exposes `window.__reslide` with navigation, metadata, notes
  - `goTo(slide, step)` returns Promise (settles after render)
  - Only injected when `mode === 'export'` (env variable or URL param)

**Files created:**
```
packages/core/src/components/ExportBridge.tsx
```

### 5.2 Shared Export Utilities

- [ ] Start Vite preview server programmatically
- [ ] Launch Playwright browser
- [ ] Iterate slides/steps helper

**Files created:**
```
packages/cli/src/export/server.ts        # Preview server launcher
packages/cli/src/export/browser.ts       # Playwright browser management
packages/cli/src/export/iterate.ts       # Slide/step iteration logic
```

### 5.3 PDF Export

- [ ] Implement `exportPdf()` in `@reslide/export-pdf`
  - Screenshot each slide/step at 1920×1080
  - Assemble into PDF using `pdf-lib`
  - Options: format, landscape, includeSteps
- [ ] Wire into CLI: `reslide export pdf [--output] [--include-steps] [--format]`

**Files created:**
```
packages/export-pdf/src/index.ts
packages/export-pdf/src/renderer.ts
packages/export-pdf/src/options.ts
```

### 5.4 PPTX Export

- [ ] Implement `exportPptx()` in `@reslide/export-pptx`
  - Screenshot each slide at 2x DPI
  - Create PPTX with `pptxgenjs`, embed screenshots as full-slide images
  - Extract and attach speaker notes
  - Options: layout, includeSteps, includeNotes
- [ ] Wire into CLI: `reslide export pptx [--output] [--include-notes]`

**Files created:**
```
packages/export-pptx/src/index.ts
packages/export-pptx/src/converter.ts
packages/export-pptx/src/options.ts
```

### 5.5 CLI Export Command

- [ ] `reslide export pdf` — runs build then PDF export
- [ ] `reslide export pptx` — runs build then PPTX export
- [ ] `reslide export all` — runs both sequentially
- [ ] Progress indicators during export

**Files created:**
```
packages/cli/src/commands/export.ts
```

### 5.6 Verification

- [ ] Export basic example to PDF → correct page count, readable content
- [ ] Export basic example to PPTX → opens in PowerPoint/Google Slides
- [ ] Speaker notes appear in PPTX
- [ ] Fragment steps create separate pages/slides when `--include-steps` is set
- [ ] Export completes in < 5 seconds for a 10-slide deck

---

## Phase 6: Presenter Mode

**Goal:** Press `P` to open a presenter view with notes, timer, and slide preview.

### 6.1 Presenter View Components

- [ ] `PresenterView` — Main presenter layout
  - Current slide (rendered at small scale)
  - Next slide preview
  - Speaker notes (scrollable)
  - Elapsed timer with start/pause/reset
  - Slide counter (X / Y)
- [ ] `PresenterTimer` — Stopwatch component
- [ ] `PresenterNotes` — Notes display with scroll

**Files created:**
```
packages/core/src/presenter/PresenterView.tsx
packages/core/src/presenter/PresenterTimer.tsx
packages/core/src/presenter/PresenterNotes.tsx
packages/core/src/presenter/PresenterLayout.tsx
```

### 6.2 BroadcastChannel Sync

- [ ] `useBroadcastSync()` hook
  - Creates `BroadcastChannel('reslide-sync')`
  - Sends navigation events on slide/step change
  - Receives and applies navigation from other window
  - Prevents echo loops via `source` field

**Files created:**
```
packages/core/src/hooks/useBroadcastSync.ts
```

### 6.3 Integration

- [ ] `P` key opens presenter window via `window.open()`
- [ ] URL parameter `?presenter=true` renders `PresenterView` instead of `Deck`
- [ ] `usePresenterMode()` hook for custom presenter logic

### 6.4 Verification

- [ ] Press `P` → new window opens with presenter layout
- [ ] Navigate in either window → other syncs
- [ ] Speaker notes display correctly
- [ ] Timer starts on first navigation

---

## Phase 7: AI Skills

**Goal:** Claude Code can generate complete slide decks using installed skills.

### 7.1 Write Skill Files

- [ ] `SKILL.md` — Manifest with name, description, metadata, routing table
- [ ] `rules/01-getting-started.md` — Project structure, file conventions, CLI commands
- [ ] `rules/02-components.md` — Every component with full props table + TSX examples
- [ ] `rules/03-layouts.md` — SlideLayout patterns, Columns, composition recipes
- [ ] `rules/04-animations.md` — Fragment system, step ordering, transition config
- [ ] `rules/05-theming.md` — Theme object, createTheme, CSS variables, shadcn sync
- [ ] `rules/06-export.md` — Export commands, options, troubleshooting
- [ ] `rules/07-advanced.md` — Custom hooks, custom components, presenter mode, export bridge

Each rule file follows the format:
```markdown
---
name: <rule-name>
description: <one-line description>
metadata:
  tags: <comma-separated>
---

[Markdown with hard constraints (MUST/FORBIDDEN) and copy-paste TSX examples]
```

**Files created:**
```
packages/skills/SKILL.md
packages/skills/rules/01-getting-started.md
packages/skills/rules/02-components.md
packages/skills/rules/03-layouts.md
packages/skills/rules/04-animations.md
packages/skills/rules/05-theming.md
packages/skills/rules/06-export.md
packages/skills/rules/07-advanced.md
```

### 7.2 Wire into create-reslide

- [ ] Update `create-reslide` to copy skills files when user opts in
- [ ] Copy destination: `<project>/.claude/skills/reslide/`

### 7.3 Verification

- [ ] Install skills in a test project
- [ ] Open Claude Code in the project
- [ ] Prompt: "Create a 5-slide pitch deck about a task management app"
- [ ] Verify: Claude generates valid slide files, deck renders, no errors
- [ ] Prompt: "Add animations to the features slide"
- [ ] Verify: Claude uses `Fragment` correctly

---

## Phase 8: Examples + Polish + Publish

**Goal:** Three polished examples, documentation, npm publish.

### 8.1 Examples

- [ ] `examples/basic/` — Minimal 5-slide deck using default theme
- [ ] `examples/with-animations/` — Fragments, transitions, step-based reveals
- [ ] `examples/conference-talk/` — Real-world talk with code blocks, images, two-column layouts

### 8.2 Polish

- [ ] URL hash navigation (`#/3` for slide 3)
- [ ] Touch/swipe support (mobile)
- [ ] Responsive scaling verification across screen sizes
- [ ] Keyboard shortcut help overlay (press `?`)
- [ ] Slide overview mode (press `O` — grid of all slides)
- [ ] Error boundaries per slide (one broken slide doesn't crash the deck)

### 8.3 Documentation

- [ ] Root `README.md` — Overview, quick start, feature list
- [ ] `packages/core/README.md` — Component API reference
- [ ] `packages/cli/README.md` — CLI commands reference
- [ ] `packages/create-reslide/README.md` — Setup guide

### 8.4 Publish Setup

- [ ] Configure `publishConfig` in each package.json
- [ ] Set up changesets for versioning
- [ ] GitHub Actions: CI (build + test + typecheck on PR)
- [ ] GitHub Actions: Publish to npm on release tag

### 8.5 Verification

- [ ] All examples build and export successfully
- [ ] `npx create-reslide` works from npm (after publish)
- [ ] README is accurate and complete
- [ ] CI passes on all packages

---

## Dependency Installation Summary

### Root devDependencies

```
turbo, typescript, @changesets/cli
```

### @reslide/core

```
dependencies: shiki, clsx, tailwind-merge
peerDependencies: react, react-dom, tailwindcss
devDependencies: tsup, vitest, @testing-library/react, @types/react
```

### @reslide/cli

```
dependencies: cac, picocolors
peerDependencies: vite, @vitejs/plugin-react, @reslide/core
optionalDependencies: @reslide/export-pdf, @reslide/export-pptx
devDependencies: tsup, @types/node
```

### create-reslide

```
dependencies: @clack/prompts, picocolors, fs-extra
devDependencies: tsup, @types/fs-extra, @types/node
```

### @reslide/export-pdf

```
dependencies: pdf-lib
peerDependencies: playwright
devDependencies: tsup, @types/node
```

### @reslide/export-pptx

```
dependencies: pptxgenjs
peerDependencies: playwright
devDependencies: tsup, @types/node
```

### @reslide/skills

```
(no dependencies — markdown files only)
```

---

## Risk Mitigation Checkpoints

| After Phase | Check |
|-------------|-------|
| Phase 1 | Can render and navigate a hardcoded 3-slide deck |
| Phase 2 | File-based routing discovers and orders slides correctly |
| Phase 3 | Fragments, transitions, and themes work end-to-end |
| Phase 4 | `create-reslide` produces a working project from scratch |
| Phase 5 | PDF and PPTX exports match rendered slides |
| Phase 6 | Presenter mode syncs across windows |
| Phase 7 | AI can generate valid decks from skills |
| Phase 8 | Everything works from npm install |
