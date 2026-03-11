import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { DeckContextValue, ReslideConfig, SlideEntry } from '../types/index.js';

const defaultConfig: ReslideConfig = {
  transition: { type: 'none' },
  aspectRatio: '16:9',
  slide: { width: 1920, height: 1080 },
};

const DeckContext = createContext<DeckContextValue | null>(null);

export function useDeckContext(): DeckContextValue {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error('useDeck must be used within a <Deck>');
  return ctx;
}

/** Internal context for SlideProvider to update totalSteps */
const TotalStepsContext = createContext<(n: number) => void>(() => {});

export function useTotalStepsSetter() {
  return useContext(TotalStepsContext);
}

interface DeckProviderProps {
  slides: SlideEntry[];
  config?: ReslideConfig;
  children: ReactNode;
}

export function DeckProvider({ slides, config: userConfig, children }: DeckProviderProps) {
  const config = useMemo(() => ({ ...defaultConfig, ...userConfig }), [userConfig]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < slides.length) {
        setCurrentSlide(index);
        setCurrentStep(0);
        setTotalSteps(0);
      }
    },
    [slides.length],
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((s) => {
      if (s < slides.length - 1) {
        setCurrentStep(0);
        setTotalSteps(0);
        return s + 1;
      }
      return s;
    });
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((s) => {
      if (s > 0) {
        setCurrentStep(0);
        setTotalSteps(0);
        return s - 1;
      }
      return s;
    });
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((s) => {
      if (s < totalSteps) return s + 1;
      // Advance to next slide
      setCurrentSlide((sl) => {
        if (sl < slides.length - 1) {
          setTotalSteps(0);
          return sl + 1;
        }
        return sl;
      });
      return 0;
    });
  }, [totalSteps, slides.length]);

  const prevStep = useCallback(() => {
    setCurrentStep((s) => {
      if (s > 0) return s - 1;
      // Go to previous slide
      setCurrentSlide((sl) => {
        if (sl > 0) {
          setTotalSteps(0);
          return sl - 1;
        }
        return sl;
      });
      return 0;
    });
  }, []);

  const value: DeckContextValue = {
    currentSlide,
    totalSlides: slides.length,
    isPresenterMode: false,
    goToSlide,
    nextSlide,
    prevSlide,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    slides,
    config,
  };

  return (
    <DeckContext.Provider value={value}>
      <TotalStepsContext.Provider value={setTotalSteps}>
        {children}
      </TotalStepsContext.Provider>
    </DeckContext.Provider>
  );
}
