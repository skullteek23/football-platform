import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
const db = admin.firestore();
import {
  checkKeysExist, getCancellationBehavior, isRequestAuthenticated,
} from "./functions-utils";
import {OrderRz} from "@ballzo-ui/core";

import Razorpay = require("razorpay");
import {RAZORPAY} from "./rz";

/**
 * Refunds order and free associated slots
 * @param {any} data
 * @param {any} context
 * @return {Promise<any>}
 */
export async function refundOrder(data: any, context: any): Promise<any> {
  const missingParameter = checkKeysExist(data, [
    "orderID", "bookingID", "reason",
  ]);
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

  const orderID: string = data?.orderID;
  const bookingID: string = data?.bookingID;
  const reason: string = data?.reason;

  if (!reason.includes("Admin:") &&
    await getCancellationBehavior({}, context)
  ) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Cancellation not allowed!"
    );
  }

  const KEY_SECRET = RAZORPAY.test.keySecret; // confidential
  const KEY_ID = RAZORPAY.test.keyId; // confidential

  try {
    const instance = new Razorpay(
      {key_id: KEY_ID, key_secret: KEY_SECRET}
    );

    const payments = await instance.orders.fetchPayments(orderID);

    if (payments && payments.count >= 1) {
      payments.items.forEach(async (payment) => {
        if (payment.status !== "refunded") {
          try {
            await instance.payments.refund(payment.id, {
              amount: payment.amount,
            });
          } catch (error) {
            console.log("Razorpay Refund error: ", error);
            throw new functions.https.HttpsError(
              "unknown",
              "Refund failed."
            );
          }
        }
      });

      if ((await db.collection("bookings").doc(bookingID).get()).exists) {
        await db.collection("bookings").doc(bookingID).delete();
        // booking deletion will trigger slot update function
      }

      if ((await db.collection("orders").doc(orderID).get()).exists) {
        await db.collection("orders").doc(orderID).update({
          notes: {
            refunded: new Date().toISOString(),
            reason,
          },
        } as Partial<OrderRz>);
      }

      return true;
    } else {
      throw new functions.https.HttpsError(
        "unknown",
        "No payments found for this order."
      );
    }
  } catch (error) {
    console.log("Refund error: ", error);
    throw new functions.https.HttpsError(
      "unknown",
      "Refund failed."
    );
  }
}
