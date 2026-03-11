import { useCallback, useEffect, useRef, useState } from 'react';
import type { DeckProps } from '../types/index.js';
import { ThemeProvider } from '../context/ThemeContext.js';
import { DeckProvider, useDeckContext } from '../context/DeckContext.js';
import { SlideProvider } from '../context/SlideContext.js';
import { defaultTheme } from '../themes/defaultTheme.js';
import { SlideFrame } from './SlideFrame.js';
import { ExportBridge } from './ExportBridge.js';
import { PresenterView } from '../presenter/PresenterView.js';
import { useBroadcastSync } from '../hooks/useBroadcastSync.js';
import { KeyboardHelp } from './KeyboardHelp.js';
import { SlideOverview } from './SlideOverview.js';
import { SlideErrorBoundary } from './SlideErrorBoundary.js';

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

  const isPresenter = typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('presenter');

  // Sync navigation between presenter and audience windows
  useBroadcastSync({
    source: isPresenter ? 'presenter' : 'audience',
    currentSlide,
    currentStep,
    onNavigate: useCallback((slide: number) => goToSlide(slide), [goToSlide]),
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const slideWidth = config.slide?.width ?? 1920;
  const slideHeight = config.slide?.height ?? 1080;

  // If presenter mode, render presenter view
  if (isPresenter) {
    return <PresenterView />;
  }

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
        case 'p':
        case 'P':
          e.preventDefault();
          window.open(
            `${window.location.origin}${window.location.pathname}?presenter=true${window.location.hash}`,
            'reslide-presenter',
            'width=1200,height=800',
          );
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

  // Touch/swipe support
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    function handleTouchStart(e: TouchEvent) {
      const touch = e.touches[0];
      if (touch) {
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      }
    }

    function handleTouchEnd(e: TouchEvent) {
      if (!touchStartRef.current) return;
      const touch = e.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const threshold = 50;

      // Only handle horizontal swipes (ignore vertical scroll)
      if (absDx > threshold && absDx > absDy) {
        if (dx < 0) {
          nextStep();
        } else {
          prevStep();
        }
      }
      touchStartRef.current = null;
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [nextStep, prevStep]);

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
            <SlideErrorBoundary slideIndex={currentSlide}>
              <SlideComponent />
            </SlideErrorBoundary>
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

      <KeyboardHelp />
      <SlideOverview />
    </div>
  );
}

export function Deck({ slides, config }: DeckProps) {
  const theme = config?.theme ?? defaultTheme;

  return (
    <ThemeProvider theme={theme}>
      <DeckProvider slides={slides} config={config}>
        <DeckInner />
        <ExportBridge />
      </DeckProvider>
    </ThemeProvider>
  );
}
