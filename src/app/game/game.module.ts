import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { GameComponent } from './game.component';
import { ExcaliburClientComponent } from './excalibur-client/excalibur-client.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [GameComponent, ExcaliburClientComponent],
  imports: [CommonModule, GameRoutingModule, MatCheckboxModule, MatButtonModule],
})
export class GameModule {}
