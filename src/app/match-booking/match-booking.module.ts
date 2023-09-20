import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchBookingComponent } from './match-booking.component';
import { RouterModule, Routes } from '@angular/router';
import { GroundSelectionComponent } from '@app/shared-modules/ground-selection/ground-selection.component';
import { PaymentComponent } from '@app/shared-modules/payment/payment.component';
import { GroundSelectionModule } from '@app/shared-modules/ground-selection/ground-selection.module';
import { PaymentModule } from '@app/shared-modules/payment/payment.module';

const routes: Routes = [
  {
    path: '',
    component: MatchBookingComponent,
    children: [
      { path: 'select-ground', component: GroundSelectionComponent },
      { path: 'payment', component: PaymentComponent },
    ],
  },
];

@NgModule({
  declarations: [MatchBookingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GroundSelectionModule,
    PaymentModule,
  ],
})
export class MatchBookingModule {}
