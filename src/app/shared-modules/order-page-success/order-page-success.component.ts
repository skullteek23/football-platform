import { Component, Input, OnInit } from '@angular/core';
import { MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { EmailService } from '@app/authentication/email.service';
import { Constants } from '@app/constant/app-constants';
import { OrderMessages, PlayerListMessages } from '@app/constant/app-messages';
import { CancellationPolicyComponent } from '@app/legal-info/cancellation-policy/cancellation-policy.component';
import { IUser } from '@app/models/common.model';
import { Ground } from '@app/models/ground.model';
import { Order, Booking } from '@app/models/order.model';
import { BottomSheetService } from '@app/services/bottom-sheet.service';
import { GroundService } from '@app/services/ground.service';
import { OrderService } from '@app/services/order.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { ButtonTheme, ButtonConfig } from '../buttons/models/button.model';
import { ResultType, ResultBoxData } from '../result-box/models/result-box.model';
import { Position } from '@app/models/user.model';

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
    if (this.booking.slotId) {
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
    if (this.user) {
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
    const config = new MatBottomSheetConfig();
    config.disableClose = false;
    config.hasBackdrop = true;
    config.backdropClass = 'sheet-backdrop';
    config.panelClass = 'sheet-custom';
    this.bottomSheetService.openSheet(CancellationPolicyComponent, config);
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

}
