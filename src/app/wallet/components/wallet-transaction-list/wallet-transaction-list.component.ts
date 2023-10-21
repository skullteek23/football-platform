import { Component, Input, OnInit } from '@angular/core';
import { WalletTransaction } from '@app/models/order.model';

@Component({
  selector: 'app-wallet-transaction-list',
  templateUrl: './wallet-transaction-list.component.html',
  styleUrls: ['./wallet-transaction-list.component.scss']
})
export class WalletTransactionListComponent implements OnInit {

  @Input() list: WalletTransaction[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
