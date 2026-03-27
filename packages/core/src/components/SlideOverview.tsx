import { useCallback, useEffect, useState } from 'react';
import { useDeckContext } from '../context/DeckContext.js';
import { SlideProvider } from '../context/SlideContext.js';
import { SlideFrame } from './SlideFrame.js';
import { cn } from '@/utils/cn.js';

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
      className="fixed inset-0 z-[9998] bg-black/85 backdrop-blur-sm overflow-auto p-8"
      onClick={() => setVisible(false)}
    >
      <div
        className="grid gap-4 justify-center"
        style={{
          gridTemplateColumns: `repeat(auto-fill, ${slideWidth * thumbScale + 16}px)`,
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
              className={cn(
                'cursor-pointer rounded-lg overflow-hidden border-3 transition-colors duration-200',
                index === currentSlide
                  ? 'border-rs-primary'
                  : 'border-transparent hover:border-rs-primary/50',
              )}
            >
              <div
                className="overflow-hidden pointer-events-none"
                style={{
                  width: slideWidth * thumbScale,
                  height: slideHeight * thumbScale,
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
              <div className="text-center p-1 text-xs text-rs-text-secondary font-body">
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
