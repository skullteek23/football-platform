import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconSelectionMenuComponent } from './icon-selection-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [IconSelectionMenuComponent],
  imports: [CommonModule, MatIconModule, MatButtonModule],
  exports: [IconSelectionMenuComponent],
})
export class IconSelectionMenuModule {}
