import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { EmailService } from '@app/authentication/email.service';
import { Constants } from '@app/constant/app-constants';
import { OrderMessages, PlayerListMessages } from '@app/constant/app-messages';
import { Ground } from '@app/models/ground.model';
import { Booking, Order } from '@app/models/order.model';
import { GroundService } from '@app/services/ground.service';
import { OrderService } from '@app/services/order.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { ButtonConfig, ButtonTheme } from '@app/shared-modules/buttons/models/button.model';
import { ResultBoxData, ResultType } from '@app/shared-modules/result-box/models/result-box.model';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  readonly ResultType = ResultType;
  readonly ButtonTheme = ButtonTheme;
  readonly dateFormat = Constants.DATE_TIME_FORMATS.format_2;
  readonly numberFormat = Constants.NUMBER_FORMATS.format_1;

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private emailService: EmailService,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private groundService: GroundService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('oid') && params['oid']) {
        this.orderID = params['oid'];
        this.data.title = OrderMessages.booking.thankYou;
        this.data.footer = Constants.ORDER_PREFIX_UI + this.orderID;
        this.data.description = OrderMessages.booking.thankYouNote;
        this.setBtnDetails();
        this.getOrderDetails();
        this.getBookingDetails();
      }
    });
  }

  /**
   * Get order details
   */
  getOrderDetails() {
    this.orderService.getOrder(this.orderID).subscribe({
      next: order => {
        if (order) {
          this.order = order;
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
          this.getGroundDetails();
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
    if (this.booking.slotId) {
      this.router.navigate(['/main', 'players-list', this.booking.slotId]);
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
    this.authService._user().subscribe(user => {
      if (user?.email && user?.email.trim()) {
        this.isPageInit = false;
        this.emailService.sendEmail(user.email).subscribe(res => {
          this.isPageInit = true;
          this.snackbarService.displayCustomMsg(OrderMessages.success.invoice);
        })
      } else {
        this.snackbarService.displayError(OrderMessages.error.emailNotRegistered);
      }
    })
  }

}
