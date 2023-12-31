import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {RAZORPAY} from "./rz";
import {
  checkKeysExist,
  isRequestAuthenticated,
  runSlotValidityCheck,
} from "./functions-utils";

const db = admin.firestore();

import Razorpay = require("razorpay");
import {GroundSlot} from "@ballzo-ui/core";

/**
 * Generates Razorpay Order and returns Order ID
 * @param {any} data
 * @param {any} context
 * @return {Promise<any>}
 */
export async function generateRzOrder(data: any, context: any): Promise<any> {
  const missingParameter = checkKeysExist(data, ["amount", "slot"]);
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

  const amount = Number(data.amount);

  if (amount <= 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Minimum order value required."
    );
  }

  const slotID = data.slot;
  const slotInfo: GroundSlot = (await db
    .collection("slots")
    .doc(slotID)
    .get()).data() as GroundSlot;

  try {
    await runSlotValidityCheck(slotInfo, context);
  } catch (error: any) {
    throw new functions.https.HttpsError("failed-precondition", error);
  }

  const options: any = {
    currency: "INR",
    amount: amount * 100, // amount in paise
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
