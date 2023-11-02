import { CurrencyPipe, DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Constants } from '@ballzo-ui/core/common';
import { Order } from '@app/models/order.model';
import { TransactionItemData } from '@app/shared-modules/transaction-item/models/transaction-item.model';
import { ArraySorting } from '@app/utils/array-sorting-utility';

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
  parseOrderList(orders: Order[]): TransactionItemData[] {
    const list: TransactionItemData[] = [];
    if (orders?.length) {
      orders.sort(ArraySorting.sortObjectByKey('timestamp', 'desc'));
      orders.forEach(order => {
        const data = new TransactionItemData();
        const amount = this.currencyPipe.transform(order.amount, 'INR', 'symbol', Constants.NUMBER_FORMATS.format_1);
        const date = this.datePipe.transform(order.timestamp, Constants.DATE_TIME_FORMATS.format_2);
        data.id = order.id;
        data.label = Constants.ORDER_PREFIX_UI + order.id;
        data.routeLink = '/m/user/orders/view/' + order.id;
        if (amount) {
          data.viewValue = amount;
        }
        if (date) {
          data.subLabel = date
        }
        data.highlightedCustomData = order.status;
        list.push(data);
      })
    }
    return list;
  }
}
