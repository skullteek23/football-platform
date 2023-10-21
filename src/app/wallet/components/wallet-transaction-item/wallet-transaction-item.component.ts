import { Component, Input, OnInit } from '@angular/core';
import { Constants } from '@app/constant/app-constants';
import { WalletTransaction } from '@app/models/order.model';

@Component({
  selector: 'app-wallet-transaction-item',
  templateUrl: './wallet-transaction-item.component.html',
  styleUrls: ['./wallet-transaction-item.component.scss']
})
export class WalletTransactionItemComponent implements OnInit {

  readonly CUSTOM_DATE_FORMAT = Constants.DATE_TIME_FORMATS.format_4;

  @Input() item = new WalletTransaction();

  constructor() { }

  ngOnInit(): void {
  }

}
