import { useCallback, useEffect, useState } from 'react';
import { useDeckContext } from '../context/DeckContext.js';
import { SlideProvider } from '../context/SlideContext.js';
import { SlideFrame } from './SlideFrame.js';

export function SlideOverview() {
  const { slides, currentSlide, goToSlide, config } = useDeckContext();
  const [visible, setVisible] = useState(false);

  const slideWidth = config.slide?.width ?? 1920;
  const slideHeight = config.slide?.height ?? 1080;
  const thumbScale = 0.15;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.key === 'o' || e.key === 'O') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setVisible((v) => !v);
      }
      if (e.key === 'Escape' && visible) {
        setVisible(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  const handleSelect = useCallback(
    (index: number) => {
      goToSlide(index);
      setVisible(false);
    },
    [goToSlide],
  );

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(4px)',
        overflow: 'auto',
        padding: '2rem',
      }}
      onClick={() => setVisible(false)}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fill, ${slideWidth * thumbScale + 16}px)`,
          gap: '1rem',
          justifyContent: 'center',
        }}
      >
        {slides.map((entry, index) => {
          const Comp = entry.component;
          return (
            <div
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(index);
              }}
              style={{
                cursor: 'pointer',
                borderRadius: '8px',
                border: index === currentSlide ? '3px solid var(--rs-color-primary, #6366f1)' : '3px solid transparent',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <div
                style={{
                  width: slideWidth * thumbScale,
                  height: slideHeight * thumbScale,
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}
              >
                <div
                  style={{
                    width: slideWidth,
                    height: slideHeight,
                    transform: `scale(${thumbScale})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <SlideProvider index={index} step={0} meta={entry.meta} onTotalStepsChange={() => {}}>
                    <SlideFrame meta={entry.meta} width={slideWidth} height={slideHeight}>
                      <Comp />
                    </SlideFrame>
                  </SlideProvider>
                </div>
              </div>
              <div
                style={{
                  textAlign: 'center',
                  padding: '0.25rem',
                  fontSize: '0.75rem',
                  color: 'var(--rs-color-text-secondary, #94a3b8)',
                  fontFamily: 'var(--rs-font-body)',
                }}
              >
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
