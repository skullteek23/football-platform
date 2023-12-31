import { Injectable } from '@angular/core';
import { CoreApiService } from './core-api.service';
import { Booking, OrderRz, WalletTransaction, convertFirestoreData, convertFirestoreDataArray, convertObjectToFirestoreData } from '@ballzo-ui/core';
import { Observable, map, of } from 'rxjs';
import { cloudFunctionNames } from '@app/utils/constant/api-constants';
import { CancelBookingComponent, ICancellationData } from '@app/orders/components/cancel-booking/cancel-booking.component';
import { MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { BottomSheetService } from './bottom-sheet.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private apiService: CoreApiService,
    private bottomSheetService: BottomSheetService
  ) { }

  /**
   * Save order
   * @param data
   * @param orderID
   * @returns
   */
  saveOrder(data: OrderRz, orderID?: string): Promise<any> {
    return this.apiService.addDocument('orders', convertObjectToFirestoreData(data), orderID);
  }

  /**
   * Gets the order by id
   * @param orderId
   * @returns
   */
  getOrder(orderId: string): Observable<OrderRz> {
    return this.apiService.getDocument('orders', orderId)
      .pipe(
        map(response => convertFirestoreData(response, OrderRz)),
      );
  }

  /**
   * Gets the order by id
   * @param orderId
   * @returns
   */
  getOrdersByUser(uid: string): Observable<OrderRz[]> {
    const query = [];
    query.push(this.apiService.getWhereQuery('uid', '==', uid));
    return this.apiService.queryCollectionSnapshot('orders', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, OrderRz)),
      );
  }

  /**
   * Gets the booking by order id
   * @param orderId
   * @returns
   */
  getBookingByOrderId(orderId: string): Observable<Booking> {
    const query = [];
    query.push(this.apiService.getWhereQuery('orderId', '==', orderId));
    return this.apiService.queryCollection('bookings', query)
      .pipe(
        map(response => convertFirestoreData(response[0], Booking)),
      );
  }

  /**
   * Gets the bookings by slot id
   * @param slotId
   * @returns
   */
  getBookingBySlotId(slotId: string): Observable<Booking[]> {
    const query = [];
    query.push(this.apiService.getWhereQuery('slotId', '==', slotId));
    return this.apiService.queryCollection('bookings', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, Booking)),
      );
  }

  /**
   * Gets the bookings by user id
   * @param userId
   * @returns
   */
  getBookingByUserId(userId: string): Observable<Booking[]> {
    if (!userId) {
      return of([]);
    }
    const query = [];
    query.push(this.apiService.getWhereQuery('uid', '==', userId));
    return this.apiService.queryCollection('bookings', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, Booking)),
      );
  }

  /**
   * Returns the bookings for the next three days
   * @param startTime
   * @param endTime
   * @returns
   */
  getBookingsByRange(startTime: number, endTime: number): Observable<Booking[]> {
    const query = [];
    query.push(this.apiService.getWhereQuery('slotTimestamp', '>=', startTime));
    query.push(this.apiService.getWhereQuery('slotTimestamp', '<=', endTime));
    return this.apiService.queryCollectionSnapshot('bookings', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, Booking)),
      );
  }

  /**
   * Gets the wallet transactions by user id
   * @param userId
   * @returns
   */
  getUserTransactions(userId: string): Observable<WalletTransaction[]> {
    const query = [];
    query.push(this.apiService.getWhereQuery('uid', '==', userId));
    return this.apiService.queryCollection('wallet-transactions', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, WalletTransaction)),
      );
  }

  /**
   * Cancel order by id via cloud function
   * @param orderID
   * @returns
   */
  cancelBooking(orderID: string, bookingID: string, reason: string): Promise<any> {
    if (orderID && bookingID && reason) {
      return this.apiService.callHttpFunction(cloudFunctionNames.returnOrder, { orderID, bookingID, reason });
    }
    return Promise.reject('Invalid parameters!');
  }

  /**
   * Open cancel dialog
   */
  openCancelDialog(orderID: string, bookingID: string) {
    const data: ICancellationData = { orderID, bookingID }
    const config = new MatBottomSheetConfig();
    config.data = data;
    config.disableClose = true;
    config.hasBackdrop = true;
    config.backdropClass = 'sheet-backdrop';
    config.panelClass = 'sheet-custom';
    this.bottomSheetService.openSheet(CancelBookingComponent, config);
  }
}

