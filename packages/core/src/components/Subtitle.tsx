import type { ReactNode } from 'react';

interface SubtitleProps {
  children: ReactNode;
  className?: string;
}

export function Subtitle({ children, className = '' }: SubtitleProps) {
  return (
    <h2
      className={className}
      style={{
        fontSize: '2.25rem',
        fontWeight: 500,
        fontFamily: 'var(--rs-font-heading)',
        color: 'var(--rs-color-text-secondary)',
        lineHeight: 1.3,
        margin: 0,
      }}
    >
      {children}
    </h2>
  );
}
