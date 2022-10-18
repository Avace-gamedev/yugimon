import { Actor, CollisionType, Engine, vec } from 'excalibur';
import { CombatState } from '../../../../../backend/combat/combat';
import { State } from 'boardgame.io';
import { CombatMap } from '../../../../../backend/map/combat-map';
import { CellActor } from './cell-actor';

export class MapActor extends Actor {
  get realWidth(): number {
    return this.map ? this.map.size * this.cells[0].realWidth + this.gap * (this.map.size - 1) : 0;
  }

  get realHeight(): number {
    return this.map ? this.map.size * this.cells[0].realHeight + this.gap * (this.map.size - 1) : 0;
  }

  get selectedCell(): number {
    return this.selected;
  }

  private map: CombatMap;
  private engine: Engine;

  private cells: CellActor[];
  private selected: number = -1;

  private readonly cellSize = 25;
  private readonly gap = 5;

  constructor() {
    super({ collisionType: CollisionType.PreventCollision });
  }

  override onInitialize(_engine: Engine) {
    this.engine = _engine;
  }

  updateState(state: State<CombatState>) {
    this.map = state.G.map;

    if (!this.cells) {
      this.cells = [];

      for (let i = 0; i < this.map.size * this.map.size; i++) {
        const cell = new CellActor(this.cellSize);

        cell.clicked$.subscribe(() => this.select(i));

        this.addChild(cell);
        this.cells.push(cell);
      }
    }

    this.placeCells();
  }

  private select(i: number) {
    if (i >= this.cells.length) {
      return;
    }

    if (this.selected >= 0) {
      this.cells[this.selected].highlight(false);
    }

    if (i < 0) {
      this.selected = -1;
      return;
    }

    this.cells[i].highlight(true);
    this.selected = i;
  }

  private placeCells() {
    if (this.cells.length === 0) {
      return;
    }

    const cellWidth = this.cells[0].realWidth;
    const cellHeight = this.cells[0].realHeight;
    const leftMargin = -this.realWidth / 2;
    const topMargin = -this.realHeight / 2;

    for (let i = 0; i < this.cells.length; i++) {
      const x = i % this.map.size;
      const y = Math.floor(i / this.map.size);

      this.cells[i].pos = vec(leftMargin + x * (cellWidth + this.gap), topMargin + y * (cellHeight + this.gap));
    }
  }
}
