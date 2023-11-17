import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { ResultBoxModule } from '../result-box/result-box.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { FooterModule } from '@app/footer/footer.module';
import { LoaderModule } from '../loader/loader.module';
import { MatIconModule } from '@angular/material/icon';
import { CancellationPolicyModule } from '@app/legal-info/cancellation-policy/cancellation-policy.module';
import { OrderPageSuccessModule } from '@app/shared-modules/order-page-success/order-page-success.module';
import { OrderPageFailureModule } from '@app/shared-modules/order-page-failure/order-page-failure.module';
import { SuccessComponent } from './components/success/success.component';
import { FailureComponent } from './components/failure/failure.component';

@NgModule({
  declarations: [PaymentComponent, SuccessComponent, FailureComponent],
  imports: [
    CommonModule,
    ResultBoxModule,
    ButtonsModule,
    LoaderModule,
    FooterModule,
    MatIconModule,
    CancellationPolicyModule,
    OrderPageSuccessModule,
    OrderPageFailureModule
  ],
  exports: [
    PaymentComponent,
    SuccessComponent,
    FailureComponent
  ]
})
export class PaymentModule { }
