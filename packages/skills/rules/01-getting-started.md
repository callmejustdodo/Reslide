---
name: getting-started
description: Project structure, file conventions, and CLI commands
metadata:
  tags: setup, structure, cli, commands
---

# Getting Started

## Project Structure

```
my-deck/
├── reslide.config.ts       # Theme, transitions, slide order
├── vite.config.ts           # Vite + Reslide plugin
├── index.html               # Entry HTML
├── src/
│   ├── main.tsx             # Entry point (auto-generated, don't edit)
│   ├── env.d.ts             # Type declarations
│   ├── slides/
│   │   ├── 01-intro.tsx     # Each file = one slide
│   │   ├── 02-content.tsx
│   │   └── 03-closing.tsx
│   └── lib/utils.ts
└── .claude/skills/reslide/  # This skill
```

## Slide File Convention

MUST: Each slide file MUST default-export a React component.

```tsx
// src/slides/01-intro.tsx
import { SlideLayout, Title, Subtitle } from '@reslide/core';

export default function Intro() {
  return (
    <SlideLayout.Center>
      <Title>My Presentation</Title>
      <Subtitle>By Author Name</Subtitle>
    </SlideLayout.Center>
  );
}
```

## Ordering

- Files are ordered by numeric prefix: `01-`, `02-`, etc.
- MUST use numeric prefix for predictable ordering
- Directories supported: `03-demo/index.tsx`
- Override with `slides[]` in `reslide.config.ts`

## Per-Slide Metadata (Optional)

```tsx
export const meta = {
  transition: { type: 'fade', duration: 500 },
  backgroundColor: '#1e40af',
  notes: 'Speaker notes here',
};
```

## CLI Commands

```bash
reslide dev              # Start dev server with HMR
reslide build            # Build static HTML
reslide preview          # Preview production build
reslide export pdf       # Export to PDF
reslide export pptx      # Export to PowerPoint
reslide export all       # Export all formats
```

## Creating a New Slide

1. Create a new `.tsx` file in `src/slides/` with the next numeric prefix
2. Default-export a React component using SlideLayout and content components
3. The slide appears automatically (HMR picks it up)

FORBIDDEN: Never put multiple slides in one file.
FORBIDDEN: Never use `.jsx` extension — always `.tsx`.
