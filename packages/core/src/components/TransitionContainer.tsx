import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { TransitionDefinition } from '../types/index.js';

interface TransitionContainerProps {
  slideKey: number;
  transition: TransitionDefinition;
  children: ReactNode;
}

export function TransitionContainer({ slideKey, transition, children }: TransitionContainerProps) {
  const [current, setCurrent] = useState<{ key: number; node: ReactNode }>({
    key: slideKey,
    node: children,
  });
  const [previous, setPrevious] = useState<{ key: number; node: ReactNode } | null>(null);
  const [phase, setPhase] = useState<'idle' | 'transitioning'>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (slideKey === current.key) return;

    if (transition.duration === 0) {
      setCurrent({ key: slideKey, node: children });
      return;
    }

    // Start transition
    setPrevious(current);
    setCurrent({ key: slideKey, node: children });
    setPhase('transitioning');

    timerRef.current = setTimeout(() => {
      setPhase('idle');
      setPrevious(null);
    }, transition.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [slideKey, children]);

  if (phase === 'idle' || transition.duration === 0) {
    return <div style={{ width: '100%', height: '100%', position: 'relative' }}>{current.node}</div>;
  }

  const enterStyle: CSSProperties = {
    ...transition.enter.to,
    transition: `all ${transition.duration}ms ${transition.easing}`,
    position: 'absolute',
    inset: 0,
  };

  const exitStyle: CSSProperties = {
    ...transition.exit.to,
    transition: `all ${transition.duration}ms ${transition.easing}`,
    position: 'absolute',
    inset: 0,
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {previous && (
        <div key={`exit-${previous.key}`} style={exitStyle}>
          {previous.node}
        </div>
      )}
      <div key={`enter-${current.key}`} style={enterStyle}>
        {current.node}
      </div>
    </div>
  );
}
