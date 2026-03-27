import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import reslide from '@reslide/cli/vite';

export default defineConfig({
  plugins: [react(), tailwindcss(), reslide()],
});
