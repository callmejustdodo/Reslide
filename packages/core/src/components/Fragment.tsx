import { useEffect, useRef, type ReactNode } from 'react';
import { useSlideContext } from '../context/SlideContext.js';
import type { FragmentAnimation } from '../types/index.js';

interface FragmentProps {
  children: ReactNode;
  order?: number;
  animation?: FragmentAnimation;
  direction?: 'left' | 'right' | 'up' | 'down';
  className?: string;
}

const ANIMATIONS: Record<FragmentAnimation, (visible: boolean, direction?: string) => React.CSSProperties> = {
  appear: (visible) => ({
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.3s ease',
  }),
  fadeIn: (visible) => ({
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.5s ease',
  }),
  flyIn: (visible, direction = 'left') => {
    const transforms: Record<string, string> = {
      left: 'translateX(-60px)',
      right: 'translateX(60px)',
      up: 'translateY(-60px)',
      down: 'translateY(60px)',
    };
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translate(0, 0)' : (transforms[direction] ?? 'translateX(-60px)'),
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    };
  },
};

export function Fragment({
  children,
  order: explicitOrder,
  animation = 'appear',
  direction = 'left',
  className = '',
}: FragmentProps) {
  const { step, registerFragment } = useSlideContext();
  const orderRef = useRef<number | null>(null);

  // Register fragment on first render only
  if (orderRef.current === null) {
    orderRef.current = registerFragment(explicitOrder);
  }

  const fragmentOrder = orderRef.current;
  const visible = step >= fragmentOrder;

  const animFn = ANIMATIONS[animation] ?? ANIMATIONS.appear;
  const style = animFn(visible, direction);

  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
