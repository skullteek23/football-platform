import Razorpay = require("razorpay");
/**
 * Returns a promise that resolves to a Razorpay order object
 * @param {any} data
 * @param {any} context
 * @return {Promise<any>}
 */
export async function createRazorpayOrder(
  data: any, context: any
): Promise<any> {
  const instance = new Razorpay({
    key_id: "",
    key_secret: "",
  });
  const options = {
    amount: (data.amount * 100).toString(), // amount in paise
    currency: "INR",
  };
  return instance.orders.create(options);
}
