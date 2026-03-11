import type { ReslideTheme } from '../types/index.js';

export const darkTheme: ReslideTheme = {
  name: 'dark',
  colors: {
    primary: '#60a5fa',
    secondary: '#94a3b8',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    accent: '#a78bfa',
  },
  fonts: {
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    code: "'JetBrains Mono', 'Fira Code', monospace",
  },
  slide: {
    width: 1920,
    height: 1080,
  },
};
