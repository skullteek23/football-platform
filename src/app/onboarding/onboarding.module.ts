import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding.component';
import { PositionSelectionModule } from '@app/position-selection/position-selection.module';
import { GroundSelectionModule } from '@app/shared-modules/ground-selection/ground-selection.module';
import { OnboardingGroundSelectComponent } from './components/onboarding-ground-select/onboarding-ground-select.component';
import { OnboardingPaymentComponent } from './components/onboarding-payment/onboarding-payment.component';
import { PaymentModule } from '@app/shared-modules/payment/payment.module';
import { LoaderModule } from '@app/shared-modules/loader/loader.module';

@NgModule({
  declarations: [OnboardingComponent, OnboardingGroundSelectComponent, OnboardingPaymentComponent],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    PositionSelectionModule,
    GroundSelectionModule,
    LoaderModule
  ],
})
export class OnboardingModule { }
