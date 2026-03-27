import { useEffect, useCallback, useRef, useState } from 'react';
import { useDeckContext } from '../context/DeckContext.js';
import { SlideProvider } from '../context/SlideContext.js';
import { SlideFrame } from './SlideFrame.js';
import type { ReslideExportBridge } from '../types/index.js';

/**
 * Exposes window.__reslide for export tooling (PDF/PPTX).
 * Only active when ?export=true URL param is present.
 *
 * In export mode this component renders every slide off-screen once to
 * discover how many fragment steps each slide has, then exposes a bridge
 * that lets the export script navigate to any (slide, step) pair.
 */
export function ExportBridge() {
  const {
    slides,
    totalSlides,
    currentSlide,
    currentStep,
    goToSlide,
    config,
  } = useDeckContext();

  const isExportMode =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('export');

  // ── Step discovery ────────────────────────────────────────
  // We render each slide invisibly to let fragments register, then record
  // the totalSteps reported per slide.
  const [stepsPerSlide, setStepsPerSlide] = useState<number[]>(() =>
    slides.map(() => 0),
  );
  const [discoveryDone, setDiscoveryDone] = useState(false);

  const handleStepDiscovery = useCallback(
    (slideIndex: number, total: number) => {
      setStepsPerSlide((prev) => {
        if (prev[slideIndex] === total) return prev;
        const next = [...prev];
        next[slideIndex] = total;
        return next;
      });
    },
    [],
  );

  // Mark discovery as done after a short delay so all slides have rendered.
  useEffect(() => {
    if (!isExportMode) return;
    const id = setTimeout(() => setDiscoveryDone(true), 500);
    return () => clearTimeout(id);
  }, [isExportMode]);

  // ── Notes collection ──────────────────────────────────────
  const notesRef = useRef(new Map<number, string>());

  // Collect static notes from meta upfront
  useEffect(() => {
    if (!isExportMode) return;
    slides.forEach((entry, i) => {
      if (entry.meta.notes) {
        notesRef.current.set(i, entry.meta.notes);
      }
    });
  }, [isExportMode, slides]);

  // ── Step navigation via DeckContext ────────────────────────
  // goTo sets both slide and step. We use goToSlide for the slide part,
  // then dispatch a custom event that DeckProvider listens to for the step.
  // However, DeckContext.goToSlide always resets step to 0.
  // Instead we rely on a resolve-on-render pattern: set state, wait for
  // React to re-render, then resolve.
  const pendingResolveRef = useRef<(() => void) | null>(null);

  const goTo = useCallback(
    async (slide: number, step: number) => {
      goToSlide(slide);
      // Wait for the slide change to render
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => setTimeout(resolve, 50));
      });

      // Now step through to the desired step
      if (step > 0) {
        // We need to set step directly. Since DeckContext exposes setCurrentStep
        // via TotalStepsContext indirectly, and goToSlide resets step to 0,
        // we dispatch a custom event that the patched DeckProvider can handle.
        window.dispatchEvent(
          new CustomEvent('reslide:export-goto', {
            detail: { slide, step },
          }),
        );
        // Wait for step render
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => setTimeout(resolve, 100));
        });
      }
    },
    [goToSlide],
  );

  // ── Bridge object ─────────────────────────────────────────
  const bridgeRef = useRef<ReslideExportBridge | null>(null);

  // Update bridge whenever relevant state changes
  useEffect(() => {
    if (!isExportMode) return;

    const bridge: ReslideExportBridge = {
      totalSlides,
      stepsPerSlide,
      goTo,
      getNotes: (slide: number) => {
        return notesRef.current.get(slide) ?? slides[slide]?.meta.notes ?? '';
      },
      getConfig: () => config,
      isReady: () => discoveryDone,
    };

    bridgeRef.current = bridge;
    window.__reslide = bridge;

    return () => {
      delete window.__reslide;
    };
  }, [isExportMode, totalSlides, stepsPerSlide, goTo, slides, config, discoveryDone]);

  // ── Discovery render ──────────────────────────────────────
  // Render all slides invisibly to discover fragment counts.
  if (!isExportMode) return null;

  const slideWidth = config.slide?.width ?? 1920;
  const slideHeight = config.slide?.height ?? 1080;

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        top: -99999,
        left: -99999,
        width: slideWidth,
        height: slideHeight,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: 0,
      }}
    >
      {slides.map((entry, i) => {
        const Comp = entry.component;
        return (
          <SlideProvider
            key={`discovery-${i}`}
            index={i}
            step={0}
            meta={entry.meta}
            onTotalStepsChange={(total) => handleStepDiscovery(i, total)}
          >
            <SlideFrame meta={entry.meta} width={slideWidth} height={slideHeight}>
              <Comp />
            </SlideFrame>
          </SlideProvider>
        );
      })}
    </div>
  );
}
