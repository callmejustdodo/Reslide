import path from 'node:path';
import type { Plugin, ViteDevServer } from 'vite';
import { discoverSlides, reorderSlides, type DiscoveredSlide } from './discover.js';
import { generateSlidesModule, generateConfigModule } from './virtual.js';
import { findConfigFile } from '../utils/config.js';

const VIRTUAL_SLIDES = 'virtual:reslide/slides';
const VIRTUAL_CONFIG = 'virtual:reslide/config';
const RESOLVED_SLIDES = '\0' + VIRTUAL_SLIDES;
const RESOLVED_CONFIG = '\0' + VIRTUAL_CONFIG;

interface ReslidePluginOptions {
  /** Override the slides directory (default: src/slides) */
  slidesDir?: string;
}

export default function reslidePlugin(options: ReslidePluginOptions = {}): Plugin {
  let root = '';
  let slidesDir = '';
  let configPath: string | null = null;
  let cachedSlides: DiscoveredSlide[] = [];
  let server: ViteDevServer | undefined;

  function resolveSlides() {
    const discovered = discoverSlides(slidesDir);

    // Check if config has explicit slide ordering
    // We'll read this at runtime through the virtual config module
    // For now, use filename ordering
    cachedSlides = discovered;
    return cachedSlides;
  }

  return {
    name: 'reslide',
    enforce: 'pre',

    configResolved(config) {
      root = config.root;
      slidesDir = options.slidesDir
        ? path.resolve(root, options.slidesDir)
        : path.resolve(root, 'src/slides');
      configPath = findConfigFile(root);
    },

    configureServer(srv) {
      server = srv;
    },

    resolveId(id) {
      if (id === VIRTUAL_SLIDES) return RESOLVED_SLIDES;
      if (id === VIRTUAL_CONFIG) return RESOLVED_CONFIG;
      return null;
    },

    load(id) {
      if (id === RESOLVED_SLIDES) {
        resolveSlides();
        return generateSlidesModule(cachedSlides);
      }
      if (id === RESOLVED_CONFIG) {
        return generateConfigModule(configPath);
      }
      return null;
    },

    handleHotUpdate({ file }) {
      // Re-discover slides when files are added/removed in the slides directory
      if (file.startsWith(slidesDir) && file.endsWith('.tsx')) {
        resolveSlides();
        // Invalidate the virtual module to trigger re-import
        const mod = server?.moduleGraph.getModuleById(RESOLVED_SLIDES);
        if (mod) {
          server!.moduleGraph.invalidateModule(mod);
          server!.ws.send({ type: 'full-reload' });
        }
      }
      return;
    },
  };
}

export { reslidePlugin };
