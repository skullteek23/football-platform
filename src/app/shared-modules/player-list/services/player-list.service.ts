import { Injectable } from '@angular/core';
import { PlayerListItem } from '../models/player-list.model';
import { Booking } from '@app/models/order.model';
import { Player } from '@app/models/user.model';
import { OrderService } from '@app/services/order.service';
import { UserService } from '@app/services/user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerListService {

  constructor(
    private orderService: OrderService,
    private userService: UserService,
  ) { }

  /**
   * Parses the response
   * @param bookings
   * @param users
   * @returns
   */
  parseResponse(bookings: Booking[], users: Player[], maxPlayers: number): PlayerListItem[] {
    if (!bookings?.length || !users?.length || maxPlayers <= 0) {
      return [];
    }

    const list: PlayerListItem[] = [];
    for (let i = 0; i <= maxPlayers; i++) {
      const booking = bookings[i];
      if (booking && booking.spots === 1) {
        const user = users.find((user: Player) => user.id === booking?.uid);
        list.push(this.getListItem(user?.name, user?.position, user?.id));
      } else if (booking && booking.spots > 1) {
        const user = users.find((user: Player) => user.id === booking?.uid);
        while (booking.spots > 0) {
          if (booking.spots === 1) {
            list.push(this.getListItem(user?.name, user?.position, user?.id));
          } else {
            list.push(this.getListItem(this.getCustomName(user?.name, booking.spots), user?.position, user?.id));
          }
          booking.spots--;
          maxPlayers--;
        }
      } else {
        list.push(this.getListItem('', '', ''));
      }
    }
    return list;
  }

  /**
   * Gets the custom name
   * @param name
   * @param index
   * @returns
   */
  getCustomName(name: string | undefined, index: number): string {
    if (name) {
      return `${name} +${index}`;
    }
    return '';
  }

  /**
   * Adds the list item
   * @param name
   * @param position
   * @param uid
   * @returns
   */
  getListItem(name: any, position: any, uid: any) {
    const item = new PlayerListItem();
    if (name) {
      item.name = name;
    }
    if (position) {
      item.position = position;
    }
    if (uid) {
      item.uid = uid;
    }
    return item;
  }

  /**
   * Gets all the players
   * @returns
   */
  getPlayers(): Observable<Player[]> {
    return this.userService.getUsers();
  }

  /**
   * Gets the booking by slot id
   * @returns
   */
  getBookings(slotId: string): Observable<Booking[]> {
    return this.orderService.getBookingBySlotId(slotId);
  }
}
