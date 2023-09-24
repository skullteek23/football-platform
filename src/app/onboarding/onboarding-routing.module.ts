import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardingComponent } from './onboarding.component';
import { PositionSelectionComponent } from '@app/position-selection/position-selection.component';
import { GroundSelectionComponent } from '@app/shared-modules/ground-selection/ground-selection.component';

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
      { path: 'select-ground', component: GroundSelectionComponent, },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingRoutingModule { }
