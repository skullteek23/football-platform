import { Component, OnInit } from '@angular/core';
import { ButtonConfig, ButtonTheme } from '@app/shared-modules/buttons/models/button.model';
import { ResultBoxData, ResultType } from '@app/shared-modules/result-box/models/result-box.model';

@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.scss']
})
export class FailureComponent implements OnInit {
  readonly ResultType = ResultType;
  readonly ButtonTheme = ButtonTheme
  data = new ResultBoxData();

  homeBtnDetails = new ButtonConfig();
  mapsBtnDetails = new ButtonConfig();
  invoiceBtnDetails = new ButtonConfig();
  constructor() { }

  ngOnInit(): void {
    this.data.title = 'Uh-Oh! Booking failed.';
    this.data.description = 'Oops, something went wrong. Please try again later.'
    this.data.footer = 'Order ID not available!';
    this.setBtnDetails();
  }


  /**
   * Set the button details
   */
  setBtnDetails() {

    this.homeBtnDetails.icon = 'home';
    this.homeBtnDetails.label = 'Go Home';

    this.mapsBtnDetails.icon = 'location_on';
    this.mapsBtnDetails.label = 'Open Ground Location (In Maps) asjfv jahsvf javjs fvjhk';

    this.invoiceBtnDetails.icon = 'insert_drive_file';
    this.invoiceBtnDetails.label = 'Email Invoice (PDF)';
  }

  /**
   * Shows player's list for the booking
   */
  showList() {

  }

  /**
   * Navigates to home screen
   */
  navigateHome() {

  }

  /**
   * Open google maps link
   */
  openMaps() {

  }

  /**
   * Emails the invoice to the user
   */
  emailInvoice() {

  }

}
