import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { EmailService } from '@app/authentication/email.service';
import { Constants } from '@ballzo-ui/core';
import { OrderMessages, PlayerListMessages } from '@app/constant/common-messages';
import { Ground } from '@ballzo-ui/core';
import { Order, OrderStatus } from '@ballzo-ui/core';
import { Booking } from '@ballzo-ui/core';
import { BottomSheetService } from '@app/services/bottom-sheet.service';
import { GroundService } from '@app/services/ground.service';
import { OrderService } from '@app/services/order.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { ButtonTheme, ButtonConfig } from '../buttons/models/button.model';
import { ResultType, ResultBoxData } from '../result-box/models/result-box.model';
import { Position } from '@ballzo-ui/core';
import { IUser } from '@app/models/user.model';

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
  @Input() showCancelEvent = false;

  @Output() cancelEvent = new EventEmitter<void>();

  readonly ResultType = ResultType;
  readonly ButtonTheme = ButtonTheme;
  readonly dateFormat = Constants.DATE_TIME_FORMATS.format_2;
  readonly numberFormat = Constants.NUMBER_FORMATS.format_1;
  readonly messages = OrderMessages;

  data = new ResultBoxData();
  orderID: string = '';
  order!: Order;
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
    private groundService: GroundService,
    private bottomSheetService: BottomSheetService
  ) { }

  ngOnInit(): void {
    this.authService._user().subscribe(user => {
      if (user?.uid) {
        this.user = user;
        this.getRole();
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
          this.isOrderReturned = order.status === OrderStatus.returned;
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
      this.router.navigate(['/m', 'players-list', this.booking.slotId]);
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
   * Get user role
   */
  getRole() {
    if (this.user) {
      this.authService.getCustomClaims(this.user)
        .then(value => {
          this.role = this.authService.parseRole(value);
          if (this.role === Position.manager) {
            this.slotMsg = 'Note: ' + this.messages.booking.managerSlot;
          } else {
            this.slotMsg = 'Note: ' + this.messages.booking.playerSlot;
          }
        })
    }
  }

  /**
   * Emits cancel event
   */
  onCancelBooking() {
    if (this.showCancelEvent) {
      this.cancelEvent.emit();
    }
  }

}
