---
name: advanced
description: Hooks, custom components, and presenter mode
metadata:
  tags: hooks, custom, presenter, advanced
---

# Advanced

## Hooks

```tsx
import { useDeck, useSlide, useTheme, useStep } from '@reslide/core';

// Inside a slide component:
const { currentSlide, totalSlides, nextStep, prevStep } = useDeck();
const { index, step, totalSteps, meta } = useSlide();
const theme = useTheme();
const { visible, step: currentStep } = useStep(); // For custom animations
```

## Custom Animated Components

Use `useStep()` for custom step-based animations:

```tsx
import { useStep } from '@reslide/core';

function AnimatedCounter() {
  const { visible } = useStep();
  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.5)',
      transition: 'all 0.5s ease',
    }}>
      Custom animated content
    </div>
  );
}
```

## Presenter Mode

- Press `P` during presentation to open presenter view
- Shows: current slide, next slide preview, speaker notes, timer
- Navigation syncs between audience and presenter windows via BroadcastChannel
- URL: `?presenter=true` activates presenter view

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `Space` | Next step or slide |
| `←` | Previous step or slide |
| `P` | Open presenter mode |
| `Home` | Go to first slide |
| `End` | Go to last slide |

## Using shadcn/ui in Slides

All shadcn components work inside slides and match the presentation theme:

```tsx
import { SlideLayout, Title } from '@reslide/core';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function MySlide() {
  return (
    <SlideLayout.Center>
      <Title>Interactive <Badge>New</Badge></Title>
      <Button size="lg">Click Me</Button>
    </SlideLayout.Center>
  );
}
```

## URL Hash Navigation

Slides are addressable by hash: `#/1`, `#/2`, etc. (1-indexed).

MUST: Hooks must be called inside slide components (within the Deck tree).
FORBIDDEN: Never call `useDeck()` or `useSlide()` outside of a `<Deck>` component tree.
