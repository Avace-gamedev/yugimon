import { Component, OnInit } from '@angular/core';
import { DisplayMode, Engine } from 'excalibur';

@Component({
  selector: 'app-excalibur-client',
  templateUrl: './excalibur-client.component.html',
  styleUrls: ['./excalibur-client.component.scss'],
})
export class ExcaliburClientComponent implements OnInit {
  private engine: Engine;

  constructor() {}

  ngOnInit(): void {
    this.engine = new Engine({
      canvasElementId: 'game',
      displayMode: DisplayMode.FillScreen,
    });

    this.engine.start();
  }
}
