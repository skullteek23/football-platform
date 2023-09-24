import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PositionSelectionComponent } from './position-selection.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';

@NgModule({
  declarations: [PositionSelectionComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule, ButtonsModule],
  exports: [PositionSelectionComponent],
})
export class PositionSelectionModule {}
