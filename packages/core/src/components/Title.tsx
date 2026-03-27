import type { ReactNode } from 'react';
import { cn } from '@/utils/cn.js';

interface TitleProps {
  children: ReactNode;
  className?: string;
}

export function Title({ children, className }: TitleProps) {
  return (
    <h1
      className={cn(
        'text-[3.5rem] font-bold font-heading text-rs-text leading-tight m-0',
        className,
      )}
    >
      {children}
    </h1>
  );
}
