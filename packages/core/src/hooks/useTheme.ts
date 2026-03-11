import { useThemeContext } from '../context/ThemeContext.js';
import type { ReslideTheme } from '../types/index.js';

export function useTheme(): ReslideTheme {
  return useThemeContext().theme;
}
