import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/authentication/auth.service';
import { EmailService } from '@app/authentication/email.service';
import { OrderMessages } from '@app/constant/app-messages';
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
  readonly ButtonTheme = ButtonTheme
  data = new ResultBoxData();

  listBtnDetails = new ButtonConfig();
  homeBtnDetails = new ButtonConfig();
  mapsBtnDetails = new ButtonConfig();
  invoiceBtnDetails = new ButtonConfig();

  constructor(
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private emailService: EmailService
  ) { }

  ngOnInit(): void {
    this.data.title = 'Thank you for your booking!';
    this.data.description = 'Get ready to score goals and make memories on the field - see you at the game!'
    this.data.footer = 'Order #OD344595296728';
    this.setBtnDetails();
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
    this.router.navigate(['/main', 'players-list', 'a8s5f8a76s5g76asg']);
  }

  /**
   * Navigates to home screen
  */
  navigateHome() {
    this.router.navigate(['/'])
  }

  /**
   * Open google maps link
   */
  openMaps() {
    window.open('https://maps.app.goo.gl/v5moKmoRro77drsd7', '_blank');
  }

  /**
   * Emails the invoice to the user
   */
  emailInvoice() {
    this.authService._user().subscribe(user => {
      if (user?.email && user?.email.trim()) {
        this.emailService.sendEmail(user.email).subscribe(res => {
          this.snackbarService.displayCustomMsg(OrderMessages.success.invoice);
        })
      } else {
        this.snackbarService.displayError(OrderMessages.error.emailNotRegistered);
      }
    })
  }

}
