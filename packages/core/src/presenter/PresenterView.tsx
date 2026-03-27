import { useCallback, useEffect, useRef, useState } from 'react';
import { useDeckContext } from '../context/DeckContext.js';
import { SlideProvider } from '../context/SlideContext.js';
import { SlideFrame } from '../components/SlideFrame.js';
import { useBroadcastSync } from '../hooks/useBroadcastSync.js';
import { cn } from '@/utils/cn.js';

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
      className="overflow-hidden relative"
      style={{
        width: slideWidth * scale,
        height: slideHeight * scale,
      }}
    >
      <div
        className="absolute top-0 left-0"
        style={{
          width: slideWidth,
          height: slideHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
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
        case '?':
          e.preventDefault();
          setShowHelp((v) => !v);
          break;
        case 'Escape':
          e.preventDefault();
          setShowHelp(false);
          break;
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextStep, prevStep, goToSlide, totalSlides]);

  const [showHelp, setShowHelp] = useState(false);

  // Auto-scroll the active thumbnail into view
  const activeThumbRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    activeThumbRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentSlide]);

  const handleTotalSteps = useCallback(() => {}, []);

  const thumbScale = 0.1;
  const thumbW = slideWidth * thumbScale;
  const sidebarWidth = thumbW + 48;

  const mainScale = 0.45;

  const currentEntry = slides[currentSlide];
  if (!currentEntry) return null;
  const CurrentComponent = currentEntry.component;

  return (
    <div
      className="w-screen h-screen bg-[#1a1a1a] text-gray-50 font-sans grid overflow-hidden box-border"
      style={{
        gridTemplateColumns: `${sidebarWidth}px 1fr 300px`,
        gridTemplateRows: '1fr auto',
      }}
    >
      {/* Left sidebar: all slide thumbnails */}
      <div className="row-span-full col-start-1 overflow-y-auto overflow-x-hidden border-r border-[#333] py-2">
        {slides.map((entry, index) => {
          const Comp = entry.component;
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              ref={isActive ? activeThumbRef : undefined}
              onClick={() => goToSlide(index)}
              className={cn(
                'flex items-start gap-1 px-2 py-1.5 cursor-pointer transition-colors duration-150 border-l-3',
                isActive
                  ? 'bg-indigo-500/15 border-l-indigo-500'
                  : 'bg-transparent border-l-transparent hover:bg-white/5',
              )}
            >
              <div
                className={cn(
                  'text-[0.7rem] min-w-4 text-right pt-0.5',
                  isActive ? 'text-indigo-500 font-bold' : 'text-[#666]',
                )}
              >
                {index + 1}
              </div>
              <div
                className={cn(
                  'rounded-sm overflow-hidden shrink-0',
                  isActive ? 'border-2 border-indigo-500' : 'border border-[#444]',
                )}
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
      <div className="row-start-1 col-start-2 flex items-center justify-center p-6 overflow-hidden">
        <div className="rounded-lg overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
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
      <div className="row-start-1 col-start-3 border-l border-[#333] p-6 overflow-y-auto">
        <div className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
          {currentEntry.meta.notes || (
            <span className="text-[#555] italic">No notes for this slide</span>
          )}
        </div>
      </div>

      {/* Bottom bar: nav controls */}
      <div className="row-start-2 col-start-2 col-span-2 flex items-center justify-center gap-4 py-3 px-4 border-t border-[#333] relative">
        <button
          onClick={prevStep}
          className="size-10 flex items-center justify-center bg-[#2a2a2a] text-[#ccc] border border-[#444] rounded-full cursor-pointer text-base hover:bg-[#333] transition-colors"
        >
          {'<'}
        </button>
        <div className="text-base text-[#999] min-w-12 text-center">
          {currentSlide + 1} / {totalSlides}
        </div>
        <button
          onClick={nextStep}
          className="size-10 flex items-center justify-center bg-[#2a2a2a] text-[#ccc] border border-[#444] rounded-full cursor-pointer text-base hover:bg-[#333] transition-colors"
        >
          {'>'}
        </button>
        <button
          onClick={() => setShowHelp((v) => !v)}
          className="absolute right-4 size-8 flex items-center justify-center bg-[#2a2a2a] text-[#888] border border-[#444] rounded-full cursor-pointer text-sm font-bold hover:bg-[#333] transition-colors"
        >
          ?
        </button>
      </div>

      {/* Help panel */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-[#2a2a2a] border border-[#444] rounded-xl px-10 py-8 max-w-md w-[90%] text-gray-200 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xl font-bold mb-5">
              Keyboard Shortcuts
            </div>
            {[
              ['\u2192 / Space', 'Next step / slide'],
              ['\u2190', 'Previous step / slide'],
              ['Home', 'First slide'],
              ['End', 'Last slide'],
              ['?', 'Toggle this help'],
              ['Esc', 'Close this help'],
            ].map(([key, desc]) => (
              <div
                key={key}
                className="flex justify-between items-center py-1.5 border-b border-[#333]"
              >
                <kbd className="bg-[#1a1a1a] border border-[#555] rounded px-2 py-0.5 text-xs font-mono text-gray-300">
                  {key}
                </kbd>
                <span className="text-gray-400 text-sm">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
