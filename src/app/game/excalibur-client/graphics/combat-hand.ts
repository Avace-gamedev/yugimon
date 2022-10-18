import { Actor, CollisionType, Engine, vec } from 'excalibur';
import { CardActor } from './cards/card-actor';
import { CombatState } from '../../../../backend/combat/combat';
import { State } from 'boardgame.io';

export class CombatHand extends Actor {
  private cards: CardActor[] = [];
  private engine: Engine;

  private selected: number = -1;

  constructor() {
    super({ collisionType: CollisionType.PreventCollision });
  }

  override onInitialize(_engine: Engine) {
    this.engine = _engine;
  }

  public updateState(state: State<CombatState>) {
    for (let i = this.cards.length; i < state.G.playerState.deckState.hand.length; i++) {
      const card = state.G.playerState.deckState.hand[i];
      const cardActor = new CardActor(card);

      cardActor.clicked$.subscribe(() => this.select(i));

      this.addChild(cardActor);
      this.cards.push(cardActor);
    }

    for (let i = 0; i < state.G.playerState.deckState.hand.length; i++) {
      this.cards[i].updateCard(state.G.playerState.deckState.hand[i]);
    }

    this.placeCards();
  }

  private placeCards() {
    if (this.cards.length === 0) {
      return;
    }

    const cardWidth = this.cards[0].fullWidth;
    const cardHeight = this.cards[0].fullHeight;

    const posY = this.engine.screen.drawHeight - cardHeight / 2 - 5;

    const horizontalGap = 15;
    const totalWidth = cardWidth * this.cards.length + horizontalGap * (this.cards.length - 1);
    const screenWidth = this.engine.screen.drawWidth ?? 1000;
    const leftMargin = (screenWidth - totalWidth) / 2;

    for (let i = 0; i < this.cards.length; i++) {
      const posX = leftMargin + i * (cardWidth + horizontalGap);

      this.cards[i].pos = vec(posX, posY);
    }
  }

  private select(i: number) {
    if (i >= this.cards.length) {
      return;
    }

    if (this.selected >= 0) {
      this.cards[this.selected].highlight(false);
    }

    if (i < 0) {
      this.selected = -1;
      return;
    }

    this.cards[i].highlight(true);
    this.selected = i;
  }
}
