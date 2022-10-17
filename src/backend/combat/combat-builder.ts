import { Game } from 'boardgame.io';
import { Character } from '../character/character';
import { CombatState } from './combat-state';

export class CombatBuilder {
  constructor(private player: Character, private opponent: Character) {}

  build(): Game<CombatState> {
    return {
      setup: ({ ctx }) => {
        return {};
      },
    };
  }
}
