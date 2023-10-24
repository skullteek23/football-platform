import { Component, OnInit } from '@angular/core';
import { OnboardingService } from '@app/onboarding/services/onboarding.service';
import { PaymentService } from '@app/services/payment.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-onboarding-payment',
  templateUrl: './onboarding-payment.component.html',
  styleUrls: ['./onboarding-payment.component.scss']
})
export class OnboardingPaymentComponent implements OnInit {

  isLoaderShown = false;

  constructor(
    private onboardingService: OnboardingService,
  ) { }

  ngOnInit(): void {
    this.onboardingService._loaderStatus().subscribe(response => this.isLoaderShown = response);
  }

  /**
   * Continue with success/failure
   */
  continue(status: boolean) {
    if (status) {
      this.onboardingService.onPayment();
    }
  }


}
