import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react';
import type { ReslideTheme, ThemeContextValue } from '../types/index.js';
import { defaultTheme } from '../themes/defaultTheme.js';

const ThemeContext = createContext<ThemeContextValue>({ theme: defaultTheme });

export function useThemeContext(): ThemeContextValue {
  return useContext(ThemeContext);
}

function injectCssVariables(el: HTMLElement, theme: ReslideTheme) {
  // Reslide variables
  el.style.setProperty('--rs-color-primary', theme.colors.primary);
  el.style.setProperty('--rs-color-secondary', theme.colors.secondary);
  el.style.setProperty('--rs-color-background', theme.colors.background);
  el.style.setProperty('--rs-color-surface', theme.colors.surface);
  el.style.setProperty('--rs-color-text', theme.colors.text);
  el.style.setProperty('--rs-color-text-secondary', theme.colors.textSecondary);
  el.style.setProperty('--rs-color-accent', theme.colors.accent);
  el.style.setProperty('--rs-font-heading', theme.fonts.heading);
  el.style.setProperty('--rs-font-body', theme.fonts.body);
  el.style.setProperty('--rs-font-code', theme.fonts.code);
  el.style.setProperty('--rs-slide-width', String(theme.slide.width));
  el.style.setProperty('--rs-slide-height', String(theme.slide.height));

  // Sync shadcn CSS variables
  el.style.setProperty('--primary', theme.colors.primary);
  el.style.setProperty('--background', theme.colors.background);
  el.style.setProperty('--foreground', theme.colors.text);
  el.style.setProperty('--secondary', theme.colors.secondary);
  el.style.setProperty('--accent', theme.colors.accent);
  el.style.setProperty('--muted', theme.colors.surface);
  el.style.setProperty('--muted-foreground', theme.colors.textSecondary);
}

interface ThemeProviderProps {
  theme?: ReslideTheme;
  children: ReactNode;
}

export function ThemeProvider({ theme = defaultTheme, children }: ThemeProviderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      injectCssVariables(rootRef.current, theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div ref={rootRef} className="rs-theme-root">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
