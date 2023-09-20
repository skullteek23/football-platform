import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingComponent } from './onboarding.component';
import { PositionSelectionComponent } from '@app/position-selection/position-selection.component';
import { GroundSelectionComponent } from '@app/shared-modules/ground-selection/ground-selection.component';
import { PaymentComponent } from '@app/shared-modules/payment/payment.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardingComponent,
    children: [
      { path: 'select-position', component: PositionSelectionComponent },
      { path: 'select-ground', component: GroundSelectionComponent },
      { path: 'payment', component: PaymentComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingRoutingModule {}
