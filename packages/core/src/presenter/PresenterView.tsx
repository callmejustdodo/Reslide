import { useCallback, useEffect, useRef } from 'react';
import { useDeckContext } from '../context/DeckContext.js';
import { SlideProvider } from '../context/SlideContext.js';
import { SlideFrame } from '../components/SlideFrame.js';
import { useBroadcastSync } from '../hooks/useBroadcastSync.js';

function ScaledSlide({
  slideWidth,
  slideHeight,
  scale,
  children,
}: {
  slideWidth: number;
  slideHeight: number;
  scale: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: slideWidth * scale,
        height: slideHeight * scale,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          width: slideWidth,
          height: slideHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function PresenterView() {
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

  const slideWidth = config.slide?.width ?? 1920;
  const slideHeight = config.slide?.height ?? 1080;

  useBroadcastSync({
    source: 'presenter',
    currentSlide,
    currentStep,
    onNavigate: useCallback((slide: number) => goToSlide(slide), [goToSlide]),
  });

  // Keyboard navigation in presenter
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

  // Auto-scroll the active thumbnail into view
  const activeThumbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentSlide]);

  const handleTotalSteps = useCallback(() => {}, []);

  const thumbScale = 0.1;
  const thumbW = slideWidth * thumbScale;
  const sidebarWidth = thumbW + 48; // thumbnail + padding + number

  // Main slide: fill center area. Calculate scale to fit.
  // We'll use CSS to make it responsive, but estimate a good scale.
  const mainScale = 0.45;

  const currentEntry = slides[currentSlide];
  if (!currentEntry) return null;
  const CurrentComponent = currentEntry.component;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#f8fafc',
        fontFamily: "'Inter', system-ui, sans-serif",
        display: 'grid',
        gridTemplateColumns: `${sidebarWidth}px 1fr 300px`,
        gridTemplateRows: '1fr auto',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Left sidebar: all slide thumbnails */}
      <div
        style={{
          gridRow: '1 / -1',
          gridColumn: '1',
          overflowY: 'auto',
          overflowX: 'hidden',
          borderRight: '1px solid #333',
          padding: '0.5rem 0',
        }}
      >
        {slides.map((entry, index) => {
          const Comp = entry.component;
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              ref={isActive ? activeThumbRef : undefined}
              onClick={() => goToSlide(index)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.25rem',
                padding: '0.35rem 0.5rem',
                cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
                transition: 'background-color 0.15s',
              }}
            >
              <div
                style={{
                  fontSize: '0.7rem',
                  color: isActive ? '#6366f1' : '#666',
                  minWidth: '1rem',
                  textAlign: 'right',
                  paddingTop: '0.1rem',
                  fontWeight: isActive ? 'bold' : 'normal',
                }}
              >
                {index + 1}
              </div>
              <div
                style={{
                  border: isActive ? '2px solid #6366f1' : '1px solid #444',
                  borderRadius: '3px',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                <ScaledSlide slideWidth={slideWidth} slideHeight={slideHeight} scale={thumbScale}>
                  <SlideProvider
                    index={index}
                    step={index === currentSlide ? currentStep : 0}
                    meta={entry.meta}
                    onTotalStepsChange={handleTotalSteps}
                  >
                    <SlideFrame meta={entry.meta} width={slideWidth} height={slideHeight}>
                      <Comp />
                    </SlideFrame>
                  </SlideProvider>
                </ScaledSlide>
              </div>
            </div>
          );
        })}
      </div>

      {/* Center: large current slide */}
      <div
        style={{
          gridRow: '1',
          gridColumn: '2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          <ScaledSlide slideWidth={slideWidth} slideHeight={slideHeight} scale={mainScale}>
            <SlideProvider
              key={`main-${currentSlide}`}
              index={currentSlide}
              step={currentStep}
              meta={currentEntry.meta}
              onTotalStepsChange={handleTotalSteps}
            >
              <SlideFrame meta={currentEntry.meta} width={slideWidth} height={slideHeight}>
                <CurrentComponent />
              </SlideFrame>
            </SlideProvider>
          </ScaledSlide>
        </div>
      </div>

      {/* Right sidebar: speaker notes */}
      <div
        style={{
          gridRow: '1',
          gridColumn: '3',
          borderLeft: '1px solid #333',
          padding: '1.5rem 1rem',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            fontSize: '1.125rem',
            lineHeight: 1.7,
            color: '#d1d5db',
            whiteSpace: 'pre-wrap',
          }}
        >
          {currentEntry.meta.notes || (
            <span style={{ color: '#555', fontStyle: 'italic' }}>No notes for this slide</span>
          )}
        </div>
      </div>

      {/* Bottom bar: nav controls */}
      <div
        style={{
          gridRow: '2',
          gridColumn: '2 / 4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '0.75rem 1rem',
          borderTop: '1px solid #333',
        }}
      >
        <button
          onClick={prevStep}
          style={{
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2a2a2a',
            color: '#ccc',
            border: '1px solid #444',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {'<'}
        </button>
        <div
          style={{
            fontSize: '1rem',
            color: '#999',
            minWidth: '3rem',
            textAlign: 'center',
          }}
        >
          {currentSlide + 1} / {totalSlides}
        </div>
        <button
          onClick={nextStep}
          style={{
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2a2a2a',
            color: '#ccc',
            border: '1px solid #444',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {'>'}
        </button>
      </div>
    </div>
  );
}
