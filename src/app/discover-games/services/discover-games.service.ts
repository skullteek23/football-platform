import { Injectable } from '@angular/core';
import { DiscoverGameSlot } from '../models/discover-game.model';
import {
  GroundSlot,
  Ground,
  GroundFacility,
  Player,
  ArraySorting,
  Booking,
  Constants
} from "@ballzo-ui/core";
import { MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { BottomSheetService } from '@app/utils/services/bottom-sheet.service';
import { GroundInfoComponent } from '@app/grounds-near-me/components/ground-info/ground-info.component';
import { Router } from '@angular/router';
import { UserSlotSelectionInfo } from '@app/shared-modules/ground-selection/models/ground-selection.model';

@Injectable({
  providedIn: 'root'
})
export class DiscoverGamesService {

  constructor(
    private sheetService: BottomSheetService,
    private router: Router
  ) { }

  /**
   * Parses the data
   * @param response
   * @returns
   */
  parseData(response: any[]): DiscoverGameSlot[] {
    const data: DiscoverGameSlot[] = [];

    const slots: GroundSlot[] = response[0] || [];
    const grounds: Ground[] = response[1] || [];
    const facilities: GroundFacility[] = response[2] || [];
    const players: Player[] = response[3] || [];
    const bookings: Booking[] = response[4] || [];

    slots.forEach((slot) => {
      const gameSlot = new DiscoverGameSlot();
      gameSlot.slotId = slot.id;
      gameSlot.groundId = slot.groundId;
      gameSlot.facilityId = slot.facilityId;
      gameSlot.timestamp = slot.timestamp;
      gameSlot.availableSpots = slot.availableSpot;
      gameSlot.price = slot.price;

      const facility = facilities.find((facility) => facility.id === slot.facilityId);
      if (facility) {
        gameSlot.facilityName = facility.name;
      }

      const ground = grounds.find((ground) => ground.id === slot.groundId);
      if (ground) {
        gameSlot.groundName = ground.name;
      }

      const slotBookings = bookings.filter((booking) => booking.slotId === slot.id);
      const list = this.createPlayerList(slotBookings, players, slot.allowedCount);
      if (list.length > 1) {
        gameSlot.teamOneList = list.slice(0, list.length / 2);
        gameSlot.teamTwoList = list.slice(list.length / 2);
      }
      data.push(gameSlot);
    })
    data.sort(ArraySorting.sortObjectByKey('timestamp'));
    return data;
  }

  /**
   * Creates the player list
   * @param bookings
   * @param users
   * @param maxPlayers
   * @returns
   */
  createPlayerList(bookings: Booking[], users: Player[], maxPlayers: number): string[] {
    if (!bookings?.length || !users?.length || maxPlayers <= 0) {
      return [];
    }

    const list: string[] = [];
    bookings.forEach(booking => {
      const user = users.find((user: Player) => user.id === booking?.uid);
      if (user) {
        const name = user?.name || Constants.DELETED_USER_PLACEHOLDER;
        if (booking && booking.spots === 1) {
          list.push(name);
        } else if (booking && booking.spots > 1) {
          while (booking.spots > 0) {
            if (booking.spots === 1) {
              list.push(name);
            } else {
              list.push(this.getCustomName(name, booking.spots - 1));
            }
            booking.spots--;
          }
        }
      } else {
        list.push('');
      }
    });
    list.sort();
    if (list.length < maxPlayers) {
      for (let i = list.length; i < maxPlayers; i++) {
        list.push('');
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
    return Constants.DELETED_USER_PLACEHOLDER;
  }

  /**
   * Filters the user bookings
   * @param allSlots
   * @param bookings
   * @param currentUserID
   * @returns
   */
  filterUserBookings(allSlots: DiscoverGameSlot[], bookings: Booking[], currentUserID: string) {
    // Create a Set of slotIDs from array A where userID matches currentUserID
    const slotIDsSet = new Set(bookings
      .filter(item => item.uid === currentUserID)
      .map(item => item.slotId)
    );

    // Filter array B based on slotIDs present in slotIDsSet
    const filteredB = allSlots.filter(item => slotIDsSet.has(item.slotId));

    return filteredB;
  }

  /**
   * Opens the ground info bottom sheet
   */
  openGround(ground: Ground | undefined) {
    if (ground) {
      const config = new MatBottomSheetConfig();
      config.disableClose = false;
      config.hasBackdrop = true;
      config.backdropClass = 'sheet-backdrop';
      config.panelClass = 'sheet-custom-ground-info';
      config.data = ground;
      this.sheetService.openSheet(GroundInfoComponent, config);
    }
  }

  /**
   * Joins the game as a team
   * @param selectedData
   */
  joinAsTeam(selectedData: DiscoverGameSlot) {
    if (selectedData.availableSpots >= selectedData._totalSpots / 2) {
      const qParams: UserSlotSelectionInfo = {
        slot: selectedData.slotId,
        ground: selectedData.groundId,
        facility: selectedData.facilityId,
        spots: selectedData._totalSpots / 2,
        amount: selectedData.price * selectedData._totalSpots / 2
      };
      this.router.navigate(['/payment'], { queryParams: qParams });
    }
  }

  /**
   * Joins the game as a player
   * @param selectedData
   */
  joinAsPlayer(selectedData: DiscoverGameSlot) {
    if (selectedData.availableSpots) {
      const qParams: UserSlotSelectionInfo = {
        slot: selectedData.slotId,
        ground: selectedData.groundId,
        facility: selectedData.facilityId,
        spots: 1,
        amount: selectedData.price
      };
      this.router.navigate(['/payment'], { queryParams: qParams });
    }
  }
}