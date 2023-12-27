import { Component, Input, OnInit } from '@angular/core';
import { ButtonTheme, ButtonConfig } from '../buttons/models/button.model';
import { ResultType, ResultBoxData } from '../result-box/models/result-box.model';
import { Router } from '@angular/router';
import { OrderFailureResponse } from './models/order-failure.model';

@Component({
  selector: 'app-order-page-failure',
  templateUrl: './order-page-failure.component.html',
  styleUrls: ['./order-page-failure.component.scss']
})
export class OrderPageFailureComponent implements OnInit {

  @Input() set responseData(value: OrderFailureResponse) {
    this.data.title = 'Uh-Oh! Booking failed.';
    this.data.description = 'Oops, something went wrong. Please try again later.'
    this.data.footer = 'Order ID not available!';

    if (value?.description) {
      this.data.description = value.description;
    }
  }

  readonly ResultType = ResultType;
  readonly ButtonTheme = ButtonTheme;

  data = new ResultBoxData();
  homeBtnDetails = new ButtonConfig();
  tryAgainBtnDetails = new ButtonConfig();


  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setBtnDetails();
  }


  /**
   * Set the button details
   */
  setBtnDetails() {

    this.homeBtnDetails.icon = 'home';
    this.homeBtnDetails.label = 'Go Home';

    this.tryAgainBtnDetails.icon = 'restart_alt';
    this.tryAgainBtnDetails.label = 'Try again';

  }

  /**
   * Shows grounds list for try again
   */
  showGrounds() {
    if (this.responseData?.value) {
      this.router.navigate(['/games', 'discover'], { queryParams: { slot: this.responseData.value } });
    }
  }

  /**
   * Navigates to home screen
   */
  navigateHome() {
    this.router.navigate(['/']);
  }
}
