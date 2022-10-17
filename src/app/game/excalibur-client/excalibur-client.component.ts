import { Component, OnInit } from '@angular/core';
import { DisplayMode, Engine, Scene } from 'excalibur';
import { CombatBuilder } from '../../../backend/combat/combat-builder';
import { Character } from '../../../backend/character/character';
import { Client } from 'boardgame.io/client';
import { CombatGraphics } from './graphics/combat-graphics';
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
    this.engine = new Engine({
      canvasElementId: 'game',
      displayMode: DisplayMode.FillScreen,
    });

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

    const combatScene = new Scene();
    const combat = new CombatGraphics(combatScene);

    const game = new CombatBuilder(player, opponent).build();
    const client = Client({ game });
    client.start();

    combat.initialize(client.getInitialState());

    client.subscribe(state => combat.update(state));

    this.engine.start();
  }
}
