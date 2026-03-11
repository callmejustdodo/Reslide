import type { TransitionDefinition, TransitionConfig } from '../types/index.js';

const fade: TransitionDefinition = {
  enter: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  exit: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  duration: 400,
  easing: 'ease-in-out',
};

const slideLeft: TransitionDefinition = {
  enter: {
    from: { opacity: 0, transform: 'translateX(100%)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  exit: {
    from: { opacity: 1, transform: 'translateX(0)' },
    to: { opacity: 0, transform: 'translateX(-100%)' },
  },
  duration: 400,
  easing: 'ease-in-out',
};

const slideRight: TransitionDefinition = {
  enter: {
    from: { opacity: 0, transform: 'translateX(-100%)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  exit: {
    from: { opacity: 1, transform: 'translateX(0)' },
    to: { opacity: 0, transform: 'translateX(100%)' },
  },
  duration: 400,
  easing: 'ease-in-out',
};

const zoom: TransitionDefinition = {
  enter: {
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  exit: {
    from: { opacity: 1, transform: 'scale(1)' },
    to: { opacity: 0, transform: 'scale(1.2)' },
  },
  duration: 400,
  easing: 'ease-in-out',
};

const none: TransitionDefinition = {
  enter: { from: {}, to: {} },
  exit: { from: {}, to: {} },
  duration: 0,
  easing: 'linear',
};

const TRANSITIONS: Record<string, TransitionDefinition> = {
  fade,
  'slide-left': slideLeft,
  'slide-right': slideRight,
  zoom,
  none,
};

export function getTransition(config?: TransitionConfig): TransitionDefinition {
  if (!config || config.type === 'none') return none;
  const def = TRANSITIONS[config.type] ?? none;
  return {
    ...def,
    duration: config.duration ?? def.duration,
    easing: config.easing ?? def.easing,
  };
}

export { fade, slideLeft, slideRight, zoom, none };
