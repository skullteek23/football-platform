import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlotPaymentComponent } from './slot-payment.component';
import { Route, RouterModule } from '@angular/router';
import { PaymentModule } from '@app/shared-modules/payment/payment.module';
import { PaymentComponent } from '@app/shared-modules/payment/payment.component';
import { SuccessComponent } from '@app/shared-modules/payment/components/success/success.component';
import { FailureComponent } from '@app/shared-modules/payment/components/failure/failure.component';

const routes: Route[] = [
  {
    path: '',
    component: SlotPaymentComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: PaymentComponent
      },
      { path: 'success', component: SuccessComponent },
      { path: 'failure', component: FailureComponent },
    ]
  },
];

@NgModule({
  declarations: [
    SlotPaymentComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PaymentModule
  ]
})
export class SlotPaymentModule { }
