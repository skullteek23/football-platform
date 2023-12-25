import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { EmailService } from '@app/authentication/email.service';
import { OrderMessages, PlayerListMessages } from '@app/utils/constant/common-messages';
import { GroundService } from '@app/utils/services/ground.service';
import { OrderService } from '@app/utils/services/order.service';
import { SnackbarService } from '@app/utils/services/snackbar.service';
import { ButtonTheme, ButtonConfig } from '../buttons/models/button.model';
import { ResultType, ResultBoxData } from '../result-box/models/result-box.model';
import { IUser } from '@app/utils/models/user.model';
import { OrderRz, Booking, Ground, Position, Constants } from '@ballzo-ui/core';

@Component({
  selector: 'app-order-page-success',
  templateUrl: './order-page-success.component.html',
  styleUrls: ['./order-page-success.component.scss']
})
export class OrderPageSuccessComponent implements OnInit {

  @Input() set oid(value: string) {
    if (value) {
      this.orderID = value;
      this.data.title = OrderMessages.booking.thankYou;
      this.data.footer = Constants.ORDER_PREFIX_UI + this.orderID;
      this.data.description = OrderMessages.booking.thankYouNote;
      this.setBtnDetails();
      this.getOrderDetails();
      this.getBookingDetails();
    }
  }
  @Input() allowCancellation = false;

  readonly ResultType = ResultType;
  readonly ButtonTheme = ButtonTheme;
  readonly dateFormat = Constants.DATE_TIME_FORMATS.format_2;
  readonly numberFormat = Constants.NUMBER_FORMATS.format_1;
  readonly messages = OrderMessages;

  data = new ResultBoxData();
  orderID: string = '';
  order!: OrderRz;
  listBtnDetails = new ButtonConfig();
  homeBtnDetails = new ButtonConfig();
  mapsBtnDetails = new ButtonConfig();
  invoiceBtnDetails = new ButtonConfig();
  isPageInit = false;
  booking!: Booking;
  ground!: Ground;
  user!: IUser;
  role: string = Position.striker;
  slotMsg = '';
  isOrderReturned = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private emailService: EmailService,
    private orderService: OrderService,
    private groundService: GroundService
  ) { }

  ngOnInit(): void {
    this.authService._user().subscribe(user => {
      if (user?.uid) {
        this.user = user;
        this.setMessage();
      } else {
        this.router.navigate(['/error']);
      }
    })
  }

  /**
   * Get order details
   */
  getOrderDetails() {
    this.orderService.getOrder(this.orderID).subscribe({
      next: order => {
        if (order) {
          this.order = order;
          this.isOrderReturned = order.notes?.cancelled === true;
          if (this.isOrderReturned) {
            this.data.description = OrderMessages.booking.cancelledOrderNote;
            this.data.title = OrderMessages.booking.cancelledBookingTitle;
          }
        }
        this.isPageInit = true;
      },
      error: err => {
        this.snackbarService.displayError(err);
        this.isPageInit = true;
      }
    })
  }

  /**
   * Get order details
   */
  getBookingDetails() {
    this.orderService.getBookingByOrderId(this.orderID).subscribe({
      next: booking => {
        if (booking) {
          this.booking = booking;
          if (this.booking.groundId) {
            this.getGroundDetails();
          }
        }
        this.setMessage();
        this.isPageInit = true;
      },
      error: err => {
        this.snackbarService.displayError(err);
        this.isPageInit = true;
      }
    })
  }

  /**
   * Set the button details
   */
  setBtnDetails() {
    this.listBtnDetails.icon = 'sports_soccer';
    this.listBtnDetails.label = 'Show Players List';

    this.homeBtnDetails.icon = 'home';
    this.homeBtnDetails.label = 'Go Home';

    this.mapsBtnDetails.icon = 'location_on';
    this.mapsBtnDetails.label = 'Open Ground Location (In Maps)';


    this.invoiceBtnDetails.icon = 'insert_drive_file';
    this.invoiceBtnDetails.label = 'Email Invoice (PDF)';
  }

  /**
   * Shows player's list for the booking
   */
  showList() {
    if (this.booking.slotId && !this.isOrderReturned) {
      this.router.navigate(['/games', 'bookings'], { queryParams: { slot: this.booking.slotId } });
    } else {
      this.snackbarService.displayError(PlayerListMessages.error.noBookings)
    }
  }

  /**
   * Navigates to home screen
  */
  navigateHome() {
    this.router.navigate(['/']);
  }

  /**
   * Open google maps link
   */
  openMaps() {
    if (this.ground.mapLink) {
      window.open(this.ground.mapLink, '_blank');
    }
  }

  /**
   * Gets the ground details
   */
  getGroundDetails() {
    this.groundService.getGround(this.booking.groundId).subscribe(ground => {
      if (ground) {
        this.ground = ground;
      }
    })
  }

  /**
   * Emails the invoice to the user
   */
  emailInvoice() {
    if (this.user && !this.isOrderReturned) {
      if (this.user?.email && this.user?.email.trim()) {
        this.isPageInit = false;
        this.emailService.sendEmail(this.user.email).subscribe(res => {
          this.isPageInit = true;
          this.snackbarService.displayCustomMsg(OrderMessages.success.invoice);
        })
      } else {
        this.snackbarService.displayError(OrderMessages.error.emailNotRegistered);
      }
    }
  }

  /**
   * Open cancellation policy
   */
  openCancellationPolicy() {
    this.router.navigate(['/cancellation-and-refund-policy']);
  }

  /**
   * Sets the message based on the booking type
   */
  setMessage() {
    if (this.booking?.spots > 1) {
      this.slotMsg = 'Note: ' + this.messages.booking.managerSlot;
    } else {
      this.slotMsg = 'Note: ' + this.messages.booking.playerSlot;
    }
  }

  /**
   * Open cancel dialog
   */
  onCancelBooking() {
    if (this.allowCancellation) {
      this.orderService.openCancelDialog(this.orderID, this.order.bookingId);
    }
  }
}
