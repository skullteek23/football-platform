import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { SessionStorageProperties } from '@app/constant/constants';
import { MatchBookingService } from '@app/match-booking/services/match-booking.service';
import { SessionStorageService } from '@app/services/session-storage.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { getCloudFnErrorMsg } from '@app/utils/api-error-handling-utility';

@Component({
  selector: 'app-booking-payment',
  templateUrl: './booking-payment.component.html',
  styleUrls: ['./booking-payment.component.scss']
})
export class BookingPaymentComponent implements OnInit {

  isLoaderShown = false;

  constructor(
    private matchBookingService: MatchBookingService,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private router: Router,
    private sessionStorage: SessionStorageService
  ) { }

  ngOnInit(): void {
    if (this.sessionStorage.get(SessionStorageProperties.USER_GROUND_SELECTION)) {
      this.continue();
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Continue with success/failure
   */
  continue() {
    this.showLoader();
    this.authService._user().subscribe(async user => {
      if (user?.uid) {
        this.matchBookingService.onPayment()
          .then((response) => {
            if (response?.data) {
              this.sessionStorage.remove(SessionStorageProperties.USER_GROUND_SELECTION);
              this.sessionStorage.remove(SessionStorageProperties.USER_POSITION_SELECTION);
              this.router.navigate(['/m', 'finish'], { queryParams: { oid: response.data } });
            }
            this.hideLoader();
          })
          .catch(error => {
            this.router.navigate(['/m', 'error']);
            if (error) {
              this.snackbarService.displayError(getCloudFnErrorMsg(error));
            }
            this.hideLoader();
          });
      } else {
        this.hideLoader();
      }
    })
  }

  /**
 * Hide loader
 */
  hideLoader() {
    this.isLoaderShown = false;
  }

  /**
   * Show loader
   */
  showLoader() {
    this.isLoaderShown = true;
  }

}
