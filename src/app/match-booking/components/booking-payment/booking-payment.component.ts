import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { SessionStorageProperties } from '@app/constant/constants';
import { MatchBookingService } from '@app/match-booking/services/match-booking.service';
import { SessionStorageService } from '@app/services/session-storage.service';
import { SnackbarService } from '@app/services/snackbar.service';

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
  }

  /**
   * Continue with success/failure
   */
  continue(status: boolean) {
    if (status) {
      this.showLoader();
      this.authService._user().subscribe(async user => {
        if (user) {
          this.matchBookingService.onPayment(user)
            .then((orderId) => {
              if (orderId) {
                this.sessionStorage.remove(SessionStorageProperties.USER_GROUND_SELECTION);
                this.sessionStorage.remove(SessionStorageProperties.USER_POSITION_SELECTION);
                this.router.navigate(['/m', 'book-match', 'finish'], { queryParams: { oid: orderId } });
              }
              this.hideLoader();
            })
            .catch(error => {
              this.router.navigate(['/m', 'book-match', 'error']);
              if (error) {
                this.snackbarService.displayError(error);
              }
              this.hideLoader();
            });
        } else {
          this.hideLoader();
        }
      })
    }
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
