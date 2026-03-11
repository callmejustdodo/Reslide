---
name: layouts
description: SlideLayout patterns and composition
metadata:
  tags: layout, center, default, two-column, section, blank
---

# Layouts

All layouts are accessed via `SlideLayout.*` from `@reslide/core`.

## SlideLayout.Center

Content centered vertically and horizontally. Best for title slides and key points.

```tsx
import { SlideLayout, Title, Subtitle } from '@reslide/core';

export default function TitleSlide() {
  return (
    <SlideLayout.Center>
      <Title>Welcome</Title>
      <Subtitle>A presentation about React</Subtitle>
    </SlideLayout.Center>
  );
}
```

## SlideLayout.Default

Top-aligned with padding. Best for content-heavy slides.

```tsx
import { SlideLayout, Title, Body, List } from '@reslide/core';

export default function ContentSlide() {
  return (
    <SlideLayout.Default>
      <Title>Agenda</Title>
      <List items={['Introduction', 'Demo', 'Q&A']} />
    </SlideLayout.Default>
  );
}
```

## SlideLayout.TwoColumn

Side-by-side columns. Pass `sizes` for ratios, `gap` for spacing.

```tsx
import { SlideLayout, Title, Body, Image } from '@reslide/core';

export default function ComparisonSlide() {
  return (
    <SlideLayout.TwoColumn sizes={[1, 1]}>
      <div>
        <Title>Before</Title>
        <Body>The old approach</Body>
      </div>
      <div>
        <Title>After</Title>
        <Body>The new approach</Body>
      </div>
    </SlideLayout.TwoColumn>
  );
}
```

## SlideLayout.Section

Large centered text for section dividers.

```tsx
import { SlideLayout, Title } from '@reslide/core';

export default function SectionDivider() {
  return (
    <SlideLayout.Section>
      <Title>Part 2: Implementation</Title>
    </SlideLayout.Section>
  );
}
```

## SlideLayout.Blank

No padding or styling — full control over layout.

```tsx
import { SlideLayout } from '@reslide/core';

export default function CustomSlide() {
  return (
    <SlideLayout.Blank>
      <div style={{ /* custom layout */ }}>
        Custom content
      </div>
    </SlideLayout.Blank>
  );
}
```

## Custom Layouts

Create your own layout as a React component:

```tsx
// src/layouts/ImageLeft.tsx
import { ReactNode } from 'react';

export function ImageLeft({ src, children }: { src: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ width: '50%', height: '100%' }}>
        <img src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem' }}>
        {children}
      </div>
    </div>
  );
}
```

MUST: Every slide MUST use a layout (SlideLayout.* or custom).
MUST: `SlideLayout.TwoColumn` expects exactly 2 children.
