import type { ComponentType, ReactNode, CSSProperties } from 'react';

// ─── Config ──────────────────────────────────────────────

export interface ReslideConfig {
  title?: string;
  slides?: string[];
  theme?: ReslideTheme;
  transition?: TransitionConfig;
  aspectRatio?: '16:9' | '4:3';
  slide?: {
    width: number;
    height: number;
  };
  export?: {
    pdf?: { format?: 'A4' | 'letter'; landscape?: boolean };
    pptx?: { layout?: 'widescreen' | 'standard' };
  };
}

// ─── Theme ───────────────────────────────────────────────

export interface ReslideTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
    code: string;
  };
  slide: {
    width: number;
    height: number;
  };
}

// ─── Transitions ─────────────────────────────────────────

export interface TransitionConfig {
  type: 'none' | 'fade' | 'slide-left' | 'slide-right' | 'zoom';
  duration?: number;
  easing?: string;
}

export interface TransitionDefinition {
  enter: {
    from: CSSProperties;
    to: CSSProperties;
  };
  exit: {
    from: CSSProperties;
    to: CSSProperties;
  };
  duration: number;
  easing: string;
}

// ─── Slides ──────────────────────────────────────────────

export interface SlideMeta {
  transition?: TransitionConfig;
  backgroundColor?: string;
  backgroundImage?: string;
  notes?: string;
}

export interface SlideEntry {
  component: ComponentType;
  meta: SlideMeta;
  path: string;
}

// ─── Deck ────────────────────────────────────────────────

export interface DeckProps {
  slides: SlideEntry[];
  config?: ReslideConfig;
}

// ─── Context Values ──────────────────────────────────────

export interface DeckContextValue {
  currentSlide: number;
  totalSlides: number;
  isPresenterMode: boolean;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  slides: SlideEntry[];
  config: ReslideConfig;
}

export interface SlideContextValue {
  index: number;
  step: number;
  totalSteps: number;
  registerFragment: (order?: number) => number;
  meta: SlideMeta;
  notes: string;
  setNotes: (notes: string) => void;
}

export interface ThemeContextValue {
  theme: ReslideTheme;
}

// ─── Fragment ────────────────────────────────────────────

export type FragmentAnimation = 'appear' | 'fadeIn' | 'flyIn';

export interface FragmentProps {
  children: ReactNode;
  order?: number;
  animation?: FragmentAnimation;
  direction?: 'left' | 'right' | 'up' | 'down';
}

// ─── Export Bridge ───────────────────────────────────────

export interface ReslideExportBridge {
  totalSlides: number;
  stepsPerSlide: number[];
  goTo: (slide: number, step: number) => Promise<void>;
  getNotes: (slide: number) => string;
  getConfig: () => ReslideConfig;
  isReady: () => boolean;
}

declare global {
  interface Window {
    __reslide?: ReslideExportBridge;
  }
}
