import { Component, OnInit } from '@angular/core';
import { DisplayMode, Engine } from 'excalibur';
import { CombatBuilder } from '../../../backend/combat/combat-builder';
import { Character } from '../../../backend/character/character';
import { Client } from 'boardgame.io/client';
import { CombatScene } from './graphics/combat-scene';
import { EntityCard } from '../../../backend/deck/card';

@Component({
  selector: 'app-excalibur-client',
  templateUrl: './excalibur-client.component.html',
  styleUrls: ['./excalibur-client.component.scss'],
})
export class ExcaliburClientComponent implements OnInit {
  private engine: Engine;

  constructor() {}

  ngOnInit(): void {
    const client = this.createGame();

    this.engine = new Engine({
      canvasElementId: 'game',
      displayMode: DisplayMode.FillScreen,
    });

    const combat = new CombatScene();
    this.engine.add('combat', combat);

    this.engine.start().then(() => {
      this.engine.goToScene('combat');

      combat.updateState(client.getInitialState());
      client.subscribe(state => combat.updateState(state));
    });
  }

  private createGame() {
    const player: Character = {
      name: 'Player',
      deck: {
        cards: [EntityCard({ name: 'Atticus' }), EntityCard({ name: 'Silas' })],
      },
    };

    const opponent: Character = {
      name: 'Opponent',
      deck: {
        cards: [EntityCard({ name: 'Solanum Tuberosum' }), EntityCard({ name: 'Solanum Lycopersicum' })],
      },
    };

    const game = new CombatBuilder(player, opponent).build();
    const client = Client({ game });
    client.start();

    return client;
  }
}
