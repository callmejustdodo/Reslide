import type { ReactNode } from 'react';

interface BodyProps {
  children: ReactNode;
  className?: string;
}

export function Body({ children, className = '' }: BodyProps) {
  return (
    <p
      className={className}
      style={{
        fontSize: '1.75rem',
        fontFamily: 'var(--rs-font-body)',
        color: 'var(--rs-color-text-secondary)',
        lineHeight: 1.6,
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}
