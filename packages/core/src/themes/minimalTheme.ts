import type { ReslideTheme } from '../types/index.js';

export const minimalTheme: ReslideTheme = {
  name: 'minimal',
  colors: {
    primary: '#18181b',
    secondary: '#71717a',
    background: '#fafafa',
    surface: '#f4f4f5',
    text: '#18181b',
    textSecondary: '#71717a',
    accent: '#18181b',
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
