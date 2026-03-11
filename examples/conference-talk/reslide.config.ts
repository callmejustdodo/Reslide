import { defineConfig, createTheme } from '@reslide/core';

export default defineConfig({
  title: 'Building Presentations with React',
  theme: createTheme({
    colors: {
      primary: '#6366f1',
      background: '#0f172a',
      text: '#f8fafc',
      surface: '#1e293b',
      textSecondary: '#94a3b8',
    },
  }),
  transition: { type: 'slide-left', duration: 300 },
});
