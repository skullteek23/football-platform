import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {RAZORPAY} from "./rz";
import {checkKeysExist, isRequestAuthenticated} from "./functions-utils";

const db = admin.firestore();
import crypto = require("crypto");

/**
 * Payment verification for any razorpay order
 * @param {any} data
 * @param {any} context
 * @return {Promise<any>}
 */
export async function paymentVerification(
  data: any, context: any
): Promise<any> {
  const missingParameter = checkKeysExist(data,
    ["razorpay_order_id", "razorpay_payment_id", "razorpay_signature"]
  );
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
  const ORDER_ID = data.razorpay_order_id;
  const PAYMENT_ID = data.razorpay_payment_id;
  const SIGNATURE = data.razorpay_signature;
  const KEY_SECRET = RAZORPAY.test.keySecret;
  const generatedSignature = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${ORDER_ID}|${PAYMENT_ID}`)
    .digest("hex");

  if (generatedSignature &&
    SIGNATURE === generatedSignature
  ) {
    const verificationData: any = {
      razorpay_order_id: ORDER_ID,
      razorpay_payment_id: PAYMENT_ID,
      razorpay_signature: SIGNATURE,
      timestamp: new Date().getTime(),
    };
    db.collection("order-verifications")
      .doc(ORDER_ID)
      .create(verificationData);
    return true;
  } else {
    throw new functions
      .https
      .HttpsError("unauthenticated", "Payment Authentication failed!");
  }
}
