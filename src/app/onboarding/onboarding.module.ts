import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding.component';
import { PositionSelectionModule } from '@app/position-selection/position-selection.module';
import { GroundSelectionModule } from '@app/shared-modules/ground-selection/ground-selection.module';
import { PaymentModule } from '@app/shared-modules/payment/payment.module';
import { StrikerSvgComponent } from './components/striker-svg/striker-svg.component';
import { ManagerSvgComponent } from './components/manager-svg/manager-svg.component';
import { MidfielderSvgComponent } from './components/midfielder-svg/midfielder-svg.component';
import { DefenderSvgComponent } from './components/defender-svg/defender-svg.component';
import { GoalkeeperSvgComponent } from './components/goalkeeper-svg/goalkeeper-svg.component';

@NgModule({
  declarations: [OnboardingComponent, StrikerSvgComponent, ManagerSvgComponent, MidfielderSvgComponent, DefenderSvgComponent, GoalkeeperSvgComponent],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    PositionSelectionModule,
    GroundSelectionModule,
    PaymentModule,
  ],
})
export class OnboardingModule {}
