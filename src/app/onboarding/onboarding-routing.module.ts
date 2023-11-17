import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingComponent } from './onboarding.component';
import { PositionSelectionComponent } from '@app/position-selection/position-selection.component';
import { OnboardingGroundSelectComponent } from './components/onboarding-ground-select/onboarding-ground-select.component';
import { OnboardingPaymentComponent } from './components/onboarding-payment/onboarding-payment.component';
import { SuccessComponent } from '@app/shared-modules/payment/components/success/success.component';
import { FailureComponent } from '@app/shared-modules/payment/components/failure/failure.component';

const routes: Routes = [
  {
    path: '',
    component: OnboardingComponent,
    children: [
      { path: '', redirectTo: 'select-position', pathMatch: 'full' },
      {
        path: 'select-position',
        component: PositionSelectionComponent,
      },
      { path: 'select-ground', component: OnboardingGroundSelectComponent, },
      { path: 'pay', component: OnboardingPaymentComponent },
      { path: 'finish', component: SuccessComponent },
      { path: 'error', component: FailureComponent, pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingRoutingModule { }
