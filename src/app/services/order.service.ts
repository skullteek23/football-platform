import { Injectable } from '@angular/core';
import { CoreApiService } from './core-api.service';
import { Order, WalletTransaction } from '@app/models/order.model';
import { Booking } from '@ballzo-ui/core/transaction';
import { convertFirestoreData, convertFirestoreDataArray, convertObjectToFirestoreData } from '@app/utils/objects-utility';
import { Constants } from '@ballzo-ui/core/common';
import { Observable, map, tap } from 'rxjs';
import { UserSlotSelectionInfo } from '@app/shared-modules/ground-selection/models/ground-selection.model';
import { cloudFunctionNames } from '@app/constant/api-constants';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private apiService: CoreApiService
  ) { }

  /**
   * Generates the order id
   * @param tempID
   * @returns
   */
  generateOID(tempID: string): string {
    if (tempID && !tempID.startsWith(Constants.ORDER_PREFIX)) {
      return `${Constants.ORDER_PREFIX}${tempID.toUpperCase()}`;
    } else if (tempID) {
      return tempID.toUpperCase();
    }
    return '';
  }

  /**
   * Save order
   * @param data
   * @param orderID
   * @returns
   */
  saveOrder(data: Order, orderID?: string): Promise<any> {
    return this.apiService.addDocument('orders', convertObjectToFirestoreData(data), orderID);
  }

  /**
   * Gets the order by id
   * @param orderId
   * @returns
   */
  getOrder(orderId: string): Observable<Order> {
    return this.apiService.getDocument('orders', this.generateOID(orderId))
      .pipe(
        map(response => convertFirestoreData(response, Order)),
      );
  }

  /**
   * Gets the order by id
   * @param orderId
   * @returns
   */
  getOrdersByUser(uid: string): Observable<Order[]> {
    const query = [];
    query.push(this.apiService.getWhereQuery('uid', '==', uid));
    return this.apiService.queryCollectionSnapshot('orders', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, Order)),
      );
  }

  /**
   * Gets the booking by order id
   * @param orderId
   * @returns
   */
  getBookingByOrderId(orderId: string): Observable<Booking> {
    const query = [];
    query.push(this.apiService.getWhereQuery('orderIds', 'array-contains', orderId));
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
    const query = [];
    query.push(this.apiService.getWhereQuery('uid', '==', userId));
    return this.apiService.queryCollection('bookings', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, Booking)),
      );
  }

  /**
   * Returns booking if same booking exists for the user for a slot
   * @param data
   * @param uid
   * @returns
   */
  getExistingBookingForUser(data: UserSlotSelectionInfo, uid: string): Observable<Booking> {
    const query = [];
    query.push(this.apiService.getWhereQuery('uid', '==', uid));
    query.push(this.apiService.getWhereQuery('slotId', '==', data.slotId));
    return this.apiService.queryCollectionSnapshot('bookings', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, Booking)),
        map(resp => resp?.length ? resp[0] : new Booking())
      )
  }

  /**
   * Add booking
   * @param data
   * @returns
   */
  addBooking(data: Booking): Promise<any> {
    return this.apiService.addDocument('bookings', convertObjectToFirestoreData(data));
  }

  /**
   * Updates existing booking
   * @param data
   * @param uid
   * @returns
   */
  updateBooking(data: Partial<Booking> | Booking, docId: string) {
    return this.apiService.updateDocument('bookings', data, docId);
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
  cancelBooking(orderID: string, reason: string): Promise<any> {
    return this.apiService.callHttpFunction(cloudFunctionNames.returnOrder, { orderID, reason });
  }
}

