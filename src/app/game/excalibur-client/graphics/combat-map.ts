import { Actor } from 'excalibur';
import { CombatState } from '../../../../backend/combat/combat';
import { State } from 'boardgame.io';

export class CombatMap extends Actor {
  updateState(state: State<CombatState>) {}
}
