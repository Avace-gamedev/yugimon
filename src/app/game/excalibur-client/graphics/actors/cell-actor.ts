import { Actor, CollisionType, Color, Engine, vec } from 'excalibur';
import { Observable, Subject } from 'rxjs';

export class CellActor extends Actor {
  get realWidth(): number {
    return this.size;
  }

  get realHeight(): number {
    return this.size;
  }

  get hovered$(): Observable<boolean> {
    return this.hoveredSubject.asObservable();
  }

  get clicked$(): Observable<void> {
    return this.clickedSubject.asObservable();
  }

  private hoveredActor: Actor;
  private highlightedActor: Actor;
  private background: Actor;

  private hoveredSubject: Subject<boolean> = new Subject<boolean>();
  private clickedSubject: Subject<void> = new Subject<void>();

  private hovered: boolean;
  private highlighted: boolean;

  constructor(private size: number) {
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
