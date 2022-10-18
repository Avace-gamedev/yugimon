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
  private hoveredActor: Actor;
  private highlightedActor: Actor;
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

    this.hoveredActor = new Actor({
      width: this.realWidth + 2,
      height: this.realHeight + 2,
      pos: vec(0, 0),
      color: Color.LightGray,
      collisionType: CollisionType.PreventCollision,
    });
    this.hoveredActor.graphics.opacity = 0;
    this.addChild(this.hoveredActor);

    this.highlightedActor = new Actor({
      width: this.realWidth + 2,
      height: this.realHeight + 2,
      pos: vec(0, 0),
      color: Color.White,
      collisionType: CollisionType.PreventCollision,
    });
    this.highlightedActor.graphics.opacity = 0;
    this.addChild(this.highlightedActor);

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
    let hovered: boolean = false;
    let highlighted: boolean = false;
    switch (this.highlightState) {
      case 'light':
        hovered = true;
        break;
      case 'strong':
        highlighted = true;
        break;
    }

    if (hovered || this.hoveredActor.actions.getQueue().getActions().length > 2) {
      this.hoveredActor.actions.clearActions();
    }

    if (highlighted || this.highlightedActor.actions.getQueue().getActions().length > 2) {
      this.highlightedActor.actions.clearActions();
    }

    this.hoveredActor.actions.getQueue().add(new Fade(this.hoveredActor, hovered ? 1 : 0, 200));
    this.highlightedActor.actions.getQueue().add(new Fade(this.highlightedActor, highlighted ? 1 : 0, 200));
  }
}

export type HighlightState = 'none' | 'light' | 'strong';
