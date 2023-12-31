import { Injectable } from "@angular/core";
import { CheckoutRz } from "@ballzo-ui/core";
import { GroundService } from "./ground.service";
import { RazorpayUtility } from "@app/utils/main-utilities/razorpay";
import { CoreApiService } from "./core-api.service";
import { cloudFunctionNames } from "@app/utils/constant/api-constants";
import { UserSlotSelectionInfo } from "@app/shared-modules/payment/models/payment.model";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(
    private groundService: GroundService,
    private apiService: CoreApiService,
  ) { }

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
