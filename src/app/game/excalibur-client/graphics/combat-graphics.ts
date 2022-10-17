import { Scene } from 'excalibur';
import { CombatState } from '../../../../backend/combat/combat';
import { CombatMap } from './combat-map';
import { State } from 'boardgame.io';

export class CombatGraphics {
  private map: CombatMap;
  private initialized: boolean;

  constructor(private scene: Scene) {
    this.map = new CombatMap(scene);
  }

  initialize(state: State<CombatState>) {
    if (this.initialized) {
      return;
    }

    this.map.initialize(state);

    console.log(state);

    this.initialized = true;
  }

  update(state: State<CombatState>) {
    if (!this.initialized) {
      this.initialize(state);
    }

    this.map.update(state);
  }
}
