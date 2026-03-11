import { createRoot } from 'react-dom/client';
import { Deck, type SlideEntry } from '@reslide/core';
import Slide01 from './slides/01-intro.js';
import Slide02 from './slides/02-features.js';
import Slide03 from './slides/03-closing.js';

const slides: SlideEntry[] = [
  { component: Slide01, meta: {}, path: '01-intro' },
  { component: Slide02, meta: {}, path: '02-features' },
  { component: Slide03, meta: {}, path: '03-closing' },
];

createRoot(document.getElementById('root')!).render(
  <Deck slides={slides} />,
);
