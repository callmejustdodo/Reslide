import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
    vite: 'src/vite/plugin.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['vite', '@vitejs/plugin-react', '@reslide/core', '@reslide/export-pdf', '@reslide/export-pptx'],
});
