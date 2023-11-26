import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchBookingComponent } from './match-booking.component';
import { RouterModule, Routes } from '@angular/router';
import { GroundSelectionModule } from '@app/shared-modules/ground-selection/ground-selection.module';
import { BookingGroundSelectionComponent } from './components/booking-ground-selection/booking-ground-selection.component';
import { BookingPaymentComponent } from './components/booking-payment/booking-payment.component';
import { PaymentModule } from '@app/shared-modules/payment/payment.module';
import { LoaderModule } from '@app/shared-modules/loader/loader.module';
import { FailureComponent } from '@app/shared-modules/payment/components/failure/failure.component';
import { SuccessComponent } from '@app/shared-modules/payment/components/success/success.component';

const routes: Routes = [
  {
    path: '',
    component: MatchBookingComponent,
    children: [
      { path: '', redirectTo: 'select-ground', pathMatch: 'full' },
      { path: 'select-ground', component: BookingGroundSelectionComponent },
      { path: 'pay', component: BookingPaymentComponent },
    ],
  },
];

@NgModule({
  declarations: [MatchBookingComponent, BookingGroundSelectionComponent, BookingPaymentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GroundSelectionModule,
    LoaderModule,
  ]
})
export class MatchBookingModule { }
