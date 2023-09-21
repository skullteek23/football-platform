import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { FooterModule } from '@app/footer/footer.module';
import { MaterialModule } from '@app/material.module';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';
import { IconSelectionMenuModule } from '@app/shared-modules/icon-selection-menu/icon-selection-menu.module';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';
import { LoaderModule } from '@app/shared-modules/loader/loader.module';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    FooterModule,
    MaterialModule,
    RouterModule,
    IconSelectionMenuModule,
    ButtonsModule,
    PlaceholderModule,
    LoaderModule,
  ],
  exports: [HomeComponent],
})
export class HomeModule {}
