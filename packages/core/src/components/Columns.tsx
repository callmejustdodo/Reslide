import type { ReactNode } from 'react';

interface ColumnsProps {
  children: ReactNode;
  sizes?: number[];
  gap?: string;
  className?: string;
}

export function Columns({
  children,
  sizes = [1, 1],
  gap = '2rem',
  className = '',
}: ColumnsProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: sizes.map((s) => `${s}fr`).join(' '),
        gap,
        width: '100%',
        height: '100%',
      }}
    >
      {children}
    </div>
  );
}
