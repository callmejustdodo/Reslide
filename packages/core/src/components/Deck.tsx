import { useCallback, useEffect, useRef, useState } from 'react';
import type { DeckProps } from '../types/index.js';
import { ThemeProvider } from '../context/ThemeContext.js';
import { DeckProvider, useDeckContext } from '../context/DeckContext.js';
import { SlideProvider } from '../context/SlideContext.js';
import { defaultTheme } from '../themes/defaultTheme.js';
import { SlideFrame } from './SlideFrame.js';

function DeckInner() {
  const {
    currentSlide,
    currentStep,
    totalSlides,
    nextStep,
    prevStep,
    goToSlide,
    slides,
    config,
  } = useDeckContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const slideWidth = config.slide?.width ?? 1920;
  const slideHeight = config.slide?.height ?? 1080;

  // Viewport scaling
  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return;
      const parent = containerRef.current.parentElement;
      if (!parent) return;
      const scaleX = parent.clientWidth / slideWidth;
      const scaleY = parent.clientHeight / slideHeight;
      setScale(Math.min(scaleX, scaleY));
    }

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [slideWidth, slideHeight]);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextStep();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevStep();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(totalSlides - 1);
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStep, prevStep, goToSlide, totalSlides]);

  // Hash-based navigation
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#\/(\d+)$/);
    if (match) {
      const slideIndex = parseInt(match[1]!, 10) - 1;
      if (slideIndex >= 0 && slideIndex < totalSlides) {
        goToSlide(slideIndex);
      }
    }
  }, [goToSlide, totalSlides]);

  // Update hash on navigation
  useEffect(() => {
    window.location.hash = `#/${currentSlide + 1}`;
  }, [currentSlide]);

  const currentEntry = slides[currentSlide];
  if (!currentEntry) return null;

  const SlideComponent = currentEntry.component;

  const handleTotalStepsChange = useCallback((_total: number) => {
    // This is handled by SlideProvider → DeckContext's TotalStepsContext
  }, []);

  return (
    <div
      ref={containerRef}
      className="rs-deck-root"
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--rs-color-background)',
      }}
    >
      <div
        style={{
          width: slideWidth,
          height: slideHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <SlideProvider
          key={currentSlide}
          index={currentSlide}
          step={currentStep}
          meta={currentEntry.meta}
          onTotalStepsChange={handleTotalStepsChange}
        >
          <SlideFrame meta={currentEntry.meta} width={slideWidth} height={slideHeight}>
            <SlideComponent />
          </SlideFrame>
        </SlideProvider>
      </div>

      {/* Slide counter */}
      <div
        style={{
          position: 'fixed',
          bottom: '1rem',
          right: '1rem',
          fontSize: '0.875rem',
          color: 'var(--rs-color-text-secondary)',
          fontFamily: 'var(--rs-font-body)',
          opacity: 0.6,
        }}
      >
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
}

export function Deck({ slides, config }: DeckProps) {
  const theme = config?.theme ?? defaultTheme;

  return (
    <ThemeProvider theme={theme}>
      <DeckProvider slides={slides} config={config}>
        <DeckInner />
      </DeckProvider>
    </ThemeProvider>
  );
}
