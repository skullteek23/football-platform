import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchBookingComponent } from './match-booking.component';
import { RouterModule, Routes } from '@angular/router';
import { GroundSelectionComponent } from '@app/shared-modules/ground-selection/ground-selection.component';
import { PaymentComponent } from '@app/payment/payment.component';
import { GroundSelectionModule } from '@app/shared-modules/ground-selection/ground-selection.module';
import { PaymentModule } from '@app/payment/payment.module';

const routes: Routes = [
  {
    path: '',
    component: MatchBookingComponent,
    // children: [
    //   { path: '', redirectTo: 'select-ground', pathMatch: 'full' },
    //   { path: 'select-ground', component: GroundSelectionComponent },
    // ],
  },
];

@NgModule({
  declarations: [MatchBookingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GroundSelectionModule,
  ],
})
export class MatchBookingModule { }
