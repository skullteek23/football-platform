import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroundsNearMeComponent } from './grounds-near-me.component';
import { RouterModule } from '@angular/router';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';
import { InteractiveCardModule } from '@app/shared-modules/interactive-card/interactive-card.module';
import { GroundInfoComponent } from './components/ground-info/ground-info.component';
import { PlaceholderModule } from '@app/shared-modules/placeholder/placeholder.module';

@NgModule({
  declarations: [GroundsNearMeComponent, GroundInfoComponent],
  imports: [
    CommonModule,
    ButtonsModule,
    InteractiveCardModule,
    PlaceholderModule,
    RouterModule.forChild([{ path: '', component: GroundsNearMeComponent }]),
  ],
})
export class GroundsNearMeModule { }
