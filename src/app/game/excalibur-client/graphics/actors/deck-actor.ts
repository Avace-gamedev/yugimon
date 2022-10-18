import { Actor, CollisionType, Color, Engine, Font, Text, vec } from 'excalibur';
import { CardActor } from './card-actor';
import { State } from 'boardgame.io';
import { CombatState } from '../../../../../backend/combat/combat';
import { Observable } from 'rxjs';

export class DeckActor extends Actor {
  get realWidth(): number {
    return this.card.realWidth;
  }

  get realHeight(): number {
    return this.card.realHeight;
  }

  get hovered$(): Observable<boolean> {
    return this.card.hovered$;
  }

  get clicked$(): Observable<void> {
    return this.card.clicked$;
  }

  private card: CardActor;

  private count: Text;
  private countActor: Actor;

  private title: Text;
  private titleActor: Actor;

  constructor(private deckType: DeckType) {
    super({ collisionType: CollisionType.PreventCollision });
  }

  override onInitialize(_engine: Engine) {
    super.onInitialize(_engine);

    this.card = new CardActor();
    this.addChild(this.card);

    this.count = new Text({ text: '?', color: Color.White });
    this.countActor = new Actor({ collisionType: CollisionType.PreventCollision });
    this.countActor.graphics.use(this.count);
    this.countActor.z = 10;
    this.addChild(this.countActor);

    const title = this.deckType === 'deck' ? 'DECK' : 'DISCARD';
    this.title = new Text({ text: title, font: new Font({ size: 16 }), color: Color.White });
    this.titleActor = new Actor({ collisionType: CollisionType.PreventCollision });
    this.titleActor.graphics.use(this.title);
    this.addChild(this.titleActor);
    this.titleActor.pos = vec(0, -this.card.realHeight / 2 - this.titleActor.height);
  }

  updateState(state: State<CombatState>) {
    switch (this.deckType) {
      case 'deck':
        this.count.text = state.G.playerState.deckState.deck.length.toString();
        break;
      case 'discard':
        this.count.text = state.G.playerState.deckState.discard.length.toString();
        break;
      default:
        this.count.text = '?';
    }
  }
}

export type DeckType = 'deck' | 'discard';
