import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding.component';
import { PositionSelectionModule } from '@app/position-selection/position-selection.module';
import { GroundSelectionModule } from '@app/shared-modules/ground-selection/ground-selection.module';
import { PaymentModule } from '@app/shared-modules/payment/payment.module';

@NgModule({
  declarations: [OnboardingComponent],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    PositionSelectionModule,
    GroundSelectionModule,
    PaymentModule,
  ],
})
export class OnboardingModule {}
