import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainShellRoutingModule } from './main-shell-routing.module';
import { MainShellComponent } from './main-shell.component';
import { RouterModule } from '@angular/router';
import { FooterModule } from '@app/footer/footer.module';
import { MaterialModule } from '@app/material.module';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';
import { IconSelectionMenuModule } from '@app/shared-modules/icon-selection-menu/icon-selection-menu.module';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';

@NgModule({
  declarations: [MainShellComponent],
  imports: [
    CommonModule,
    MainShellRoutingModule,
    FooterModule,
    MaterialModule,
    RouterModule,
    IconSelectionMenuModule,
    ButtonsModule,
    PlaceholderModule,
  ],
})
export class MainShellModule {}
