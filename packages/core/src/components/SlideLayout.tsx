import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

function Center({ children, className = '' }: LayoutProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '4rem',
        gap: '1.5rem',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
}

function Default({ children, className = '' }: LayoutProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '4rem',
        gap: '1.5rem',
      }}
    >
      {children}
    </div>
  );
}

interface TwoColumnProps extends LayoutProps {
  sizes?: [number, number];
  gap?: string;
}

function TwoColumn({ children, className = '', sizes = [1, 1], gap = '2rem' }: TwoColumnProps) {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `${sizes[0]}fr ${sizes[1]}fr`,
        gap,
        width: '100%',
        height: '100%',
        padding: '4rem',
      }}
    >
      {children}
    </div>
  );
}

function Section({ children, className = '' }: LayoutProps) {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '4rem',
        textAlign: 'center',
      }}
    >
      {children}
    </div>
  );
}

function Blank({ children, className = '' }: LayoutProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
}

export const SlideLayout = {
  Center,
  Default,
  TwoColumn,
  Section,
  Blank,
};
