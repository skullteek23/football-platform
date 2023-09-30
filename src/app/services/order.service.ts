import { Injectable } from '@angular/core';
import { CoreApiService } from './core-api.service';
import { Booking, Order } from '@app/models/order.model';
import { convertFirestoreData, convertFirestoreDataArray, convertObjectToFirestoreData } from '@app/utils/objects-utility';
import { Constants } from '@app/constant/app-constants';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private apiService: CoreApiService
  ) { }

  private generateOID(tempID: string): string {
    return `${Constants.ORDER_PREFIX}${tempID.toUpperCase()}`;
  }

  /**
   * Save order
   * @param data
   * @param orderID
   * @returns
   */
  saveOrder(data: Order, orderID?: string): Promise<any> {
    const id = orderID ? this.generateOID(orderID) : '';
    return this.apiService.addDocument('orders', convertObjectToFirestoreData(data), id);
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
    const query = [];
    query.push(this.apiService.getWhereQuery('uid', '==', userId));
    return this.apiService.queryCollection('bookings', query)
      .pipe(
        map(response => convertFirestoreDataArray(response, Booking)),
      );
  }

  /**
   * Add booking
   * @param data
   * @returns
   */
  addBooking(data: Booking): Promise<any> {
    return this.apiService.addDocument('bookings', convertObjectToFirestoreData(data));
  }
}

