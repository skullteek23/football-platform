import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { FooterModule } from '../footer/footer.module';
import { MaterialModule } from '../material.module';
import { RouterModule } from '@angular/router';
import { IconSelectionMenuModule } from '@app/shared-modules/icon-selection-menu/icon-selection-menu.module';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';

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
  ],
})
export class HomeModule {}
