import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/authentication/auth.service';
import { PaymentMessages } from '@ballzo-ui/core/common';
import { IUser } from '@app/models/user.model';
import { WalletTransaction } from '@app/models/order.model';
import { TransactionType } from '@ballzo-ui/core/transaction';
import { OrderService } from '@app/services/order.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { UserService } from '@app/services/user.service';
import { getFirestoreErrorMsg } from '@app/utils/api-error-handling-utility';
import { WalletService } from './services/wallet.service';
import { TransactionItemData } from '@app/shared-modules/transaction-item/models/transaction-item.model';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {

  readonly messages = PaymentMessages;

  balance = 0;
  transactionsList: WalletTransaction[] = [];
  transactionsListForUi: TransactionItemData[] = [];
  user!: IUser;
  isTransactionsInit = false;
  isBalanceInit = false;
  creditTxnList: WalletTransaction[] = [];
  debitTxnList: WalletTransaction[] = [];

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private snackbarService: SnackbarService,
    private orderService: OrderService,
    private walletService: WalletService
  ) { }

  ngOnInit(): void {
    this.authService._user().subscribe((user) => {
      if (user?.uid) {
        this.user = user;
        this.getWalletBalance();
        this.getTransactionsList();
      }
    });
  }

  /**
   * Get wallet balance
   */
  getWalletBalance() {
    if (this.user) {
      this.userService.getUserWalletBalance(this.user.uid).subscribe({
        next: (response) => {
          this.balance = Number(response?.amount);
          this.isBalanceInit = true;
        },
        error: (err) => {
          this.balance = 0;
          this.isBalanceInit = true;
          this.snackbarService.displayError(getFirestoreErrorMsg(err));
        }
      });
    }
  }

  /**
   * Get transactions list
   */
  getTransactionsList() {
    if (this.user) {
      this.orderService.getUserTransactions(this.user.uid).subscribe({
        next: (response) => {
          // sort transactions by latest first
          this.transactionsList = response;
          this.creditTxnList = [];
          this.debitTxnList = [];
          this.transactionsList.forEach((txn) => {
            if (txn.type === TransactionType.credit) {
              this.creditTxnList.push(txn);
            } else if (txn.type === TransactionType.debit) {
              this.debitTxnList.push(txn);
            }
          })
          this.isTransactionsInit = true;
        },
        error: (err) => {
          this.isTransactionsInit = true;
          this.transactionsList = [];
          this.creditTxnList = [];
          this.debitTxnList = [];
          this.snackbarService.displayError(getFirestoreErrorMsg(err));
        }
      })
    }
  }

}
