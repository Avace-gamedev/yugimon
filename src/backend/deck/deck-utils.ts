import { Card } from './card';

/*
  Return a copy of its inputs where cards have been shuffled
 */
export const shuffle = (cards: ReadonlyArray<Card>) => {
  return [...cards];
};
