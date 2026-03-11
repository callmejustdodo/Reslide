---
name: animations
description: Fragment system, step ordering, and slide transitions
metadata:
  tags: fragment, animation, transition, steps
---

# Animations

## Fragment (Step-Based Reveals)

Wrap content in `<Fragment>` to reveal it one step at a time.

```tsx
import { SlideLayout, Title, Fragment, Body } from '@reslide/core';

export default function Features() {
  return (
    <SlideLayout.Default>
      <Title>Features</Title>
      <Fragment><Body>First point (appears on step 1)</Body></Fragment>
      <Fragment><Body>Second point (appears on step 2)</Body></Fragment>
      <Fragment><Body>Third point (appears on step 3)</Body></Fragment>
    </SlideLayout.Default>
  );
}
```

### Fragment Props

- `animation?: 'appear' | 'fadeIn' | 'flyIn'` — Animation type (default: `'appear'`)
- `direction?: 'left' | 'right' | 'up' | 'down'` — For `flyIn` only (default: `'left'`)
- `order?: number` — Explicit step order (auto-assigned if omitted)

### Animation Types

```tsx
<Fragment animation="appear">Instant appear</Fragment>
<Fragment animation="fadeIn">Fade in over 0.5s</Fragment>
<Fragment animation="flyIn" direction="left">Fly in from left</Fragment>
<Fragment animation="flyIn" direction="up">Fly in from top</Fragment>
```

### Explicit Ordering

```tsx
<Fragment order={2}><Body>Appears second</Body></Fragment>
<Fragment order={1}><Body>Appears first</Body></Fragment>
<Fragment order={2}><Body>Also appears second (same order)</Body></Fragment>
```

## Slide Transitions

Set globally in config:

```ts
// reslide.config.ts
export default defineConfig({
  transition: { type: 'fade', duration: 400 },
});
```

Override per slide via `meta` export:

```tsx
export const meta = {
  transition: { type: 'slide-left', duration: 300 },
};
```

### Available Transitions

- `none` — No transition (instant)
- `fade` — Fade in/out
- `slide-left` — Slide from right to left
- `slide-right` — Slide from left to right
- `zoom` — Zoom in/out

MUST: Import `Fragment` from `@reslide/core`.
MUST: `Fragment` must be a direct or nested child within a slide component.
FORBIDDEN: Never use CSS animations directly for step reveals — use `Fragment`.
