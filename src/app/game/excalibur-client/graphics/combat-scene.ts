import { Engine, Scene, vec } from 'excalibur';
import { CombatState } from '../../../../backend/combat/combat';
import { MapActor } from './actors/map-actor';
import { State } from 'boardgame.io';
import { HandActor } from './actors/hand-actor';
import { DeckActor } from './actors/deck-actor';
import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';

export class CombatScene extends Scene {
  private map: MapActor;
  private hand: HandActor;
  private deck: DeckActor;
  private discard: DeckActor;

  constructor(private gameClient: _ClientImpl<CombatState>) {
    super();
  }

  public override onInitialize(_engine: Engine) {
    super.onInitialize(_engine);

    this.engine = _engine;

    this.map = new MapActor();
    this.add(this.map);

    this.hand = new HandActor();
    this.add(this.hand);

    this.deck = new DeckActor('deck');
    this.add(this.deck);

    this.discard = new DeckActor('discard');
    this.add(this.discard);
  }

  override onActivate(_context) {
    super.onActivate(_context);

    this.updateState(this.gameClient.getState());
    this.gameClient.subscribe(s => this.updateState(s));
  }

  updateState(state: State<CombatState>) {
    this.map.updateState(state);
    this.hand.updateState(state);
    this.deck.updateState(state);
    this.discard.updateState(state);

    this.place();
  }

  private place() {
    if (!this.isInitialized) {
      return;
    }

    const screenWidth = this.engine.screen.drawWidth;
    const screenHeight = this.engine.screen.drawHeight;

    this.hand.pos = vec(screenWidth / 2, screenHeight - this.hand.realHeight / 2 - 5);

    this.deck.pos = vec(screenWidth - this.deck.realWidth / 2 - 5, screenHeight - this.deck.realHeight / 2 - 5);
    this.discard.pos = vec(this.discard.realWidth / 2 + 5, screenHeight - this.discard.realHeight / 2 - 5);
  }
}
