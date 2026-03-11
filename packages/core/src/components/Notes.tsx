import { useEffect } from 'react';
import { useSlideContext } from '../context/SlideContext.js';

interface NotesProps {
  children: string;
}

/** Speaker notes — renders nothing visible, registers notes in SlideContext */
export function Notes({ children }: NotesProps) {
  const { setNotes } = useSlideContext();

  useEffect(() => {
    setNotes(children);
  }, [children, setNotes]);

  return null;
}
