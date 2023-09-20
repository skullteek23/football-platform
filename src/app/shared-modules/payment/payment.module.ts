import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { SuccessComponent } from './components/success/success.component';
import { FailureComponent } from './components/failure/failure.component';

@NgModule({
  declarations: [PaymentComponent, SuccessComponent, FailureComponent],
  imports: [CommonModule],
  exports: [PaymentComponent, SuccessComponent, FailureComponent],
})
export class PaymentModule {}
