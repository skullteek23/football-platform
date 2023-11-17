import { Component, Input, OnInit } from '@angular/core';
import { WalletTransaction } from '@app/models/order.model';
import { TransactionItemData } from '@app/shared-modules/transaction-item/models/transaction-item.model';
import { WalletService } from '@app/wallet/services/wallet.service';

@Component({
  selector: 'app-wallet-transaction-list',
  templateUrl: './wallet-transaction-list.component.html',
  styleUrls: ['./wallet-transaction-list.component.scss']
})
export class WalletTransactionListComponent implements OnInit {

  @Input() set list(value: WalletTransaction[]) {
    this.transactionsListForUi = this.walletService.parseTransactionList(value);
  }

  transactionsListForUi: TransactionItemData[] = [];

  constructor(
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
  }

}
