import { Injectable } from '@angular/core';
import { PlayerListItem } from '../models/player-list.model';
import { Booking } from '@ballzo-ui/core/transaction';
import { Player } from '@ballzo-ui/core/user';
import { OrderService } from '@app/services/order.service';
import { UserService } from '@app/services/user.service';
import { Observable } from 'rxjs';
import { Constants } from '@ballzo-ui/core/common';
import { ArraySorting } from '@app/utils/array-sorting-utility';

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
    bookings.forEach(booking => {
      const user = users.find((user: Player) => user.id === booking?.uid);
      if (user) {
        if (booking && booking.spots === 1) {
          list.push(this.getListItem(user?.name, user?.position, user?.id));
        } else if (booking && booking.spots > 1) {
          while (booking.spots > 0) {
            if (booking.spots === 1) {
              list.push(this.getListItem(user?.name, user?.position, user?.id));
            } else {
              list.push(this.getListItem(this.getCustomName(user?.name, booking.spots - 1), user?.position, user?.id));
            }
            booking.spots--;
          }
        }
      } else {
        list.push(this.getListItem(Constants.DELETED_USER_PLACEHOLDER, Constants.NOT_AVAILABLE, ''));
      }
    });
    list.sort(ArraySorting.sortObjectByKey('name'));
    if (list.length < maxPlayers) {
      for (let i = list.length; i < maxPlayers; i++) {
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
