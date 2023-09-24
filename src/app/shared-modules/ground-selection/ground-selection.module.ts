import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroundSelectionComponent } from './ground-selection.component';
import { InteractiveCardModule } from '../interactive-card/interactive-card.module';
import { CurrentSelectionComponent } from './components/current-selection/current-selection.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ButtonsModule } from '../buttons/buttons.module';

@NgModule({
  declarations: [GroundSelectionComponent, CurrentSelectionComponent],
  imports: [
    CommonModule,
    InteractiveCardModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    ButtonsModule,
  ],
  exports: [GroundSelectionComponent],
})
export class GroundSelectionModule {}
