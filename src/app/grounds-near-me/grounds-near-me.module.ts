import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroundsNearMeComponent } from './grounds-near-me.component';
import { RouterModule } from '@angular/router';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';
import { InteractiveCardModule } from '@app/shared-modules/interactive-card/interactive-card.module';
import { GroundInfoComponent } from './components/ground-info/ground-info.component';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';
import { LoaderModule } from '@app/shared-modules/loader/loader.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [GroundsNearMeComponent, GroundInfoComponent],
  imports: [
    CommonModule,
    ButtonsModule,
    InteractiveCardModule,
    PlaceholderModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    LoaderModule,
    MatChipsModule,
    RouterModule.forChild([{ path: '', component: GroundsNearMeComponent }]),
  ],
})
export class GroundsNearMeModule { }
