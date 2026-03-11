import { useSlideContext } from '../context/SlideContext.js';
import type { SlideContextValue } from '../types/index.js';

export function useSlide(): SlideContextValue {
  return useSlideContext();
}
