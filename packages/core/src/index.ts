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
export { darkTheme } from './themes/darkTheme.js';
export { minimalTheme } from './themes/minimalTheme.js';

// Components
export { Deck } from './components/Deck.js';
export { SlideLayout } from './components/SlideLayout.js';
export { Title } from './components/Title.js';
export { Subtitle } from './components/Subtitle.js';
export { Body } from './components/Body.js';
export { Notes } from './components/Notes.js';
export { Code } from './components/Code.js';
export { Image } from './components/Image.js';
export { List } from './components/List.js';
export { Columns } from './components/Columns.js';
export { Fragment } from './components/Fragment.js';

// Hooks
export { useDeck } from './hooks/useDeck.js';
export { useSlide } from './hooks/useSlide.js';
export { useTheme } from './hooks/useTheme.js';
export { useStep } from './hooks/useStep.js';

// Transitions
export { getTransition } from './transitions/index.js';

// Utils
export { defineConfig } from './utils/defineConfig.js';
