import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NextActionButtonComponent } from './components/next-action-button/next-action-button.component';
import { WideButtonComponent } from './components/wide-button/wide-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CustomChipButtonComponent } from './components/custom-chip-button/custom-chip-button.component';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    WideButtonComponent,
    NextActionButtonComponent,
    CustomChipButtonComponent,
  ],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatChipsModule],
  exports: [
    WideButtonComponent,
    NextActionButtonComponent,
    CustomChipButtonComponent,
  ],
})
export class ButtonsModule {}
