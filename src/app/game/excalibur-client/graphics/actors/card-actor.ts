import { Actor, CollisionType, Color, Engine, Text, vec } from 'excalibur';
import { Card, isEntityCard } from '../../../../../backend/deck/card';
import { Observable, Subject } from 'rxjs';

export class CardActor extends Actor {
  get realWidth(): number {
    return 75;
  }

  get realHeight(): number {
    return 100;
  }

  get hovered$(): Observable<boolean> {
    return this.hoveredSubject.asObservable();
  }

  get clicked$(): Observable<void> {
    return this.clickedSubject.asObservable();
  }

  private card: Card;

  private hoveredActor: Actor;
  private highlightedActor: Actor;
  private background: Actor;

  private nameText: Text;
  private nameActor: Actor;

  private costText: Text;
  private costActor: Actor;

  private hpText: Text;
  private hpActor: Actor;

  private hoveredSubject: Subject<boolean> = new Subject<boolean>();
  private clickedSubject: Subject<void> = new Subject<void>();

  private hovered: boolean;
  private highlighted: boolean;

  constructor() {
    super({ collisionType: CollisionType.PreventCollision });
  }

  override onInitialize(_engine: Engine) {
    super.onInitialize(_engine);

    this.hoveredActor = new Actor({
      width: this.realWidth + 4,
      height: this.realHeight + 4,
      pos: vec(0, 0),
      color: Color.LightGray,
      collisionType: CollisionType.PreventCollision,
    });
    this.hoveredActor.graphics.visible = false;
    this.addChild(this.hoveredActor);

    this.highlightedActor = new Actor({
      width: this.realWidth + 4,
      height: this.realHeight + 4,
      pos: vec(0, 0),
      color: Color.White,
      collisionType: CollisionType.PreventCollision,
    });
    this.highlightedActor.graphics.visible = false;
    this.addChild(this.highlightedActor);

    this.background = new Actor({
      width: this.realWidth,
      height: this.realHeight,
      color: Color.Gray,
      collisionType: CollisionType.PreventCollision,
    });
    this.addChild(this.background);

    this.background.on('pointerenter', () => {
      this.hovered = true;
      this.hoveredSubject.next(true);
      this.updateSelectionState();
    });
    this.background.on('pointerleave', () => {
      this.hovered = false;
      this.hoveredSubject.next(false);
      this.updateSelectionState();
    });
    this.background.on('pointerup', () => {
      this.clickedSubject.next(void 0);
    });

    this.nameText = new Text({ text: '' });
    this.nameActor = new Actor({ collisionType: CollisionType.PreventCollision });
    this.nameActor.graphics.use(this.nameText);
    this.nameActor.z = 10;
    this.addChild(this.nameActor);

    this.costText = new Text({ text: '' });
    this.costActor = new Actor({ collisionType: CollisionType.PreventCollision });
    this.costActor.graphics.use(this.costText);
    this.costActor.z = 10;
    this.addChild(this.costActor);

    this.hpText = new Text({ text: '' });
    this.hpActor = new Actor({ collisionType: CollisionType.PreventCollision });
    this.hpActor.graphics.use(this.hpText);
    this.hpActor.z = 10;
    this.addChild(this.hpActor);

    this.updateCard(this.card, true);
  }

  updateCard(card: Card, force: boolean = false) {
    this.card = card;

    if (!this.isInitialized && !force) {
      // update card called right after constructor, we need to wait for onInitialized to be called before
      // using this
      return;
    }

    switch (card?.type) {
      case 'entity':
        this.background.color = Color.Orange;
        break;
      default:
        this.background.color = Color.Gray;
        break;
    }

    this.nameText.text = card?.name ?? '';
    this.costText.text = card?.cost.toString() ?? '';

    if (!!card && isEntityCard(card)) {
      this.hpText.text = card?.hp.toString() ?? '';
      this.hpActor.pos = vec(this.realWidth / 2 - 5, this.realHeight / 2);
      this.hpActor.graphics.visible = true;
    } else {
      this.hpActor.graphics.visible = false;
    }

    this.nameActor.pos = vec(0, -this.realHeight / 2 + this.nameText.height + 5);
    this.costActor.pos = vec(-this.realWidth / 2 + 5, -this.realHeight / 2 + this.nameText.height + 5);
  }

  highlight(b: boolean) {
    this.highlighted = b;

    this.updateSelectionState();
  }

  private updateSelectionState() {
    this.hoveredActor.graphics.visible = this.hovered && !this.highlighted;
    this.highlightedActor.graphics.visible = this.highlighted;
  }
}
