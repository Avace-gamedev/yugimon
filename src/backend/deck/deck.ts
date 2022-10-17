import { Card } from './card';

export interface Deck {
  readonly cards: ReadonlyArray<Card>;
}
