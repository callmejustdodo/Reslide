interface ReslideExportBridge {
  totalSlides: number;
  stepsPerSlide: number[];
  goTo: (slide: number, step: number) => Promise<void>;
  getNotes: (slide: number) => string;
  getConfig: () => unknown;
  isReady: () => boolean;
}

declare global {
  interface Window {
    __reslide?: ReslideExportBridge;
  }
}

export {};
