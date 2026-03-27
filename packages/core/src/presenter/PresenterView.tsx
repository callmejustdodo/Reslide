import { useCallback, useEffect, useRef, useState } from 'react';
import { useDeckContext } from '../context/DeckContext.js';
import { SlideProvider } from '../context/SlideContext.js';
import { SlideFrame } from '../components/SlideFrame.js';
import { useBroadcastSync } from '../hooks/useBroadcastSync.js';
import { cn } from '@/utils/cn.js';
import { Button } from '@/components/ui/button.js';
import { Badge } from '@/components/ui/badge.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { ScrollArea } from '@/components/ui/scroll-area.js';
import { Separator } from '@/components/ui/separator.js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog.js';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table.js';

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
      <ScrollArea className="row-span-full col-start-1 border-r border-[#333]">
        <div className="py-2">
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
                <Badge
                  variant={isActive ? 'default' : 'outline'}
                  className={cn(
                    'text-[0.6rem] min-w-5 justify-center mt-0.5',
                    !isActive && 'border-[#444] text-[#666]',
                  )}
                >
                  {index + 1}
                </Badge>
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
      </ScrollArea>

      {/* Center: large current slide */}
      <div className="row-start-1 col-start-2 flex items-center justify-center p-6 overflow-hidden">
        <Card className="overflow-hidden border-0 p-0 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <CardContent className="p-0">
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
          </CardContent>
        </Card>
      </div>

      {/* Right sidebar: speaker notes */}
      <Card className="row-start-1 col-start-3 rounded-none border-0 border-l border-[#333] bg-transparent">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-400 uppercase tracking-wider">
            Speaker Notes
          </CardTitle>
        </CardHeader>
        <Separator className="bg-[#333]" />
        <CardContent className="pt-4">
          <ScrollArea className="h-full">
            <div className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap">
              {currentEntry.meta.notes || (
                <span className="text-[#555] italic">No notes for this slide</span>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Bottom bar: nav controls */}
      <div className="row-start-2 col-start-2 col-span-2 flex items-center justify-center gap-4 py-3 px-4 border-t border-[#333] relative">
        <Button
          variant="outline"
          size="icon"
          onClick={prevStep}
          className="rounded-full bg-[#2a2a2a] border-[#444] text-[#ccc] hover:bg-[#333] hover:text-white"
        >
          {'<'}
        </Button>
        <Badge variant="secondary" className="text-base min-w-12 justify-center">
          {currentSlide + 1} / {totalSlides}
        </Badge>
        <Button
          variant="outline"
          size="icon"
          onClick={nextStep}
          className="rounded-full bg-[#2a2a2a] border-[#444] text-[#ccc] hover:bg-[#333] hover:text-white"
        >
          {'>'}
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setShowHelp((v) => !v)}
          className="absolute right-4 rounded-full text-[#888] hover:text-white hover:bg-[#333]"
        >
          ?
        </Button>
      </div>

      {/* Help dialog */}
      <Dialog open={showHelp} onOpenChange={setShowHelp}>
        <DialogContent className="bg-[#2a2a2a] border-[#444] text-gray-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>Navigate the presenter view</DialogDescription>
          </DialogHeader>
          <Table>
            <TableBody>
              {[
                ['\u2192 / Space', 'Next step / slide'],
                ['\u2190', 'Previous step / slide'],
                ['Home', 'First slide'],
                ['End', 'Last slide'],
                ['?', 'Toggle this help'],
                ['Esc', 'Close this help'],
              ].map(([key, desc]) => (
                <TableRow key={key} className="border-[#333]">
                  <TableCell className="w-32">
                    <Badge variant="outline" className="font-mono text-xs border-[#555] text-gray-300">
                      {key}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400">{desc}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
