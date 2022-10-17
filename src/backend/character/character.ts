import { Deck } from '../deck/deck';

export interface Character {
  readonly name: string;
  readonly deck: Deck;
}
