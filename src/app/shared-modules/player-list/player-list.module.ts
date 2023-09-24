import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerListComponent } from './player-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DirectivesModule } from '../directives/directives.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';



@NgModule({
  declarations: [PlayerListComponent],
  imports: [
    CommonModule,
    MatButtonModule, MatIconModule, DirectivesModule, MatChipsModule, MatDividerModule
  ],
  exports: [PlayerListComponent]
})
export class PlayerListModule { }
