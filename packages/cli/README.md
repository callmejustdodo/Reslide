# @reslide/cli

CLI and Vite plugin for Reslide presentations.

## Installation

```bash
npm install @reslide/cli
```

## CLI Commands

```bash
reslide dev              # Start dev server with hot reload
reslide build            # Build static HTML for production
reslide preview          # Preview production build locally
reslide export pdf       # Export slides to PDF
reslide export pptx      # Export slides to PowerPoint
reslide export all       # Export to all formats
```

### Export Options

```bash
reslide export pdf --output my-talk.pdf --include-steps
reslide export pptx --output my-talk.pptx --include-notes
```

## Vite Plugin

The plugin provides file-based slide routing:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reslide from '@reslide/cli/vite';

export default defineConfig({
  plugins: [react(), reslide()],
});
```

### How It Works

1. Scans `src/slides/` for `.tsx` files
2. Orders by numeric filename prefix (01-, 02-, etc.)
3. Generates virtual modules (`virtual:reslide/slides`, `virtual:reslide/config`)
4. Supports HMR — adding or editing slides refreshes instantly

### Slide Discovery

```
src/slides/
  01-intro.tsx          → Slide 1
  02-features.tsx       → Slide 2
  03-demo/index.tsx     → Slide 3 (directory form)
```

Override ordering in `reslide.config.ts`:

```ts
export default defineConfig({
  slides: ['intro', 'demo', 'features'],
});
```

## License

MIT
