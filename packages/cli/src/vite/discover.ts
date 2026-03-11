import fs from 'node:fs';
import path from 'node:path';

export interface DiscoveredSlide {
  filePath: string;
  name: string;
  order: number;
}

/**
 * Scan a directory for slide files (.tsx) and return them sorted.
 * Supports both `01-name.tsx` and `01-name/index.tsx` patterns.
 */
export function discoverSlides(slidesDir: string): DiscoveredSlide[] {
  if (!fs.existsSync(slidesDir)) return [];

  const entries = fs.readdirSync(slidesDir, { withFileTypes: true });
  const slides: DiscoveredSlide[] = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.tsx')) {
      const name = entry.name.replace(/\.tsx$/, '');
      slides.push({
        filePath: path.join(slidesDir, entry.name),
        name,
        order: extractOrder(name),
      });
    } else if (entry.isDirectory()) {
      const indexPath = path.join(slidesDir, entry.name, 'index.tsx');
      if (fs.existsSync(indexPath)) {
        slides.push({
          filePath: indexPath,
          name: entry.name,
          order: extractOrder(entry.name),
        });
      }
    }
  }

  slides.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.name.localeCompare(b.name);
  });

  return slides;
}

/**
 * Extract numeric prefix from a slide name.
 * "01-intro" → 1, "intro" → Infinity (sorts last)
 */
function extractOrder(name: string): number {
  const match = name.match(/^(\d+)/);
  return match ? parseInt(match[1]!, 10) : Infinity;
}

/**
 * Strip the numeric prefix from a slide name for matching against config.
 * "01-intro" → "intro", "intro" → "intro"
 */
export function stripPrefix(name: string): string {
  return name.replace(/^\d+-/, '');
}

/**
 * Reorder slides based on a config `slides[]` array.
 * Config names are matched after stripping numeric prefixes.
 */
export function reorderSlides(
  discovered: DiscoveredSlide[],
  configOrder: string[],
): DiscoveredSlide[] {
  const byName = new Map<string, DiscoveredSlide>();
  for (const slide of discovered) {
    byName.set(stripPrefix(slide.name), slide);
  }

  const ordered: DiscoveredSlide[] = [];
  for (const name of configOrder) {
    const slide = byName.get(name);
    if (slide) {
      ordered.push(slide);
      byName.delete(name);
    }
  }

  return ordered;
}
