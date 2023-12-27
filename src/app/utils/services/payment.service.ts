import { Injectable } from "@angular/core";
import { AuthService } from "@app/authentication/auth.service";
import { CheckoutRz } from "@ballzo-ui/core";
import { UserSlotSelectionInfo } from "@app/shared-modules/ground-selection/models/ground-selection.model";
import { GroundService } from "./ground.service";
import { SessionStorageService } from "./session-storage.service";
import { UserService } from "./user.service";
import { RazorpayUtility } from "@app/utils/main-utilities/razorpay";
import { CoreApiService } from "./core-api.service";
import { cloudFunctionNames } from "@app/utils/constant/api-constants";
import { Router } from "@angular/router";
import { SnackbarService } from "./snackbar.service";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private groundService: GroundService,
    private authService: AuthService,
    private sessionStorage: SessionStorageService,
    private userService: UserService,
    private apiService: CoreApiService,
    private router: Router,
    private snackbarService: SnackbarService
  ) { }

  /**
   * Called when user completes the payment during first time onboarding
   * @param user
   * @returns
   */
  // async onboard(user: IUser): Promise<any> {
  //   const role = this.sessionStorage.get(SessionStorageProperties.USER_POSITION_SELECTION);
  //   const userDetails = new Player();
  //   const selectionData: UserSlotSelectionInfo = this.sessionStorage.get(SessionStorageProperties.USER_GROUND_SELECTION);

  //   if (!role || !selectionData || !user?.uid) {
  //     return Promise.reject('Invalid selection data!');
  //   }

  //   if (user?.displayName) {
  //     userDetails.name = user.displayName;
  //   }
  //   if (String(role) && isEnumKey(role, Position)) {
  //     userDetails.position = role;
  //   }
  //   if (user?.uid) {
  //     try {
  //       await this.authService.setUserRole(role);
  //     } catch (error) {
  //       return Promise.reject(getCloudFnErrorMsg(error));
  //     }

  //     try {
  //       await this.userService.addUserDetails(userDetails, user?.uid);
  //     } catch (error) {
  //       return Promise.reject(error);
  //     }
  //   }

  //   // return this.book();
  // }

  /**
   * Performs the booking process via cloud function
   * @param role
   * @param user
   * @returns
   */
  book(data: UserSlotSelectionInfo, orderID: string): Promise<any> {
    return this.groundService.bookSlot(data, orderID);
  }

  /**
   * Generates the order from razorpay
   * @param amount
   * @returns
   */
  generateOrder(amount: string, slot: string): Promise<any> {
    return this.apiService.callHttpFunction(cloudFunctionNames.createOrder, { amount, slot });
  }

  /**
   * Opens the Razorpay checkout page
   * @param orderID
   */
  openCheckout(options: Partial<CheckoutRz>): void {
    RazorpayUtility.openCheckoutPage(options);
  }

  /**
   * Verifies the payment on the backend
   * @param response
   * @returns
   */
  async verifyPayment(response: any): Promise<any> {
    return this.apiService.callHttpFunction(cloudFunctionNames.verifyPayment, response);
  }
}
