import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reslide from '@reslide/cli/vite';

export default defineConfig({
  plugins: [react(), reslide()],
});
