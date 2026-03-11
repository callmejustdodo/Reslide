import { createRoot } from 'react-dom/client';
import { Deck } from '@reslide/core';
import { slides } from 'virtual:reslide/slides';
import config from 'virtual:reslide/config';

createRoot(document.getElementById('root')!).render(
  <Deck slides={slides} config={config} />,
);
