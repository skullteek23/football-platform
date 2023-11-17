import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionStorageProperties } from '@app/constant/constants';
import { IUser } from '@app/models/user.model';
import { PaymentService } from '@app/services/payment.service';
import { SessionStorageService } from '@app/services/session-storage.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  private loaderStatus = new Subject<boolean>();

  constructor(
    private sessionStorage: SessionStorageService,
    private router: Router,
    private paymentService: PaymentService,
  ) { }

  /**
   * Continues to the next step
   */
  continue(data: any): void {
    this.sessionStorage.set(SessionStorageProperties.USER_GROUND_SELECTION, data);
    if (data.slotId && data.facilityId) {
      this.router.navigate(['/m', 'onboarding', 'pay']);
    } else {
      console.log('Invalid selection data!');
    }
  }

  /**
   * Called after payment capture
   */
  onPayment(user: IUser) {
    return this.paymentService.onboard(user);
  }

  /**
   * Gets the loader status
   */
  _loaderStatus() {
    return this.loaderStatus.asObservable();
  }

  /**
   * Show loader
   */
  showLoader() {
    this.loaderStatus.next(true);
  }

  /**
   * Hide loader
   */
  hideLoader() {
    this.loaderStatus.next(false);
  }
}
