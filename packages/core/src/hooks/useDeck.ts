import { useDeckContext } from '../context/DeckContext.js';
import type { DeckContextValue } from '../types/index.js';

export function useDeck(): DeckContextValue {
  return useDeckContext();
}
