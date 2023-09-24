import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { SuccessComponent } from './components/success/success.component';
import { FailureComponent } from './components/failure/failure.component';
import { RouterModule, Routes } from '@angular/router';
import { PaymentGatewayComponent } from './components/payment-gateway/payment-gateway.component';
import { ResultBoxModule } from '../result-box/result-box.module';
import { ButtonsModule } from '../buttons/buttons.module';
import { FooterModule } from '@app/footer/footer.module';

const routes: Routes = [
  {
    path: '', component: PaymentComponent, children: [
      { path: '', pathMatch: 'full', redirectTo: 'success', component: PaymentGatewayComponent },
      { path: 'success', component: SuccessComponent },
      { path: 'failure', component: FailureComponent },
    ]
  }
]

@NgModule({
  declarations: [PaymentComponent, SuccessComponent, FailureComponent, PaymentGatewayComponent],
  imports: [CommonModule, RouterModule.forChild(routes), ResultBoxModule, ButtonsModule, FooterModule],
})
export class PaymentModule { }
