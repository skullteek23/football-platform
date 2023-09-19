import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NextActionButtonComponent } from './components/next-action-button/next-action-button.component';
import { WideButtonComponent } from './components/wide-button/wide-button.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [WideButtonComponent, NextActionButtonComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  exports: [WideButtonComponent, NextActionButtonComponent],
})
export class ButtonsModule {}
