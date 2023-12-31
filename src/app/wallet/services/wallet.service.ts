import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Constants } from '@ballzo-ui/core';
import { WalletTransaction } from '@ballzo-ui/core';
import { TransactionItemData } from '@app/shared-modules/transaction-item/models/transaction-item.model';
import { ArraySorting } from '@ballzo-ui/core';

@Injectable()
export class WalletService {

  constructor(
    private datePipe: DatePipe
  ) { }

  /**
   * Parse transaction list
   * @param transactions
   * @returns
   */
  parseTransactionList(transactionsList: WalletTransaction[]): TransactionItemData[] {
    const list: TransactionItemData[] = [];
    if (transactionsList?.length) {
      const transactions = transactionsList.sort(ArraySorting.sortObjectByKey('createdOn', 'desc'));
      transactions.forEach(transaction => {
        const data = new TransactionItemData();
        const amount = transaction._amount;
        const date = this.datePipe.transform(transaction.createdOn, Constants.DATE_TIME_FORMATS.format_4);
        data.id = transaction.orderId;
        data.label = transaction._description;
        data.routeLink = '/user/orders/view/' + transaction.orderId;
        data.viewValueClass = transaction._highlightClass;
        if (amount) {
          data.viewValue = amount;
        }
        if (date) {
          data.subLabel = date;
        }
        list.push(data);
      })
    }
    return list;
  }
}
