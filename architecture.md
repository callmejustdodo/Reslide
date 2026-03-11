# Reslide — Architecture Document

> Based on [Product Requirements Document](./product_requirements_document.md)

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Project                          │
│  src/slides/*.tsx → Vite Plugin → Browser / Export       │
└──────────┬──────────────────────────────┬───────────────┘
           │                              │
     ┌─────▼─────┐                 ┌──────▼──────┐
     │ @reslide/ │                 │  @reslide/  │
     │   core    │                 │    cli      │
     │           │                 │             │
     │ Components│                 │ dev/build/  │
     │ Hooks     │                 │ export      │
     │ Themes    │                 │ Vite plugin │
     │ Contexts  │                 └──────┬──────┘
     └───────────┘                        │
                                   ┌──────┴──────┐
                              ┌────▼────┐  ┌─────▼─────┐
                              │export-  │  │ export-   │
                              │  pdf    │  │  pptx     │
                              │Playwright  │ Playwright │
                              │→ PDF    │  │ → pptxgen │
                              └─────────┘  └───────────┘
```

---

## 2. Package Architecture

### 2.1 Dependency Graph

```
create-reslide (standalone CLI)
    └── copies template + optionally installs @reslide/skills

@reslide/cli
    ├── @reslide/core (peer dependency)
    ├── @reslide/export-pdf (optional dependency)
    ├── @reslide/export-pptx (optional dependency)
    ├── vite
    ├── @vitejs/plugin-react
    └── cac (CLI framework)

@reslide/core
    ├── react (peer)
    ├── react-dom (peer)
    ├── shiki (syntax highlighting)
    └── tailwind-merge / clsx (styling utils)

@reslide/export-pdf
    ├── playwright (peer — user installs browser on first export)
    └── @reslide/core (types only)

@reslide/export-pptx
    ├── playwright (peer)
    ├── pptxgenjs
    └── @reslide/core (types only)

@reslide/skills (no runtime deps — markdown files only)
```

### 2.2 Package Responsibilities

| Package | Responsibility | Runtime? |
|---------|---------------|----------|
| `@reslide/core` | React components, hooks, themes, contexts, types | Yes (browser) |
| `@reslide/cli` | CLI commands, Vite plugin, config loader | Yes (Node.js) |
| `@reslide/export-pdf` | PDF rendering pipeline | Yes (Node.js) |
| `@reslide/export-pptx` | PPTX generation pipeline | Yes (Node.js) |
| `@reslide/skills` | AI skill files (SKILL.md + rules/) | No (static files) |
| `create-reslide` | Project scaffolding | Yes (Node.js, one-time) |

---

## 3. Core Runtime Architecture (`@reslide/core`)

### 3.1 Component Tree

```
<ThemeProvider theme={resolvedTheme}>
  <DeckProvider>
    <DeckRoot>                          ← CSS variables, viewport scaling
      <TransitionContainer>             ← Manages enter/exit transitions
        <SlideProvider index={n}>       ← Per-slide context (step state)
          <SlideFrame>                  ← 1920×1080 container, background
            <UserSlideComponent />      ← The user's slide file
          </SlideFrame>
        </SlideProvider>
      </TransitionContainer>
      <NavigationOverlay />             ← Click/touch zones (dev only)
      <SlideCounter />                  ← "3 / 12" indicator
    </DeckRoot>
    <ExportBridge />                    ← window.__reslide for exporters
  </DeckProvider>
</ThemeProvider>
```

### 3.2 Context System

Three React contexts, nested in this order:

```
ThemeContext
  └── DeckContext
        └── SlideContext (one per slide)
```

#### ThemeContext

```ts
interface ThemeContextValue {
  theme: ReslideTheme;
}
```

Provides the resolved theme. The `<ThemeProvider>` also injects CSS custom properties onto the root DOM element.

#### DeckContext

```ts
interface DeckContextValue {
  // State
  currentSlide: number;
  totalSlides: number;
  isPresenterMode: boolean;

  // Navigation
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;

  // Step delegation
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;

  // Metadata
  slides: SlideEntry[];
  config: ReslideConfig;
}
```

The `<DeckProvider>` manages all navigation state. It handles the logic: "if there are remaining steps in the current slide, advance step; otherwise advance slide."

#### SlideContext

```ts
interface SlideContextValue {
  index: number;              // This slide's index in the deck
  step: number;               // Current step within this slide
  totalSteps: number;         // Total registered fragments
  registerFragment: () => number;  // Returns assigned step order
  meta: SlideMeta;            // Per-slide metadata
}
```

Each slide gets its own `<SlideProvider>`. The `registerFragment()` function auto-assigns step order numbers to `<Fragment>` components in render order.

### 3.3 Fragment / Step State Machine

```
Slide mounted
  ├── Fragment A calls registerFragment() → order 1
  ├── Fragment B calls registerFragment() → order 2
  └── Fragment C calls registerFragment() → order 3

SlideContext.totalSteps = 3

Navigation flow (right arrow / click):
  step 0 → step 1 (Fragment A visible)
  step 1 → step 2 (Fragment B visible)
  step 2 → step 3 (Fragment C visible)
  step 3 → next slide (step resets to 0)
```

Fragment visibility: `visible = currentStep >= fragmentOrder`

Fragments with explicit `order` prop skip auto-assignment. Multiple fragments can share the same order (appear together).

### 3.4 Theme → CSS Variable Pipeline

```
ReslideTheme object
    ↓ ThemeProvider
CSS custom properties on <div class="rs-deck-root">
    ↓
--rs-color-primary: #2563eb
--rs-color-background: #ffffff
--rs-color-text: #1a1a1a
--rs-font-heading: 'Inter', sans-serif
--rs-font-body: 'Inter', sans-serif
--rs-font-code: 'JetBrains Mono', monospace
--rs-slide-width: 1920
--rs-slide-height: 1080
    ↓
Components use: className="text-[var(--rs-color-primary)]"
    or: style={{ color: 'var(--rs-color-text)' }}
```

shadcn CSS variables (`--primary`, `--background`, etc.) are also set from the theme, so shadcn components automatically match.

### 3.5 Viewport Scaling

Slides are authored at a fixed resolution (default 1920×1080). The `<DeckRoot>` uses CSS `transform: scale()` to fit the slide into any viewport:

```ts
// In DeckRoot
const scale = Math.min(
  viewportWidth / slideWidth,
  viewportHeight / slideHeight
);

// Applied via CSS transform
<div style={{
  width: slideWidth,
  height: slideHeight,
  transform: `scale(${scale})`,
  transformOrigin: 'top left',
}}>
  {children}
</div>
```

This ensures slides look identical at any screen size, and export produces pixel-perfect results at native resolution.

---

## 4. File-Based Routing Architecture

### 4.1 Slide Discovery Pipeline

```
src/slides/**/*.tsx
      ↓
  Vite Plugin (build-time)
      ↓
  Sort by filename prefix OR config order
      ↓
  Generate virtual module: virtual:reslide/slides
      ↓
  DeckProvider imports and renders
```

### 4.2 Virtual Module Generation

The Vite plugin generates `virtual:reslide/slides` at build time:

```ts
// Generated virtual module content
import Slide0, { meta as meta0 } from '/src/slides/01-intro.tsx';
import Slide1, { meta as meta1 } from '/src/slides/02-problem.tsx';
import Slide2, { meta as meta2 } from '/src/slides/03-solution/index.tsx';

export const slides = [
  { component: Slide0, meta: meta0 ?? {}, path: '01-intro' },
  { component: Slide1, meta: meta1 ?? {}, path: '02-problem' },
  { component: Slide2, meta: meta2 ?? {}, path: '03-solution' },
];
```

### 4.3 Ordering Algorithm

```
1. Scan src/slides/ for *.tsx files and */index.tsx directories
2. If reslide.config.ts has `slides[]` array:
   a. For each name in config.slides:
      - Match against filenames (strip numeric prefix + extension)
      - e.g., "intro" matches "01-intro.tsx"
   b. Use config order
   c. Warn about unmatched entries or unlisted files
3. Else (no config.slides):
   a. Sort by filename naturally (01- before 02-, etc.)
   b. Files without numeric prefix sort alphabetically after numbered files
```

### 4.4 Slide File Contract

```ts
// REQUIRED: default export = React component
export default function MySlide() {
  return (
    <SlideLayout.Center>
      <Title>Hello</Title>
    </SlideLayout.Center>
  );
}

// OPTIONAL: named export for per-slide metadata
export const meta: SlideMeta = {
  transition: { type: 'fade', duration: 500 },
  backgroundColor: '#000',
  notes: 'Remember to pause here.',
};
```

---

## 5. CLI & Vite Plugin Architecture

### 5.1 CLI Command Structure

```
reslide
  ├── dev       → createServer() from Vite API
  ├── build     → build() from Vite API
  ├── preview   → preview() from Vite API
  └── export
       ├── pdf  → @reslide/export-pdf
       ├── pptx → @reslide/export-pptx
       └── all  → both sequentially
```

Implementation: `cac` CLI framework. Each command is a separate module under `src/commands/`.

### 5.2 Vite Plugin (`reslidePlugin()`)

Responsibilities:

| Hook | Action |
|------|--------|
| `config()` | Merge Reslide defaults into Vite config |
| `resolveId()` | Handle `virtual:reslide/slides` and `virtual:reslide/config` |
| `load()` | Generate virtual module content (slide imports, config) |
| `transformIndexHtml()` | Inject viewport meta, base styles |
| `handleHotUpdate()` | Re-discover slides when files added/removed in `src/slides/` |

### 5.3 Config Resolution

```
1. Look for reslide.config.ts in project root
2. Load via Vite's config loading (supports TS natively)
3. Merge with defaults:
   - aspectRatio: '16:9'
   - transition: { type: 'none' }
   - theme: defaultTheme
   - slide: { width: 1920, height: 1080 }
4. Expose as virtual:reslide/config
```

### 5.4 User's vite.config.ts

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reslide from '@reslide/cli/vite';

export default defineConfig({
  plugins: [react(), reslide()],
});
```

### 5.5 User's main.tsx (entry point)

```tsx
import { createRoot } from 'react-dom/client';
import { Deck } from '@reslide/core';
import { slides } from 'virtual:reslide/slides';
import config from 'virtual:reslide/config';

createRoot(document.getElementById('root')!).render(
  <Deck slides={slides} config={config} />
);
```

This is generated by `create-reslide` and rarely needs modification.

---

## 6. Export Pipeline Architecture

### 6.1 Export Bridge (`window.__reslide`)

The `<ExportBridge>` component (rendered inside `<DeckProvider>`) exposes a global API for export tooling:

```ts
interface ReslideExportBridge {
  totalSlides: number;
  stepsPerSlide: number[];        // [1, 3, 1, 2] — steps per slide
  goTo: (slide: number, step: number) => Promise<void>;  // Navigate + wait for render
  getNotes: (slide: number) => string;
  getConfig: () => ReslideConfig;
  isReady: () => boolean;
}

// Exposed on window
declare global {
  interface Window {
    __reslide: ReslideExportBridge;
  }
}
```

`goTo()` returns a Promise that resolves after React re-renders (using `requestAnimationFrame` + small delay for CSS transitions to settle).

### 6.2 Shared Export Flow

```
reslide export <format>
    ↓
1. Run `reslide build` → dist/
    ↓
2. Start static file server on random port
    ↓
3. Launch Playwright Chromium
    ↓
4. Navigate to http://localhost:PORT
    ↓
5. Wait for window.__reslide.isReady()
    ↓
6. Read metadata: totalSlides, stepsPerSlide
    ↓
7. For each slide (and optionally each step):
   a. window.__reslide.goTo(slide, step)
   b. Wait for render settle
   c. Capture (PDF page or screenshot)
    ↓
8. Assemble output file
    ↓
9. Cleanup: close browser, stop server
```

### 6.3 PDF Export (`@reslide/export-pdf`)

```ts
// Core logic (simplified)
async function exportPdf(options: PdfExportOptions) {
  const server = await startPreviewServer(options.distDir);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(server.url);
  await page.waitForFunction(() => window.__reslide.isReady());

  const { totalSlides, stepsPerSlide } = await page.evaluate(
    () => window.__reslide
  );

  const pages: Buffer[] = [];

  for (let s = 0; s < totalSlides; s++) {
    const steps = options.includeSteps ? stepsPerSlide[s] : 1;
    for (let step = 0; step < steps; step++) {
      await page.evaluate(({ s, step }) => window.__reslide.goTo(s, step), { s, step });
      await page.waitForTimeout(100); // Transition settle
      const pdf = await page.pdf({
        width: '1920px',
        height: '1080px',
        printBackground: true,
        pageRanges: '1',
      });
      pages.push(pdf);
    }
  }

  // Merge PDF pages (pdf-lib)
  const merged = await mergePdfs(pages);
  await writeFile(options.output, merged);

  await browser.close();
  server.close();
}
```

### 6.4 PPTX Export (`@reslide/export-pptx`)

```ts
async function exportPptx(options: PptxExportOptions) {
  const server = await startPreviewServer(options.distDir);
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(server.url);
  await page.waitForFunction(() => window.__reslide.isReady());

  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'RESLIDE', width: 13.33, height: 7.5 }); // 16:9 inches
  pptx.layout = 'RESLIDE';

  const { totalSlides, stepsPerSlide } = await page.evaluate(
    () => ({ totalSlides: window.__reslide.totalSlides, stepsPerSlide: window.__reslide.stepsPerSlide })
  );

  for (let s = 0; s < totalSlides; s++) {
    const maxStep = options.includeSteps ? stepsPerSlide[s] - 1 : 0;
    await page.evaluate(({ s, step }) => window.__reslide.goTo(s, step), { s, step: maxStep });
    await page.waitForTimeout(100);

    const screenshot = await page.screenshot({ type: 'png' });
    const base64 = screenshot.toString('base64');

    const slide = pptx.addSlide();
    slide.addImage({ data: `image/png;base64,${base64}`, x: 0, y: 0, w: '100%', h: '100%' });

    // Add speaker notes
    const notes = await page.evaluate((s) => window.__reslide.getNotes(s), s);
    if (notes) slide.addNotes(notes);
  }

  await pptx.writeFile({ fileName: options.output });
  await browser.close();
  server.close();
}
```

---

## 7. Presenter Mode Architecture

### 7.1 Communication Model

```
┌──────────────────┐     BroadcastChannel      ┌──────────────────┐
│  Audience Window  │ ◄──── "reslide-sync" ────► │ Presenter Window │
│  (main deck)      │                           │ (presenter view)  │
└──────────────────┘                            └──────────────────┘
```

### 7.2 Message Protocol

```ts
type SyncMessage =
  | { type: 'navigate'; slide: number; step: number; source: 'audience' | 'presenter' }
  | { type: 'ping'; timestamp: number }
  | { type: 'pong'; timestamp: number };
```

Both windows listen on the same `BroadcastChannel('reslide-sync')`. When either navigates, it broadcasts the new position. The other window updates without re-broadcasting (checked via `source` field to avoid loops).

### 7.3 Presenter View Layout

```
┌─────────────────────────────────────────┐
│  ┌─────────────────┐ ┌───────────────┐  │
│  │                 │ │               │  │
│  │  Current Slide  │ │  Next Slide   │  │
│  │   (large)       │ │  (preview)    │  │
│  │                 │ │               │  │
│  └─────────────────┘ └───────────────┘  │
│  ┌─────────────────────────────────────┐ │
│  │  Speaker Notes                      │ │
│  │  (scrollable)                       │ │
│  └─────────────────────────────────────┘ │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Slide 3/12│ │ 00:15:32 │ │ ← Prev   │ │
│  │           │ │  Timer   │ │   Next → │ │
│  └──────────┘ └──────────┘ └──────────┘ │
│                                          │
└─────────────────────────────────────────┘
```

---

## 8. Slide Transition Architecture

### 8.1 Transition System

Transitions are CSS-based, managed by the `<TransitionContainer>` component.

```ts
interface TransitionDefinition {
  enter: {
    from: React.CSSProperties;   // Initial state when entering
    to: React.CSSProperties;     // Final state after entering
  };
  exit: {
    from: React.CSSProperties;   // Initial state when exiting
    to: React.CSSProperties;     // Final state after exiting
  };
  duration: number;               // ms
  easing: string;                 // CSS easing
}
```

Example — fade transition:

```ts
const fade: TransitionDefinition = {
  enter: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  exit: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  duration: 400,
  easing: 'ease-in-out',
};
```

### 8.2 Transition Container State Machine

```
IDLE → navigation triggered → TRANSITIONING → animation complete → IDLE

During TRANSITIONING:
  - Previous slide: applying exit styles
  - Next slide: applying enter styles
  - Both rendered simultaneously (absolutely positioned)
  - Navigation input is blocked
```

---

## 9. shadcn/ui Integration

### 9.1 Setup in User Project

`create-reslide` scaffolds:
- `tailwind.config.ts` with Reslide's design tokens + shadcn preset
- `components.json` configured for the project
- `src/components/ui/` with pre-installed shadcn components
- `src/lib/utils.ts` with `cn()` utility

### 9.2 Reslide Components Using shadcn

| Reslide Component | shadcn Dependency |
|-------------------|-------------------|
| `Code` | `shadcn/card` (wrapper) + shiki |
| `List` | Native HTML + Tailwind styling |
| `Title/Subtitle/Body` | Tailwind typography classes |
| `SlideLayout.*` | Tailwind flex/grid utilities |
| `Fragment` | No shadcn dep (CSS transitions) |

Users can freely use any shadcn component (`Button`, `Card`, `Badge`, `Table`, etc.) inside their slides alongside Reslide components.

### 9.3 Theme Synchronization

When a Reslide theme is applied, the `<ThemeProvider>` sets both:
- `--rs-*` CSS variables (for Reslide components)
- `--primary`, `--background`, `--foreground`, etc. (for shadcn components)

This ensures shadcn components automatically match the slide theme.

---

## 10. AI Skills Architecture

### 10.1 File Structure

```
packages/skills/
├── package.json                  # name: @reslide/skills, no runtime deps
├── SKILL.md                      # agentskills.io manifest
└── rules/
    ├── 01-getting-started.md     # Project structure, commands
    ├── 02-components.md          # Full component API + props + examples
    ├── 03-layouts.md             # SlideLayout patterns + composition
    ├── 04-animations.md          # Fragment, transitions, step system
    ├── 05-theming.md             # Theme config, createTheme, shadcn sync
    ├── 06-export.md              # Export commands + options
    └── 07-advanced.md            # Hooks, custom components, presenter mode
```

### 10.2 Progressive Disclosure Flow

```
AI startup:
  → Load SKILL.md name + description (~100 tokens)

User asks to create slides:
  → Load SKILL.md body (routing table, ~500 tokens)
  → Load rules/02-components.md (~2000 tokens)
  → Load rules/03-layouts.md (~1000 tokens)

User asks about animations:
  → Load rules/04-animations.md (~1000 tokens)

User asks about export:
  → Load rules/06-export.md (~500 tokens)
```

### 10.3 Installation Flow

```
npx create-reslide my-deck
  → "Install AI skills? (Y/n)"
  → If yes: copy skills/ → .claude/skills/reslide/
  → Claude Code auto-discovers .claude/skills/
```

---

## 11. Technology Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Monorepo tool | pnpm + Turborepo | Fast, reliable, industry standard |
| Build tool | tsup | Fast ESM/CJS builds for libraries |
| Bundle tool | Vite | Best DX, fast HMR, plugin ecosystem |
| Test tool | vitest | Vite-native, fast, compatible API |
| CLI framework | cac | 3KB, TypeScript-first, simple |
| Syntax highlighting | shiki | Best quality, theme support, used by VS Code |
| PDF rendering | Playwright | Pixel-perfect, headless Chrome |
| PPTX generation | pptxgenjs | Most maintained JS PPTX library |
| PDF merging | pdf-lib | Pure JS, no native deps |
| Styling | Tailwind CSS + CSS variables | Best DX, tiny runtime, theme-able |
| UI primitives | shadcn/ui | Composable, customizable, Tailwind-native |
| Scaffolding prompts | @clack/prompts | Beautiful terminal UI |

---

## 12. Security Considerations

| Concern | Mitigation |
|---------|-----------|
| XSS in user slides | Slides are authored by the developer, not end users. React's JSX escaping provides baseline protection. |
| Export bridge (`window.__reslide`) | Only exposes read-only navigation. No file system access. Bridge is omitted in production web builds (only injected during export). |
| Playwright in export | Runs locally against localhost only. No external network access needed. |
| Skills injection | Skills are static markdown files. No executable code. Installed locally per-project. |
