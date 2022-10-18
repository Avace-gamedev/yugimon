import { Engine, Scene } from 'excalibur';
import { CombatState } from '../../../../backend/combat/combat';
import { CombatMap } from './combat-map';
import { State } from 'boardgame.io';
import { CombatHand } from './combat-hand';
import { CombatDeck } from './combat-deck';
import { CombatDiscard } from './combat-discard';

export class CombatScene extends Scene {
  private map: CombatMap;
  private hand: CombatHand;
  private deck: CombatDeck;
  private discard: CombatDiscard;

  public override onInitialize(_engine: Engine) {
    this.map = new CombatMap();
    this.add(this.map);

    this.hand = new CombatHand();
    this.add(this.hand);

    this.deck = new CombatDeck();
    this.add(this.deck);

    this.discard = new CombatDiscard();
    this.add(this.discard);
  }

  updateState(state: State<CombatState>) {
    this.map.updateState(state);
    this.hand.updateState(state);
    this.deck.updateState(state);
    this.discard.updateState(state);
  }
}
