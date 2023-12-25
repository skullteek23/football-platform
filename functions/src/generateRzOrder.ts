import * as functions from "firebase-functions";
import {RAZORPAY} from "./rz";
import {checkKeysExist, isRequestAuthenticated} from "./functions-utils";

import Razorpay = require("razorpay");

/**
 * Generates Razorpay Order and returns Order ID
 * @param {any} data
 * @param {any} context
 * @return {Promise<any>}
 */
export async function generateRzOrder(data: any, context: any): Promise<any> {
  const missingParameter = checkKeysExist(data, ["amount"]);
  if (missingParameter) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "invalid-argument",
      `Missing ${missingParameter} parameter.`
    );
  }

  // Check if request is authenticated
  if (!isRequestAuthenticated(context)) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required for this action."
    );
  }

  if (data.amount <= 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Minimum order value required."
    );
  }

  const options: any = {
    currency: "INR",
    amount: Number(data.amount) * 100, // amount in paise
    receipt: data.uid,
    partial_payment: false,
  };

  const instanceOptions = {
    key_id: RAZORPAY.test.keyId,
    key_secret: RAZORPAY.test.keySecret,
  };

  try {
    const instance = new Razorpay(instanceOptions);
    return instance.orders.create(options);
  } catch (error: any) {
    throw new functions.https.HttpsError("unauthenticated", error);
  }
}
