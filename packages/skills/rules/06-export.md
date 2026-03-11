---
name: export
description: Export commands, options, and troubleshooting
metadata:
  tags: export, pdf, pptx, powerpoint
---

# Export

## Commands

```bash
# Export to PDF
reslide export pdf
reslide export pdf --output my-talk.pdf
reslide export pdf --include-steps  # Fragment steps as separate pages

# Export to PowerPoint
reslide export pptx
reslide export pptx --output my-talk.pptx
reslide export pptx --include-notes  # Include speaker notes (default: true)

# Export both
reslide export all
```

## How Export Works

1. `reslide build` creates a static HTML SPA
2. Playwright opens it in headless Chrome
3. Each slide is screenshotted at 1920×1080
4. Screenshots assembled into PDF (via pdf-lib) or PPTX (via pptxgenjs)

## Requirements

- Playwright is required: `npx playwright install chromium`
- First export will prompt to install if missing

## PPTX Notes

- Slides are screenshot-based (not editable elements)
- Speaker notes from `<Notes>` and `meta.notes` are preserved
- Layout is 16:9 widescreen

## Troubleshooting

- **Blank slides**: Ensure all assets load without network errors
- **Missing fonts**: Use web-safe fonts or self-host in `public/`
- **Slow export**: Normal for large decks; ~0.5s per slide
