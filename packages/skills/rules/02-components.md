---
name: components
description: Full component API with props and examples
metadata:
  tags: components, title, body, code, image, list, columns
---

# Components

All components are imported from `@reslide/core`.

## Title

Large heading text.

```tsx
<Title>Heading Text</Title>
<Title className="text-blue-500">Styled Heading</Title>
```

Props: `children: ReactNode`, `className?: string`

## Subtitle

Secondary heading.

```tsx
<Subtitle>Secondary Text</Subtitle>
```

Props: `children: ReactNode`, `className?: string`

## Body

Paragraph text.

```tsx
<Body>Regular paragraph content.</Body>
```

Props: `children: ReactNode`, `className?: string`

## Code

Syntax-highlighted code block using shiki.

```tsx
<Code language="typescript">{`
const greeting = "Hello, Reslide!";
console.log(greeting);
`}</Code>

<Code language="python" showLineNumbers>{`
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
`}</Code>
```

Props:
- `children: string` — The code string
- `language?: string` — Language for highlighting (default: `'typescript'`)
- `highlightLines?: number[]` — Lines to highlight
- `showLineNumbers?: boolean` — Show line numbers
- `className?: string`

## Image

Image with sizing controls.

```tsx
<Image src="/diagram.png" />
<Image src="/photo.jpg" fit="cover" width="600px" height="400px" />
```

Props:
- `src: string` — Image URL or path
- `alt?: string` — Alt text
- `fit?: 'contain' | 'cover' | 'fill' | 'none'` — Object fit (default: `'contain'`)
- `width?: string | number`
- `height?: string | number`
- `className?: string`

## List

Bulleted or numbered list.

```tsx
<List items={['First point', 'Second point', 'Third point']} />
<List items={['Step 1', 'Step 2', 'Step 3']} ordered />
```

Props:
- `items: ReactNode[]` — List items
- `ordered?: boolean` — Numbered list (default: `false`)
- `className?: string`

## Columns

Multi-column grid layout.

```tsx
<Columns sizes={[2, 1]} gap="2rem">
  <div>Left content (2/3 width)</div>
  <div>Right content (1/3 width)</div>
</Columns>

<Columns sizes={[1, 1, 1]}>
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</Columns>
```

Props:
- `children: ReactNode`
- `sizes?: number[]` — Column ratios (default: `[1, 1]`)
- `gap?: string` — Gap between columns (default: `'2rem'`)
- `className?: string`

## Notes

Speaker notes (hidden from audience, visible in presenter mode).

```tsx
<Notes>Remember to mention the quarterly results.</Notes>
```

Props: `children: string`

MUST: Always import components from `@reslide/core`.
MUST: Use `Code` component for code — never raw `<pre>` tags.
FORBIDDEN: Never use `<h1>`, `<h2>`, `<p>` directly — use `Title`, `Subtitle`, `Body`.
