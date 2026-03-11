import { useCallback } from 'react';
import { useDeckContext } from '../context/DeckContext.js';
import { SlideProvider } from '../context/SlideContext.js';
import { SlideFrame } from '../components/SlideFrame.js';
import { PresenterTimer } from './PresenterTimer.js';
import { PresenterNotes } from './PresenterNotes.js';
import { useBroadcastSync } from '../hooks/useBroadcastSync.js';

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

  const currentEntry = slides[currentSlide];
  const nextEntry = slides[currentSlide + 1];
  if (!currentEntry) return null;

  const CurrentComponent = currentEntry.component;
  const NextComponent = nextEntry?.component;

  const previewScale = 0.3;
  const smallPreviewScale = 0.2;

  const handleTotalSteps = useCallback(() => {}, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gridTemplateRows: '1fr auto auto',
      gap: '1rem',
      padding: '1rem',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Current slide */}
      <div style={{
        gridRow: '1',
        gridColumn: '1',
        overflow: 'hidden',
        borderRadius: '0.5rem',
        border: '2px solid #334155',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: slideWidth,
          height: slideHeight,
          transform: `scale(${previewScale})`,
          transformOrigin: 'center center',
        }}>
          <SlideProvider key={currentSlide} index={currentSlide} step={currentStep} meta={currentEntry.meta} onTotalStepsChange={handleTotalSteps}>
            <SlideFrame meta={currentEntry.meta} width={slideWidth} height={slideHeight}>
              <CurrentComponent />
            </SlideFrame>
          </SlideProvider>
        </div>
      </div>

      {/* Next slide preview */}
      <div style={{
        gridRow: '1',
        gridColumn: '2',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div style={{
          fontSize: '0.875rem',
          color: '#64748b',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Next
        </div>
        <div style={{
          flex: 1,
          overflow: 'hidden',
          borderRadius: '0.5rem',
          border: '1px solid #334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {NextComponent ? (
            <div style={{
              width: slideWidth,
              height: slideHeight,
              transform: `scale(${smallPreviewScale})`,
              transformOrigin: 'center center',
            }}>
              <SlideProvider key={currentSlide + 1} index={currentSlide + 1} step={0} meta={nextEntry!.meta} onTotalStepsChange={handleTotalSteps}>
                <SlideFrame meta={nextEntry!.meta} width={slideWidth} height={slideHeight}>
                  <NextComponent />
                </SlideFrame>
              </SlideProvider>
            </div>
          ) : (
            <div style={{ color: '#64748b', fontStyle: 'italic' }}>End of deck</div>
          )}
        </div>
      </div>

      {/* Speaker notes */}
      <div style={{
        gridRow: '2',
        gridColumn: '1 / -1',
        maxHeight: '200px',
        overflow: 'auto',
        borderRadius: '0.5rem',
        border: '1px solid #334155',
        backgroundColor: '#1e293b',
      }}>
        <PresenterNotes notes={currentEntry.meta.notes ?? ''} />
      </div>

      {/* Footer: counter + timer + nav */}
      <div style={{
        gridRow: '3',
        gridColumn: '1 / -1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
      }}>
        <div style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
          {currentSlide + 1} / {totalSlides}
        </div>
        <PresenterTimer />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={prevStep}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#334155',
              color: '#f8fafc',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            ← Prev
          </button>
          <button
            onClick={nextStep}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: '#f8fafc',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
