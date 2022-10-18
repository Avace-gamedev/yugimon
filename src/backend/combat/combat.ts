import { Character } from '../character/character';
import { Card } from '../deck/card';
import { CombatMap } from '../map/combat-map';

export type Player = '0' | '1';

export interface CombatParams {
  readonly startingHandSize: number;

  readonly map: CombatMap;
}

export interface CombatState {
  readonly playerState: CharacterState;
  readonly opponentState: CharacterState;

  readonly map: CombatMap;
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
