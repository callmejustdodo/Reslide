# @reslide/core

React components, hooks, and themes for Reslide presentations.

## Installation

```bash
npm install @reslide/core
```

## Components

### Layouts

| Component | Description |
|-----------|-------------|
| `<SlideLayout.Center>` | Centered vertically and horizontally |
| `<SlideLayout.Default>` | Top-aligned with padding |
| `<SlideLayout.TwoColumn>` | Side-by-side columns |
| `<SlideLayout.Section>` | Section divider (large centered text) |
| `<SlideLayout.Blank>` | No styling — full control |

### Content

| Component | Props | Description |
|-----------|-------|-------------|
| `<Title>` | `children`, `style?` | Slide heading |
| `<Subtitle>` | `children`, `style?` | Secondary heading |
| `<Body>` | `children`, `style?` | Body text |
| `<Code>` | `language`, `children` | Syntax-highlighted code (shiki) |
| `<Image>` | `src`, `alt?`, `fit?`, `width?`, `height?` | Image with sizing |
| `<List>` | `items`, `ordered?` | Bullet or numbered list |
| `<Columns>` | `children`, `sizes?`, `gap?` | Multi-column layout |
| `<Fragment>` | `animation?`, `direction?`, `order?` | Step-based reveal |
| `<Notes>` | `children` | Speaker notes (hidden during presentation) |

### Fragment Animations

```tsx
<Fragment>                                    // appear (default)
<Fragment animation="fadeIn">                 // Fade in
<Fragment animation="flyIn" direction="left"> // Fly in from direction
<Fragment order={2}>                          // Explicit step order
```

## Hooks

```tsx
import { useDeck, useSlide, useTheme, useStep } from '@reslide/core';

const { currentSlide, totalSlides, nextStep, prevStep } = useDeck();
const { index, step, totalSteps, meta } = useSlide();
const theme = useTheme();
const { visible } = useStep();
```

## Themes

```tsx
import { defaultTheme, darkTheme, minimalTheme, createTheme } from '@reslide/core';

const myTheme = createTheme({
  colors: { primary: '#e11d48', background: '#0a0a0a' },
  fonts: { heading: "'Cal Sans', sans-serif" },
});
```

## Configuration

```tsx
import { defineConfig } from '@reslide/core';

export default defineConfig({
  title: 'My Presentation',
  theme: darkTheme,
  transition: { type: 'fade', duration: 400 },
  slides: ['intro', 'features', 'closing'],
});
```

## License

MIT
