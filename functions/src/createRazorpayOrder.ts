const Razorpay = require('razorpay');
export async function createRazorpayOrder(data: any, context: any): Promise<any> {
  const instance = new Razorpay({
    key_id: '',
    key_secret: '',
  });
  const options = {
    amount: (data.amount * 100).toString(), // amount in paise
    currency: 'INR',
  };
  return instance.orders.create(options);
}
