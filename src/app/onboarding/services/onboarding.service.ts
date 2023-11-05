import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { SessionStorageProperties } from '@app/constant/constants';
import { PaymentService } from '@app/services/payment.service';
import { SessionStorageService } from '@app/services/session-storage.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { getFirestoreErrorMsg } from '@ballzo-ui/core/utils';
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
    private authService: AuthService,
    private snackbarService: SnackbarService,
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
  onPayment() {
    this.authService._user().subscribe(async user => {
      this.paymentService.onboard(user)
        .then((orderId) => {
          if (orderId) {
            this.hideLoader();
            this.sessionStorage.remove(SessionStorageProperties.USER_GROUND_SELECTION);
            this.sessionStorage.remove(SessionStorageProperties.USER_POSITION_SELECTION);
            this.router.navigate(['/m', 'onboarding', 'finish'], { queryParams: { oid: orderId } });
          }
        })
        .catch(error => {
          this.router.navigate(['/m', 'onboarding', 'error']);
          if (error) {
            this.snackbarService.displayError(getFirestoreErrorMsg(error));
          }
        });
    })
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
