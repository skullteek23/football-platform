import { CheckoutRz } from "@ballzo-ui/core";
import { environmentCommon } from "@environments/environment.common";

declare var Razorpay: any;

export class RazorpayUtility {

  static readonly DEFAULT_OPTIONS = { ...environmentCommon.checkoutOptions };

  static openCheckoutPage(options: Partial<CheckoutRz>): void {
    if (!options || !Object.keys(options).length) {
      return;
    }
    const optionsWithDefault = { ...RazorpayUtility.DEFAULT_OPTIONS, ...options };
    const razorpayInstance = new Razorpay(optionsWithDefault);
    razorpayInstance.open();
  }
}
