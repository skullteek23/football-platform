import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule } from '@angular/router';
import { FooterModule } from '@app/footer/footer.module';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';
import { IconSelectionMenuModule } from '@app/shared-modules/icon-selection-menu/icon-selection-menu.module';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';
import { LoaderModule } from '@app/shared-modules/loader/loader.module';
import { InteractiveCardModule } from '@app/shared-modules/interactive-card/interactive-card.module';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    FooterModule,
    RouterModule,
    IconSelectionMenuModule,
    ButtonsModule,
    PlaceholderModule,
    LoaderModule,
    InteractiveCardModule,
    MatIconModule,
    MatChipsModule,
  ],
  exports: [HomeComponent],
  providers: [DatePipe]
})
export class HomeModule { }
