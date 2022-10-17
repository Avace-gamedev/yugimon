import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { ExcaliburClientComponent } from './excalibur-client/excalibur-client.component';

@NgModule({
  declarations: [GameComponent, ExcaliburClientComponent],
  imports: [CommonModule, GameRoutingModule],
})
export class GameModule {}
