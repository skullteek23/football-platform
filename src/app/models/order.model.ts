import { Constants } from "@app/constant/app-constants";
import { OrderMessages } from "@app/constant/app-messages";

export class Order {
  id: string = '';
  amount: number = 0;
  ref: any = {};
  uid: string = '';
  timestamp: number = new Date().getTime();

  totalPrice(count: number, unitPrice: number): number {
    return Number(count) * Number(unitPrice);
  }
}

// export enum BookingSide {
//   white = 0,
//   black = 1
// }

export class Booking {
  id: string = '';
  uid: string = '';
  orderId: string = '';
  groundId: string = '';
  slotId: string = '';
  timestamp: number = new Date().getTime();
  lastUpdated: number = new Date().getTime();
  facilityId: string = '';
  spots: number = 1;
}

export enum TransactionType {
  credit = 'credit',
  debit = 'debit'
}

export class WalletTransaction {
  amount: number = 0;
  type: TransactionType = TransactionType.debit;
  createdOn: number = new Date().getTime();
  orderId: string = '';
  uid: string = '';
  transactionFor: string = ''; // notes for transaction entity

  get _amount(): string {
    if (this.amount !== undefined && this.amount !== null && Number(this.amount) >= 0) {
      return this.type === TransactionType.credit ? Constants.PLUS_SIGN + this.amount : Constants.MINUS_SIGN + this.amount;
    }
    return Constants.NOT_AVAILABLE;
  }

  get _highlightClass(): string {
    return this.type === TransactionType.credit ? 'green-highlight' : 'red-highlight';
  }

  get _description(): string {
    let message = OrderMessages.transaction.debit;
    if (this.type === TransactionType.credit) {
      message = OrderMessages.transaction.credit;
    }
    message += ' ';
    message += this.transactionFor;
    return message;
  }
}
