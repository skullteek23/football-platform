import { Component, NgZone, OnInit, Output } from '@angular/core';
import { ButtonConfig, ButtonTheme } from '../buttons/models/button.model';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '@app/utils/services/payment.service';
import { SnackbarService } from '@app/utils/services/snackbar.service';
import { CheckoutRz } from "@ballzo-ui/core";
import { UserSlotSelectionInfo } from '../ground-selection/models/ground-selection.model';
import { AuthService } from '@app/authentication/auth.service';
import { IUser } from '@app/utils/models/user.model';
import { getCloudFnErrorMsg } from '@app/utils/main-utilities/api-error-handling-utility';
import { OrderMessages, PaymentMessages } from '@app/utils/constant/common-messages';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  @Output() continueEvent = new Subject<boolean>();

  readonly ButtonTheme = ButtonTheme;

  btnDetails = new ButtonConfig();
  selectionInfo = new UserSlotSelectionInfo();
  isLoaderShown = false;
  user!: IUser;

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private snackbarService: SnackbarService,
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService._user().subscribe(user => {
      if (user?.uid) {
        this.user = user;
        this.btnDetails.label = 'Success';
        const qParams = this.route.snapshot.queryParams;
        if (
          qParams.hasOwnProperty('slot') &&
          qParams.hasOwnProperty('ground') &&
          qParams.hasOwnProperty('facility') &&
          qParams.hasOwnProperty('spots') &&
          qParams.hasOwnProperty('amount')
        ) {
          this.selectionInfo = new UserSlotSelectionInfo();
          this.selectionInfo.slot = qParams['slot'];
          this.selectionInfo.ground = qParams['ground'];
          this.selectionInfo.facility = qParams['facility'];
          this.selectionInfo.spots = qParams['spots'];
          this.selectionInfo.amount = qParams['amount'];
          this.showLoader();
          this.initOrder();
        }
      } else {
        this.router.navigate(['/error']);
      }
    })
  }

  /**
   * Initiate order
   */
  async initOrder() {
    this.paymentService.generateOrder(String(this.selectionInfo.amount), this.selectionInfo.slot)
      .then((result) => {
        if (result?.data?.id) {
          const options: Partial<CheckoutRz> = {};
          options.order_id = result.data['id'];
          options.handler = this.verifyPayment.bind(this);
          options.modal = {};
          options.modal.ondismiss = this.dismissDialog.bind(this);
          options.modal.escape = false;
          options.modal.confirm_close = false;
          options.modal.animation = false;
          options.prefill = {};
          options.prefill.name = this.user?.displayName || '';
          options.prefill.email = this.user?.email || '';
          options.prefill.contact = this.user?.phoneNumber || '';
          this.paymentService.openCheckout(options);
        }
      })
      .catch(this.handlePaymentFailure.bind(this));
  }

  /**
   * Dismiss dialog
   * @returns
   */
  dismissDialog() {
    this.ngZone.run(() => {
      if (this.selectionInfo.slot) {
        this.hideLoader();
        this.router.navigate(['/games', 'discover'], { queryParams: { slot: this.selectionInfo.slot } });
      }
    });
    return 0;
  }

  /**
   * Verify payment
   * @param response
   * @returns
   */
  verifyPayment(response: any): Promise<any> {
    return this.ngZone.run(() => {
      const orderID = response['razorpay_order_id'];
      return this.paymentService.verifyPayment(response)
        .then((result) => {
          if (result) {
            this.paymentService.book(this.selectionInfo, orderID)
              .then(() => {
                this.hideLoader();
                this.router.navigate(['/payment', 'success'], { queryParams: { oid: orderID } });
              })
              .catch(this.handlePaymentFailure.bind(this));
          } else {
            this.redirectToFailure(PaymentMessages.error.verificationFailed);
          }
        })
        .catch(this.handlePaymentFailure.bind(this));
    })
  }

  /**
   * Handle payment failure
   * @param error
   */
  handlePaymentFailure(error: any) {
    this.redirectToFailure(getCloudFnErrorMsg(error));
  }

  /**
   * Redirect to failure
   * @param message
  */
  redirectToFailure(message: string): void {
    this.hideLoader();
    this.router.navigate(['/payment', 'failure'], { queryParams: { slot: this.selectionInfo.slot, message } });
  }

  /**
   * Show loader
   */
  showLoader() {
    this.isLoaderShown = true;
  }

  /**
   * Hide loader
   */
  hideLoader() {
    this.isLoaderShown = false;
  }

  /**
   * Continue with success
   */
  continue() {
    this.continueEvent.next(true);
  }
}
