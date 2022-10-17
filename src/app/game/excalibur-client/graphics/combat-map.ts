import { Scene } from 'excalibur';
import { State } from 'boardgame.io';
import { CombatState } from '../../../../backend/combat/combat';

export class CombatMap {
  constructor(private scene: Scene) {}

  initialize(state: State<CombatState>) {}
  update(state: State<CombatState>) {}
}
