import { Component, OnInit } from '@angular/core';
import { ButtonConfig, ButtonTheme } from '@app/shared-modules/buttons/models/button.model';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payment-gateway',
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.scss']
})
export class PaymentGatewayComponent implements OnInit {
  readonly ButtonTheme = ButtonTheme;

  btnDetails = new ButtonConfig();
  btnDetailsFail = new ButtonConfig();
  isLoaderShown = false;

  constructor(
    private paymentService: PaymentService,
  ) {
    this.paymentService._loaderStatus().subscribe(response => this.isLoaderShown = response);
  }

  ngOnInit(): void {
    this.btnDetails.label = 'Success';
    this.btnDetailsFail.label = 'Failure';
    this.btnDetailsFail
  }

  continue() {
    this.paymentService.continue();
  }

  continueWithFail() {
    this.paymentService.fail();
  }
}
