import fs from 'node:fs';
import path from 'node:path';

const CONFIG_FILES = [
  'reslide.config.ts',
  'reslide.config.js',
  'reslide.config.mjs',
];

/**
 * Find the reslide config file in the project root.
 * Returns the absolute path or null if not found.
 */
export function findConfigFile(root: string): string | null {
  for (const file of CONFIG_FILES) {
    const filePath = path.join(root, file);
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  return null;
}
