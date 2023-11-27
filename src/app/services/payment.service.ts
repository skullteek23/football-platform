import { Injectable } from "@angular/core";
import { AuthService } from "@app/authentication/auth.service";
import { SessionStorageProperties } from "@app/constant/constants";
import { Order } from "@ballzo-ui/core";
import { IUser } from "@app/models/user.model";
import { UserSlotSelectionInfo } from "@app/shared-modules/ground-selection/models/ground-selection.model";
import { GroundSlot } from "@ballzo-ui/core";
import { Booking } from "@ballzo-ui/core";
import { Player, Position } from "@ballzo-ui/core";
import { isEnumKey, getRandomString } from "@ballzo-ui/core";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { GroundService } from "./ground.service";
import { OrderService } from "./order.service";
import { SessionStorageService } from "./session-storage.service";
import { UserService } from "./user.service";
import { getCloudFnErrorMsg } from "@app/utils/api-error-handling-utility";
import { CommonMessages, PaymentMessages } from "@app/constant/common-messages";

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

    return this.book();
  }

  /**
   * Performs the booking process via cloud function
   * @param role
   * @param user
   * @returns
   */
  book(): Promise<any> {
    const selectionData: UserSlotSelectionInfo = this.sessionStorage.get(SessionStorageProperties.USER_GROUND_SELECTION);

    if (!selectionData) {
      return Promise.reject('Invalid selection data!');
    }

    return this.groundService.bookSlot(selectionData);
  }
}
