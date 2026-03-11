import type { ReactNode } from 'react';
import type { SlideMeta } from '../types/index.js';

interface SlideFrameProps {
  meta: SlideMeta;
  width: number;
  height: number;
  children: ReactNode;
}

export function SlideFrame({ meta, width, height, children }: SlideFrameProps) {
  return (
    <div
      className="rs-slide-frame"
      style={{
        width,
        height,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: meta.backgroundColor ?? 'var(--rs-color-background)',
        backgroundImage: meta.backgroundImage ? `url(${meta.backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'var(--rs-color-text)',
        fontFamily: 'var(--rs-font-body)',
      }}
    >
      {children}
    </div>
  );
}
