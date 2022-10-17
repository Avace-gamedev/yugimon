import { Character } from '../character/character';
import { Card } from '../deck/card';

export type Player = '0' | '1';

export interface CombatParams {
  readonly deckSize: number;
}

export interface CombatState {
  readonly playerState: CharacterState;
  readonly opponentState: CharacterState;
}

export interface CharacterState {
  readonly character: Character;
  readonly deckState: DeckState;
}

export interface DeckState {
  readonly hand: Card[];
  readonly board: Card[];
  readonly discard: Card[];
  readonly deck: Card[];
}
