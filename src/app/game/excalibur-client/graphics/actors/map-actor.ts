import { Actor, Engine } from 'excalibur';
import { CombatState } from '../../../../../backend/combat/combat';
import { State } from 'boardgame.io';
import { CombatMap } from '../../../../../backend/map/combat-map';

export class MapActor extends Actor {
  private map: CombatMap;
  private engine: Engine;

  override onInitialize(_engine: Engine) {
    this.engine = _engine;
  }

  updateState(state: State<CombatState>) {
    this.map = state.G.map;
  }
}
