import { Actor, CollisionType, Color, Engine, Fade, vec } from 'excalibur';
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

  private pointerTarget: Actor;
  private highlightActor: Actor;
  private background: Actor;

  private hoveredSubject: Subject<boolean> = new Subject<boolean>();
  private clickedSubject: Subject<void> = new Subject<void>();

  private highlightState: HighlightState = 'none';

  constructor(private size: number, private gap: number) {
    super({ collisionType: CollisionType.PreventCollision });
  }

  override onInitialize(_engine: Engine) {
    super.onInitialize(_engine);

    this.pointerTarget = new Actor({
      width: this.realWidth + this.gap,
      height: this.realHeight + this.gap,
      color: Color.Transparent,
      collisionType: CollisionType.PreventCollision,
    });
    this.addChild(this.pointerTarget);

    this.pointerTarget.on('pointerenter', () => {
      this.hoveredSubject.next(true);
    });
    this.pointerTarget.on('pointerleave', () => {
      this.hoveredSubject.next(false);
    });
    this.pointerTarget.on('pointerup', () => {
      this.clickedSubject.next(void 0);
    });

    this.highlightActor = new Actor({
      width: this.realWidth + 2,
      height: this.realHeight + 2,
      pos: vec(0, 0),
      color: Color.White,
      collisionType: CollisionType.PreventCollision,
    });
    this.highlightActor.graphics.opacity = 0;
    this.addChild(this.highlightActor);

    this.background = new Actor({
      width: this.realWidth,
      height: this.realHeight,
      color: Color.Gray,
      collisionType: CollisionType.PreventCollision,
    });
    this.addChild(this.background);
  }

  setHighlightState(highlightState: HighlightState) {
    if (this.highlightState === highlightState) {
      return;
    }

    this.highlightState = highlightState;
    this.updateSelectionState();
  }

  private updateSelectionState() {
    let targetOpacity: number = 0;
    switch (this.highlightState) {
      case 'light':
        targetOpacity = 0.5;
        break;
      case 'strong':
        targetOpacity = 1;
        break;
    }

    if (targetOpacity > 0 || this.highlightActor.actions.getQueue().getActions().length > 2) {
      this.highlightActor.actions.clearActions();
    }

    this.highlightActor.actions.getQueue().add(new Fade(this.highlightActor, targetOpacity, 200));
  }
}

export type HighlightState = 'none' | 'light' | 'strong';
