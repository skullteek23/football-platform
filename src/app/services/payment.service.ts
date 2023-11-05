import { Injectable } from "@angular/core";
import { AuthService } from "@app/authentication/auth.service";
import { SessionStorageProperties } from "@app/constant/constants";
import { Order } from "@app/models/order.model";
import { IUser } from "@app/models/user.model";
import { UserSlotSelectionInfo } from "@app/shared-modules/ground-selection/models/ground-selection.model";
import { CommonMessages, PaymentMessages } from "@ballzo-ui/core/common";
import { GroundSlot } from "@ballzo-ui/core/ground";
import { Booking } from "@ballzo-ui/core/transaction";
import { Player, Position } from "@ballzo-ui/core/user";
import { isEnumKey, getRandomString, getCloudFnErrorMsg } from "@ballzo-ui/core/utils";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { GroundService } from "./ground.service";
import { OrderService } from "./order.service";
import { SessionStorageService } from "./session-storage.service";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private groundService: GroundService,
    private orderService: OrderService,
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
    private userService: UserService,
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

    if (user?.displayName) {
      userDetails.name = user.displayName;
    }
    if (String(role) && isEnumKey(role, Position)) {
      userDetails.position = role;
    }
    if (user?.uid) {
      try {
        await this.authService.setUserRole(role);
      } catch (error) {
        return Promise.reject(getCloudFnErrorMsg(error));
      }

      try {
        await this.userService.addUserDetails(userDetails, user?.uid);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return this.addBooking(selectionData, user.uid);
  }

  /**
   * Performs the booking process
   * @param role
   * @param user
   * @returns
   */
  async book(user: IUser): Promise<any> {
    const selectionData: UserSlotSelectionInfo = this.sessionStorage.get(SessionStorageProperties.USER_GROUND_SELECTION);

    if (!selectionData || !user?.uid) {
      return Promise.reject('Invalid selection data!');
    }

    const existingBooking = await firstValueFrom(this.orderService.getExistingBookingForUser(selectionData, user.uid));

    if (existingBooking?.slotId === selectionData.slotId && existingBooking?.uid === user.uid) {
      return this.updateBooking(selectionData, user.uid, existingBooking);
    } else {
      return this.addBooking(selectionData, user.uid);
    }
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

      const oid = this.orderService.generateOID(getRandomString(10));
      const allPromises = [];

      order.amount = order.totalPrice(data.spots, slotInfo.price);
      order.ref = {
        spots: data.spots,
      };
      order.uid = uid;

      booking.uid = uid;
      booking.orderIds.push(oid);
      booking.facilityId = data.facilityId;
      booking.groundId = data.groundId;
      booking.slotId = data.slotId;
      booking.spots = data.spots;

      allPromises.push(this.orderService.saveOrder(order, oid));
      allPromises.push(this.orderService.addBooking(booking));

      try {
        await Promise.all(allPromises);
        return Promise.resolve(oid);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }

  /**
 * Post-payment booking process
 * @param data
 * @param uid
 * @returns
 */
  async updateBooking(data: UserSlotSelectionInfo, uid: string, existingBooking: Booking): Promise<any> {
    const slotInfo: GroundSlot = await lastValueFrom(this.groundService.getFacilitySlot(data.slotId));

    // Checking if slot has space for new bookings or not
    if (slotInfo && slotInfo.allowedCount && slotInfo.allowedCount <= slotInfo.participantCount) {
      return Promise.reject(PaymentMessages.error.slotFull);
    } else if (!data.slotId || !data.facilityId || !data.groundId || data.spots <= 0 || !existingBooking.id) {
      return Promise.reject(CommonMessages.error.genericError);
    } else {
      const order = new Order();

      const oid = this.orderService.generateOID(getRandomString(10));
      const allPromises = [];

      order.amount = order.totalPrice(data.spots, slotInfo.price);
      order.ref = {
        spots: data.spots,
      };
      order.uid = uid;

      existingBooking.orderIds.push(oid);
      existingBooking.spots += data.spots;
      existingBooking.lastUpdated = new Date().getTime();

      allPromises.push(this.orderService.saveOrder(order, oid));
      allPromises.push(this.orderService.updateBooking(existingBooking, existingBooking.id));

      try {
        await Promise.all(allPromises);
        return Promise.resolve(oid);
      } catch (error) {
        return Promise.reject(error);
      }
    }
  }


}
