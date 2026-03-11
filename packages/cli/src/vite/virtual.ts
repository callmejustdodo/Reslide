import type { DiscoveredSlide } from './discover.js';
import { stripPrefix } from './discover.js';

/**
 * Generate the virtual module code for `virtual:reslide/slides`.
 * Uses namespace imports so missing `meta` exports don't cause build errors.
 */
export function generateSlidesModule(slides: DiscoveredSlide[]): string {
  const imports: string[] = [];
  const entries: string[] = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i]!;
    const nsVar = `_slide${i}`;
    imports.push(
      `import * as ${nsVar} from '${slide.filePath}';`,
    );
    entries.push(
      `  { component: ${nsVar}.default, meta: ${nsVar}.meta ?? {}, path: '${stripPrefix(slide.name)}' },`,
    );
  }

  return [
    ...imports,
    '',
    'export const slides = [',
    ...entries,
    '];',
    '',
  ].join('\n');
}

/**
 * Generate the virtual module code for `virtual:reslide/config`.
 */
export function generateConfigModule(configPath: string | null): string {
  if (configPath) {
    return `export { default } from '${configPath}';\n`;
  }
  return 'export default {};\n';
}
