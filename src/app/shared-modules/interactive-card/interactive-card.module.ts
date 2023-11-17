import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InteractiveCardComponent } from './interactive-card.component';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [InteractiveCardComponent],
  imports: [CommonModule, MatCardModule, MatChipsModule],
  exports: [InteractiveCardComponent],
})
export class InteractiveCardModule {}
