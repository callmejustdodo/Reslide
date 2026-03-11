---
name: theming
description: Theme configuration, createTheme, and CSS variables
metadata:
  tags: theme, colors, fonts, css-variables, shadcn
---

# Theming

## Built-in Themes

```ts
import { defaultTheme, darkTheme, minimalTheme } from '@reslide/core';
```

Use in config:

```ts
// reslide.config.ts
import { defineConfig, darkTheme } from '@reslide/core';

export default defineConfig({
  theme: darkTheme,
});
```

## Custom Theme with createTheme

```ts
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
    },
  }),
});
```

`createTheme` deep-merges with `defaultTheme` — only override what you need.

## Theme Object Shape

```ts
interface ReslideTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
    code: string;
  };
  slide: {
    width: number;   // default: 1920
    height: number;  // default: 1080
  };
}
```

## CSS Variables

The theme injects CSS variables on the deck root:

```
--rs-color-primary, --rs-color-background, --rs-color-text, etc.
--rs-font-heading, --rs-font-body, --rs-font-code
```

shadcn CSS variables (`--primary`, `--background`, `--foreground`) are synced automatically.

## Per-Slide Background Override

```tsx
export const meta = {
  backgroundColor: '#1e40af',
  backgroundImage: '/hero-bg.jpg',
};
```

MUST: Always use `createTheme()` for custom themes — never construct the object manually.
MUST: Color values must be valid CSS color strings.
