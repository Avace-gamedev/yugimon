import { Actor, CollisionType, Color, Text, vec } from 'excalibur';
import { Card, isEntityCard } from '../../../../../backend/deck/card';
import { Observable, Subject } from 'rxjs';

export class CardActor extends Actor {
  public get fullWidth(): number {
    return 75;
  }

  public get fullHeight(): number {
    return 100;
  }

  public get hovered$(): Observable<boolean> {
    return this.hoveredSubject.asObservable();
  }

  public get clicked$(): Observable<void> {
    return this.clickedSubject.asObservable();
  }

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

  constructor(private card: Card = null) {
    super({ collisionType: CollisionType.PreventCollision });

    this.hoveredActor = new Actor({
      width: this.fullWidth + 4,
      height: this.fullHeight + 4,
      pos: vec(0, 0),
      color: Color.LightGray,
      collisionType: CollisionType.PreventCollision,
    });
    this.hoveredActor.graphics.visible = false;
    this.addChild(this.hoveredActor);

    this.highlightedActor = new Actor({
      width: this.fullWidth + 4,
      height: this.fullHeight + 4,
      pos: vec(0, 0),
      color: Color.White,
      collisionType: CollisionType.PreventCollision,
    });
    this.highlightedActor.graphics.visible = false;
    this.addChild(this.highlightedActor);

    this.background = new Actor({
      width: this.fullWidth,
      height: this.fullHeight,
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
    this.addChild(this.nameActor);

    this.costText = new Text({ text: '' });
    this.costActor = new Actor({ collisionType: CollisionType.PreventCollision });
    this.costActor.graphics.use(this.costText);
    this.addChild(this.costActor);

    this.hpText = new Text({ text: '' });
    this.hpActor = new Actor({ collisionType: CollisionType.PreventCollision });
    this.hpActor.graphics.use(this.hpText);
    this.addChild(this.hpActor);

    this.updateCard(card);
  }

  updateCard(card: Card) {
    this.card = card;

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
      this.hpActor.pos = vec(this.fullWidth / 2 - 5, this.fullHeight / 2);
      this.hpActor.graphics.visible = true;
    } else {
      this.hpActor.graphics.visible = false;
    }

    this.nameActor.pos = vec(0, -this.fullHeight / 2 + this.nameText.height + 5);
    this.costActor.pos = vec(-this.fullWidth / 2 + 5, -this.fullHeight / 2 + this.nameText.height + 5);
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
