import type { ReactNode } from 'react';
import type { SlideMeta } from '../types/index.js';
import { cn } from '@/utils/cn.js';

interface SlideFrameProps {
  meta: SlideMeta;
  width: number;
  height: number;
  children: ReactNode;
}

export function SlideFrame({ meta, width, height, children }: SlideFrameProps) {
  return (
    <div
      className={cn(
        'rs-slide-frame relative overflow-hidden bg-rs-background text-rs-text font-body bg-cover bg-center',
      )}
      style={{
        width,
        height,
        backgroundColor: meta.backgroundColor ?? undefined,
        backgroundImage: meta.backgroundImage ? `url(${meta.backgroundImage})` : undefined,
      }}
    >
      {children}
    </div>
  );
}
