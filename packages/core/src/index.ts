// Types
export type {
  ReslideConfig,
  ReslideTheme,
  TransitionConfig,
  TransitionDefinition,
  SlideMeta,
  SlideEntry,
  DeckProps,
  DeckContextValue,
  SlideContextValue,
  ThemeContextValue,
  FragmentAnimation,
  FragmentProps,
  ReslideExportBridge,
} from './types/index.js';

// Context
export { ThemeProvider } from './context/ThemeContext.js';
export { DeckProvider } from './context/DeckContext.js';
export { SlideProvider } from './context/SlideContext.js';

// Themes
export { defaultTheme } from './themes/defaultTheme.js';
export { createTheme } from './themes/createTheme.js';
