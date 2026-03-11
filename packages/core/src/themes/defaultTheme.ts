import type { ReslideTheme } from '../types/index.js';

export const defaultTheme: ReslideTheme = {
  name: 'default',
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#475569',
    accent: '#7c3aed',
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
