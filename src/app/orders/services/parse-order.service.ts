import { CurrencyPipe, DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { TransactionItemData } from '@app/shared-modules/transaction-item/models/transaction-item.model';
import { ArraySorting, OrderRz, Constants } from '@ballzo-ui/core';

@Injectable()
export class ParseOrderService {

  constructor(
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe
  ) { }

  /**
   * Parse order list
   * @param orders
   * @returns
   */
  parseOrderList(orders: OrderRz[]): TransactionItemData[] {
    const list: TransactionItemData[] = [];
    if (orders?.length) {
      orders.sort(ArraySorting.sortObjectByKey('timestamp', 'desc'));
      orders.forEach(order => {
        const data = new TransactionItemData();
        const amount = this.currencyPipe.transform(Number(order._amount), 'INR', 'symbol', Constants.NUMBER_FORMATS.format_1);
        const date = this.datePipe.transform(order._created_at, Constants.DATE_TIME_FORMATS.format_2);
        data.id = order.id;
        data.label = order.id;
        data.routeLink = '/user/orders/view/' + order.id;
        if (amount) {
          data.viewValue = amount;
        }
        if (date) {
          data.subLabel = date
        }
        list.push(data);
      })
    }
    return list;
  }
}
