import { Actor, CollisionType, Engine, vec } from 'excalibur';
import { CardActor } from './card-actor';
import { CombatState } from '../../../../../backend/combat/combat';
import { State } from 'boardgame.io';
import { Card } from '../../../../../backend/deck/card';

export class HandActor extends Actor {
  get realWidth(): number {
    return this.cardActors.length === 0
      ? 0
      : this.cardActors[0].realWidth * this.cardActors.length + this.horizontalGap * (this.cardActors.length - 1);
  }

  get realHeight(): number {
    return this.cardActors.length === 0 ? 0 : this.cardActors[0].realHeight;
  }

  get selectedCard(): Card {
    if (this.selected < 0) {
      return null;
    }

    return this.cards[this.selected];
  }

  private readonly horizontalGap = 15;

  private cards: Card[];
  private cardActors: CardActor[] = [];
  private engine: Engine;

  private selected: number = -1;

  constructor() {
    super({ collisionType: CollisionType.PreventCollision });
  }

  override onInitialize(_engine: Engine) {
    super.onInitialize(_engine);

    this.engine = _engine;
  }

  public updateState(state: State<CombatState>) {
    this.cards = state.G.playerState.deckState.hand;

    for (let i = this.cardActors.length; i < this.cards.length; i++) {
      const cardActor = new CardActor();

      cardActor.clicked$.subscribe(() => this.select(i));

      this.addChild(cardActor);
      this.cardActors.push(cardActor);
    }

    for (let i = 0; i < this.cards.length; i++) {
      this.cardActors[i].updateCard(state.G.playerState.deckState.hand[i]);
    }

    this.placeCards();
  }

  private placeCards() {
    if (this.cardActors.length === 0) {
      return;
    }

    const cardWidth = this.cardActors[0].realWidth;
    const leftMargin = -this.realWidth / 2;

    for (let i = 0; i < this.cardActors.length; i++) {
      const posX = leftMargin + i * (cardWidth + this.horizontalGap);
      this.cardActors[i].pos = vec(posX, 0);
    }
  }

  private select(i: number) {
    if (i >= this.cardActors.length) {
      return;
    }

    if (this.selected >= 0) {
      this.cardActors[this.selected].highlight(false);
    }

    if (i < 0) {
      this.selected = -1;
      return;
    }

    this.cardActors[i].highlight(true);
    this.selected = i;
  }
}
