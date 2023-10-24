import { Injectable } from '@angular/core';
import { CommonMessages, PaymentMessages } from '@app/constant/app-messages';
import { GroundSlot } from '@app/models/ground.model';
import { Order, Booking } from '@app/models/order.model';
import { getRandomString } from '@app/utils/string-utility';
import { lastValueFrom } from 'rxjs';
import { GroundService } from './ground.service';
import { OrderService } from './order.service';
import { UserSlotSelectionInfo } from '@app/shared-modules/ground-selection/models/ground-selection.model';
import { AuthService } from '@app/authentication/auth.service';
import { SessionStorageService } from './session-storage.service';
import { SessionStorageProperties } from '@app/constant/app-constants';
import { Player } from '@app/models/user.model';
import { isEnumKey } from '@app/utils/objects-utility';
import { Position } from 'functions/src/functions-utils';
import { UserService } from './user.service';
import { IUser } from '@app/models/common.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private groundService: GroundService,
    private orderService: OrderService,
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
    private userService: UserService
  ) { }

  /**
   * Called when user completes the payment during first time onboarding
   * @param user
   * @returns
   */
  async onboard(user: IUser): Promise<any> {
    const role = this.sessionStorage.get(SessionStorageProperties.USER_POSITION_SELECTION);
    const userDetails = new Player();
    const selectionData: UserSlotSelectionInfo = this.sessionStorage.get(SessionStorageProperties.USER_GROUND_SELECTION);

    if (!role || !selectionData || !user?.uid) {
      return Promise.reject('Invalid selection data!');
    }

    try {
      if (user?.displayName) {
        userDetails.name = user.displayName;
      }
      if (String(role) && isEnumKey(role, Position)) {
        userDetails.position = role;
      }
      if (user?.uid) {
        await this.authService.setUserRole(role);
        await this.userService.addUserDetails(userDetails, user?.uid);

      }
    } catch (error) {
      return Promise.reject(CommonMessages.error.genericError);
    }

    return this.addBooking(selectionData, user.uid);
  }

  /**
   * Performs the booking process
   * @param role
   * @param user
   * @returns
   */
  book(user: IUser): Promise<any> {
    const selectionData: UserSlotSelectionInfo = this.sessionStorage.get(SessionStorageProperties.USER_GROUND_SELECTION);

    if (!selectionData || !user?.uid) {
      return Promise.reject('Invalid selection data!');
    }

    return this.addBooking(selectionData, user.uid);
  }

  /**
   * Post-payment booking process
   * @param data
   * @param uid
   * @returns
   */
  async addBooking(data: UserSlotSelectionInfo, uid: string): Promise<any> {
    const slotInfo: GroundSlot = await lastValueFrom(this.groundService.getFacilitySlot(data.slotId));

    // Checking if slot has space for new bookings or not
    if (slotInfo && slotInfo.allowedCount && slotInfo.allowedCount <= slotInfo.participantCount) {
      return Promise.reject(PaymentMessages.error.slotFull);
    } else if (!data.slotId || !data.facilityId || !data.groundId || data.spots <= 0) {
      return Promise.reject(CommonMessages.error.genericError);
    } else {
      const order = new Order();
      const booking = new Booking();
      const updatedSlot = new GroundSlot();

      const oid = this.orderService.generateOID(getRandomString(10));
      const allPromises = [];

      order.amount = order.totalPrice(data.spots, slotInfo.price);
      order.ref = {};
      order.uid = uid;

      booking.uid = uid;
      booking.orderId = oid;
      booking.facilityId = data.facilityId;
      booking.groundId = data.groundId;
      booking.slotId = data.slotId;
      booking.spots = data.spots;

      updatedSlot.groundId = slotInfo.groundId;
      updatedSlot.facilityId = slotInfo.facilityId;
      updatedSlot.timestamp = slotInfo.timestamp;
      updatedSlot.price = slotInfo.price;
      updatedSlot.status = slotInfo.status;
      updatedSlot.allowedCount = slotInfo.allowedCount;
      updatedSlot.participantCount = slotInfo.participantCount;
      if (updatedSlot.addParticipant) {
        updatedSlot.addParticipant(data.spots);
      }
      if (updatedSlot.updateStatus) {
        updatedSlot.updateStatus();
      }

      allPromises.push(this.orderService.saveOrder(order, oid));
      allPromises.push(this.orderService.addBooking(booking));
      allPromises.push(this.groundService.updateSlot(data.slotId, updatedSlot));

      try {
        await Promise.all(allPromises);
        return Promise.resolve(oid);
      } catch (error) {
        return Promise.reject(CommonMessages.error.genericError);
      }
    }
  }


}
