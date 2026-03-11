import { useRef } from 'react';
import { useSlideContext } from '../context/SlideContext.js';

/**
 * Low-level hook for custom step-based animations.
 * Registers a fragment and returns visibility state.
 */
export function useStep(order?: number): { visible: boolean; step: number } {
  const { step, registerFragment } = useSlideContext();
  const orderRef = useRef<number | null>(null);

  if (orderRef.current === null) {
    orderRef.current = registerFragment(order);
  }

  return {
    visible: step >= orderRef.current,
    step,
  };
}
