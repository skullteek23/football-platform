import { Component, OnInit } from '@angular/core';
import { ButtonTheme, ButtonConfig } from '../buttons/models/button.model';
import { ResultType, ResultBoxData } from '../result-box/models/result-box.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-page-failure',
  templateUrl: './order-page-failure.component.html',
  styleUrls: ['./order-page-failure.component.scss']
})
export class OrderPageFailureComponent implements OnInit {
  readonly ResultType = ResultType;
  readonly ButtonTheme = ButtonTheme;

  data = new ResultBoxData();
  homeBtnDetails = new ButtonConfig();
  tryAgainBtnDetails = new ButtonConfig();

  constructor(
    private router: Router
  ) { }

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

    this.tryAgainBtnDetails.icon = 'restart_alt';
    this.tryAgainBtnDetails.label = 'Try again';

  }

  /**
   * Shows grounds list for try again
   */
  showGrounds() {
    this.router.navigate(['/m', 'book-match', 'select-ground']);
  }

  /**
   * Navigates to home screen
   */
  navigateHome() {
    this.router.navigate(['/']);
  }
}
