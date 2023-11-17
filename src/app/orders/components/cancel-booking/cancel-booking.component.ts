import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Constants, OrderMessages } from '@ballzo-ui/core/common';
import { CancellationPolicyComponent } from '@app/legal-info/cancellation-policy/cancellation-policy.component';
import { BottomSheetService } from '@app/services/bottom-sheet.service';
import { OrderService } from '@app/services/order.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import { getCloudFnErrorMsg } from '@ballzo-ui/core/utils';

@Component({
  selector: 'app-cancel-booking',
  templateUrl: './cancel-booking.component.html',
  styleUrls: ['./cancel-booking.component.scss']
})
export class CancelBookingComponent implements OnInit {

  readonly reasonsList = Constants.BOOKING_CANCELLATION_REASONS
  readonly placeholder = Constants.REASON_PLACEHOLDER;
  readonly note = OrderMessages.booking.cancelNote;

  isLoaderShown = false;
  reason = '';
  btnDetails = new ButtonConfig();


  constructor(
    private sheetService: BottomSheetService,
    private orderService: OrderService,
    private snackbarService: SnackbarService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public orderID: string
  ) { }

  ngOnInit(): void {
    this.btnDetails.label = 'Cancel Booking';
    this.btnDetails.type = 'submit';
  }

  /**
  * Closes sheet
  */
  canDeactivate() {
    this.sheetService.closeSheet();
  }

  /**
   * Triggered on click of cancel booking button
   */
  cancelBooking() {
    if (this.reason !== '' && this.reasonsList.includes(this.reason)) {
      this.showLoader();
      this.orderService.cancelBooking(this.orderID, this.reason)
        .then(() => {
          this.reason = '';
          this.snackbarService.displayCustomMsg(OrderMessages.success.cancel);
          this.hideLoader();
          this.canDeactivate();
        })
        .catch((error) => {
          this.snackbarService.displayError(getCloudFnErrorMsg(error));
          this.hideLoader();
          this.reason = '';
        })
    } else {
      console.log('Invalid reason!');
    }
  }

  /**
  * Shows loader
  */
  showLoader() {
    this.isLoaderShown = true;
  }

  /**
   * Hides loader
   */
  hideLoader() {
    this.isLoaderShown = false;
  }

  /**
   * Open another sheet to display cancellation policy
   */
  readCancelPolicy() {
    this.sheetService.openSheet(CancellationPolicyComponent)
  }

}
