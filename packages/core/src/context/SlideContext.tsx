import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { SlideMeta, SlideContextValue } from '../types/index.js';

const SlideContext = createContext<SlideContextValue | null>(null);

export function useSlideContext(): SlideContextValue {
  const ctx = useContext(SlideContext);
  if (!ctx) throw new Error('useSlide must be used within a slide');
  return ctx;
}

interface SlideProviderProps {
  index: number;
  step: number;
  meta: SlideMeta;
  onTotalStepsChange: (total: number) => void;
  children: ReactNode;
}

export function SlideProvider({ index, step, meta, onTotalStepsChange, children }: SlideProviderProps) {
  const fragmentCountRef = useRef(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [notes, setNotes] = useState(meta.notes ?? '');

  // Reset fragment count when slide mounts
  useEffect(() => {
    fragmentCountRef.current = 0;
  }, [index]);

  // Notify parent of total steps
  useEffect(() => {
    onTotalStepsChange(totalSteps);
  }, [totalSteps, onTotalStepsChange]);

  const registerFragment = useCallback((order?: number) => {
    if (order !== undefined) {
      setTotalSteps((prev) => Math.max(prev, order));
      return order;
    }
    fragmentCountRef.current += 1;
    const assigned = fragmentCountRef.current;
    setTotalSteps((prev) => Math.max(prev, assigned));
    return assigned;
  }, []);

  const value: SlideContextValue = {
    index,
    step,
    totalSteps,
    registerFragment,
    meta,
    notes,
    setNotes,
  };

  return (
    <SlideContext.Provider value={value}>{children}</SlideContext.Provider>
  );
}
