export class Order {
  id: string = '';
  amount: number = 0;
  ref: any = {};
  uid: string = '';
  timestamp: number = new Date().getTime();

  getTotalSlotAmount(count: number, unitPrice: number): number {
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
  facilityId: string = '';
  spots: number = 1;
}
