import { Actor, CollisionType, Color, Engine, Font, Text, vec } from 'excalibur';
import { CardActor } from './cards/card-actor';
import { State } from 'boardgame.io';
import { CombatState } from '../../../../backend/combat/combat';

export class CombatDeck extends Actor {
  private card: CardActor;

  private count: Text;
  private countActor: Actor;

  private title: Text;
  private titleActor: Actor;

  constructor() {
    super({ collisionType: CollisionType.PreventCollision });
  }

  override onInitialize(_engine: Engine) {
    this.card = new CardActor();
    this.addChild(this.card);

    this.count = new Text({ text: '?', color: Color.White });
    this.countActor = new Actor({ collisionType: CollisionType.PreventCollision });
    this.countActor.graphics.use(this.count);
    this.addChild(this.countActor);

    this.title = new Text({ text: 'DECK', font: new Font({ size: 16 }), color: Color.White });
    this.titleActor = new Actor({ collisionType: CollisionType.PreventCollision });
    this.titleActor.graphics.use(this.title);
    this.addChild(this.titleActor);
    this.titleActor.pos = vec(0, -this.card.fullHeight / 2 - this.titleActor.height);
  }

  updateState(state: State<CombatState>) {
    this.count.text = state.G.playerState.deckState.deck.length.toString();
  }

  override update(engine: Engine, delta: number) {
    super.update(engine, delta);

    this.placeDeck();
  }

  private placeDeck() {
    const deckWidth = this.card.fullWidth;
    const deckHeight = this.card.fullHeight;

    const posX = this.scene.engine.screen.drawWidth - deckWidth / 2 - 5;
    const posY = this.scene.engine.screen.drawHeight - deckHeight / 2 - 5;

    this.pos = vec(posX, posY);
  }
}
