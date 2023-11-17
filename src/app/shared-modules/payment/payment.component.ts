import { Component, OnInit, Output } from '@angular/core';
import { ButtonConfig, ButtonTheme } from '../buttons/models/button.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  @Output() continueEvent = new Subject<boolean>();

  readonly ButtonTheme = ButtonTheme;

  btnDetails = new ButtonConfig();

  constructor() { }

  ngOnInit(): void {
    this.btnDetails.label = 'Success';
  }

  /**
   * Continue with success
   */
  continue() {
    this.continueEvent.next(true);
  }
}
