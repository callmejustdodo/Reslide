import type { ReactNode } from 'react';

interface TitleProps {
  children: ReactNode;
  className?: string;
}

export function Title({ children, className = '' }: TitleProps) {
  return (
    <h1
      className={className}
      style={{
        fontSize: '3.5rem',
        fontWeight: 700,
        fontFamily: 'var(--rs-font-heading)',
        color: 'var(--rs-color-text)',
        lineHeight: 1.2,
        margin: 0,
      }}
    >
      {children}
    </h1>
  );
}
