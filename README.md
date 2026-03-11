# Reslide

React framework for creating beautiful presentations programmatically. File-based slide routing, built on shadcn/ui, export to Web/PDF/PPTX, and AI-native authoring with Claude Code.

## Quick Start

```bash
npx create-reslide my-deck
cd my-deck
npm run dev
```

This scaffolds a new project and starts a live-reloading preview at `http://localhost:5173`.

## Create Your First Slide

Each slide is a file in `src/slides/`. The numeric prefix determines the order.

```tsx
// src/slides/01-intro.tsx
import { SlideLayout, Title, Subtitle } from '@reslide/core';

export default function Intro() {
  return (
    <SlideLayout.Center>
      <Title>Welcome to My Talk</Title>
      <Subtitle>Built with Reslide</Subtitle>
    </SlideLayout.Center>
  );
}
```

Add another slide by creating a new file:

```tsx
// src/slides/02-features.tsx
import { SlideLayout, Title, Body, Fragment } from '@reslide/core';

export default function Features() {
  return (
    <SlideLayout.Default>
      <Title>Key Features</Title>
      <Fragment><Body>File-based slide routing</Body></Fragment>
      <Fragment><Body>Built on shadcn/ui</Body></Fragment>
      <Fragment><Body>Export anywhere</Body></Fragment>
    </SlideLayout.Default>
  );
}
```

Fragments reveal one at a time as you press the arrow key — just like PowerPoint animations.

## Components

### Layouts

```tsx
<SlideLayout.Center>    {/* Centered vertically and horizontally */}
<SlideLayout.Default>   {/* Top-aligned with padding */}
<SlideLayout.TwoColumn> {/* Side-by-side columns */}
<SlideLayout.Section>   {/* Large centered text for section dividers */}
<SlideLayout.Blank>     {/* No styling — full control */}
```

### Content

```tsx
<Title>Heading text</Title>
<Subtitle>Secondary heading</Subtitle>
<Body>Paragraph text</Body>
<Code language="tsx">{`const x = 1;`}</Code>
<Image src="/diagram.png" fit="contain" />
<List items={['First', 'Second', 'Third']} />
```

### Multi-Column

```tsx
<Columns sizes={[2, 1]} gap="2rem">
  <div>
    <Title>Left Side</Title>
    <Body>Takes up 2/3 of the width.</Body>
  </div>
  <div>
    <Image src="/photo.png" fit="cover" />
  </div>
</Columns>
```

### Speaker Notes

```tsx
import { SlideLayout, Title, Notes } from '@reslide/core';

export default function MySlide() {
  return (
    <SlideLayout.Center>
      <Title>Important Point</Title>
      <Notes>Remember to mention the Q3 results here.</Notes>
    </SlideLayout.Center>
  );
}
```

Press `P` during the presentation to open the presenter view with notes, timer, and next-slide preview.

### Using shadcn/ui

All shadcn components work inside your slides. They automatically match your presentation theme.

```tsx
import { SlideLayout, Title } from '@reslide/core';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Pricing() {
  return (
    <SlideLayout.Center>
      <Title>Pricing</Title>
      <div className="flex gap-6 mt-8">
        <Card className="w-80">
          <CardHeader>
            <CardTitle>Free <Badge variant="secondary">OSS</Badge></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$0/mo</p>
            <Button className="mt-4 w-full">Get Started</Button>
          </CardContent>
        </Card>
      </div>
    </SlideLayout.Center>
  );
}
```

### Custom Layouts

Layouts are just React components. Create your own:

```tsx
// src/layouts/ImageLeft.tsx
import { ReactNode } from 'react';

export function ImageLeft({ src, children }: { src: string; children: ReactNode }) {
  return (
    <div className="flex h-full">
      <div className="w-1/2 h-full">
        <img src={src} className="w-full h-full object-cover" />
      </div>
      <div className="w-1/2 flex flex-col justify-center p-16">
        {children}
      </div>
    </div>
  );
}
```

Use it in any slide:

```tsx
// src/slides/04-about.tsx
import { Title, Body } from '@reslide/core';
import { ImageLeft } from '../layouts/ImageLeft';

export default function About() {
  return (
    <ImageLeft src="/team-photo.jpg">
      <Title>About Us</Title>
      <Body>We build tools for developers.</Body>
    </ImageLeft>
  );
}
```

Since slides are just React, there are no constraints — use Tailwind, CSS modules, or any styling approach.

## Slide Ordering

By default, slides are ordered by filename prefix:

```
src/slides/
  01-intro.tsx        → Slide 1
  02-problem.tsx      → Slide 2
  03-solution.tsx     → Slide 3
```

You can also use directories to co-locate assets with a slide:

```
src/slides/
  01-intro/
    index.tsx         → Slide 1
    background.png    → Co-located asset
```

To override the order, use `reslide.config.ts`:

```ts
// reslide.config.ts
import { defineConfig } from '@reslide/core';

export default defineConfig({
  slides: ['intro', 'solution', 'problem'],  // Custom order
});
```

## Theming

Choose a built-in theme during setup, or create your own:

```ts
// reslide.config.ts
import { defineConfig, createTheme } from '@reslide/core';

export default defineConfig({
  theme: createTheme({
    colors: {
      primary: '#e11d48',
      background: '#0a0a0a',
      text: '#fafafa',
    },
    fonts: {
      heading: "'Cal Sans', sans-serif",
      body: "'Inter', sans-serif",
    },
  }),
});
```

Built-in themes: `defaultTheme`, `darkTheme`, `minimalTheme`.

You can also override the background per slide:

```tsx
// src/slides/03-highlight.tsx
export const meta = {
  backgroundColor: '#1e40af',
};

export default function Highlight() {
  return (
    <SlideLayout.Center>
      <Title className="text-white">Big Announcement</Title>
    </SlideLayout.Center>
  );
}
```

## Transitions & Animations

### Slide Transitions

Set a default transition for the entire deck:

```ts
// reslide.config.ts
export default defineConfig({
  transition: { type: 'fade', duration: 400 },
});
```

Or override per slide:

```tsx
export const meta = {
  transition: { type: 'slide-left', duration: 300 },
};
```

Available transitions: `fade`, `slide-left`, `slide-right`, `zoom`, `none`.

### Step Animations (Fragments)

Fragments reveal content one step at a time:

```tsx
<Fragment>                          {/* Default: appear */}
<Fragment animation="fadeIn">       {/* Fade in */}
<Fragment animation="flyIn" direction="left">  {/* Fly in from left */}
<Fragment order={2}>                {/* Explicit step order */}
```

## Export

```bash
# Export to PDF
reslide export pdf

# Export to PowerPoint
reslide export pptx

# Export both
reslide export all

# Options
reslide export pdf --output talk.pdf --include-steps
reslide export pptx --output talk.pptx --include-notes
```

PDF and PPTX export requires Playwright. It will be installed automatically on first export.

## Presenter Mode

Press `P` during your presentation to open the presenter view in a new window:

- Current slide
- Next slide preview
- Speaker notes
- Elapsed timer
- Slide counter

Navigation syncs between both windows. Navigate from either one.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `Space` | Next step or slide |
| `←` | Previous step or slide |
| `P` | Toggle presenter mode |
| `O` | Slide overview (grid) |
| `?` | Show keyboard shortcuts |
| `Esc` | Exit overview / presenter |

## Use with Claude Code

Reslide ships with AI skills that teach Claude Code how to create slides.

### Setup

```bash
npx create-reslide my-deck
# Select "Yes" when asked to install AI skills
```

Or add skills to an existing project:

```bash
npx skills add reslide
```

### Prompt Your Slides

Open Claude Code in your project and start prompting:

```bash
cd my-deck
claude
```

**Example prompts:**

```
Create a 10-slide pitch deck for a developer tool called "FastDB"
that makes database queries 10x faster.
```

```
Add a slide after the intro that shows a before/after code comparison
using a two-column layout.
```

```
Add fade-in animations to all the bullet points on the features slide.
```

```
Change the theme to dark with a blue accent color.
```

Claude Code reads the installed skill files and generates valid Reslide components — no manual wiring needed.

## CLI Reference

```bash
# Create a new project
npx create-reslide <project-name>

# Development
reslide dev              # Start dev server with hot reload
reslide build            # Build for production (static HTML)
reslide preview          # Preview production build

# Export
reslide export pdf       # Export to PDF
reslide export pptx      # Export to PowerPoint
reslide export all       # Export to all formats
```

## Project Structure

```
my-deck/
├── reslide.config.ts       # Theme, transitions, slide order
├── vite.config.ts          # Vite + Reslide plugin
├── tailwind.config.ts      # Tailwind CSS config
├── src/
│   ├── main.tsx            # Entry point (auto-generated)
│   ├── slides/
│   │   ├── 01-intro.tsx    # Each file = one slide
│   │   ├── 02-problem.tsx
│   │   └── 03-solution.tsx
│   ├── components/ui/      # shadcn components
│   └── lib/utils.ts        # Tailwind utilities
└── .claude/
    └── skills/reslide/     # AI skills (optional)
```

## Packages

| Package | Description |
|---------|-------------|
| `@reslide/core` | React components, hooks, themes |
| `@reslide/cli` | CLI commands + Vite plugin |
| `create-reslide` | Project scaffolding |
| `@reslide/export-pdf` | PDF export via Playwright |
| `@reslide/export-pptx` | PPTX export via Playwright + pptxgenjs |
| `@reslide/skills` | AI skills for Claude Code |

## License

MIT
