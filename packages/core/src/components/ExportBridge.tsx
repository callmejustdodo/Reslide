import { useEffect, useCallback } from 'react';
import { useDeckContext } from '../context/DeckContext.js';
import type { ReslideExportBridge } from '../types/index.js';

/**
 * Exposes window.__reslide for export tooling (PDF/PPTX).
 * Only active when ?export=true URL param is present.
 */
export function ExportBridge() {
  const { slides, totalSlides, goToSlide, config } = useDeckContext();

  const isExportMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('export');

  const notesMap = new Map<number, string>();

  const bridge: ReslideExportBridge = {
    totalSlides,
    stepsPerSlide: slides.map(() => 0), // Will be populated per-slide
    goTo: async (slide: number, _step: number) => {
      goToSlide(slide);
      // Wait for React render + CSS transitions to settle
      await new Promise((resolve) => requestAnimationFrame(resolve));
      await new Promise((resolve) => setTimeout(resolve, 100));
    },
    getNotes: (slide: number) => {
      return notesMap.get(slide) ?? slides[slide]?.meta.notes ?? '';
    },
    getConfig: () => config,
    isReady: () => true,
  };

  useEffect(() => {
    if (isExportMode) {
      window.__reslide = bridge;
    }
    return () => {
      if (isExportMode) {
        delete window.__reslide;
      }
    };
  });

  return null;
}
