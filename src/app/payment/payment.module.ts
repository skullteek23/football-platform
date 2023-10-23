import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { SuccessComponent } from './components/success/success.component';
import { FailureComponent } from './components/failure/failure.component';
import { RouterModule, Routes } from '@angular/router';
import { PaymentGatewayComponent } from './components/payment-gateway/payment-gateway.component';
import { ResultBoxModule } from '../shared-modules/result-box/result-box.module';
import { ButtonsModule } from '../shared-modules/buttons/buttons.module';
import { FooterModule } from '@app/footer/footer.module';
import { LoaderModule } from '../shared-modules/loader/loader.module';
import { MatIconModule } from '@angular/material/icon';
import { CancellationPolicyModule } from '@app/legal-info/cancellation-policy/cancellation-policy.module';
import { OrderPageSuccessModule } from '@app/shared-modules/order-page-success/order-page-success.module';
import { OrderPageFailureModule } from '@app/shared-modules/order-page-failure/order-page-failure.module';

const routes: Routes = [
  {
    path: '', component: PaymentComponent,
    children: [
      { path: '', pathMatch: 'full', component: PaymentGatewayComponent },
      { path: 'success', component: SuccessComponent },
      { path: 'success/:oid', component: SuccessComponent },
      { path: 'failure', component: FailureComponent },
    ]
  }
]

@NgModule({
  declarations: [PaymentComponent, SuccessComponent, FailureComponent, PaymentGatewayComponent],
  imports: [CommonModule,
    RouterModule.forChild(routes),
    ResultBoxModule,
    ButtonsModule,
    LoaderModule,
    FooterModule,
    MatIconModule,
    CancellationPolicyModule,
    OrderPageSuccessModule,
    OrderPageFailureModule
  ]
})
export class PaymentModule { }
