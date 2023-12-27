import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
const db = admin.firestore();
import {
  checkKeysExist,
  isRequestAuthenticated,
  runSlotValidityCheck,
} from "./functions-utils";
import {
  Booking,
  GroundSlot,
  OrderRz,
  convertObjectToFirestoreData,
  getRandomString,
} from "@ballzo-ui/core";
import {RAZORPAY} from "./rz";
import {refundOrder} from "./refundOrder";

import Razorpay = require("razorpay");
/**
 * Creates booking for a valid user and returns an order ID
 * @param {any} data
 * @param {any} context
 * @return {Promise<any>}
 */
export async function bookingCreation(data: any, context: any): Promise<any> {
  const missingParameter = checkKeysExist(data, [
    "groundId", "facilityId", "slotId", "spots", "orderID",
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

  const groundID = data.groundId;
  const facilityID = data.facilityId;
  const userID = context?.auth?.uid;
  const slotID = data.slotId;
  const spotsCount = Number(data.spots);

  // Check is requested booking is valid or not
  if (spotsCount <= 0) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "At least one spot needs to be booked."
    );
  }

  const slotInfo: GroundSlot = (await db
    .collection("slots")
    .doc(slotID)
    .get()).data() as GroundSlot;

  try {
    await runSlotValidityCheck(slotInfo, context);
  } catch (error: any) {
    throw new functions.https.HttpsError("failed-precondition", error);
  }

  // create batch
  const batch = db.batch();
  const oid = data.orderID;
  const bookingID = "booking_" + getRandomString(15);

  // Add new booking
  const booking = new Booking();
  booking.uid = userID;
  booking.orderId = oid;
  booking.facilityId = facilityID;
  booking.groundId = groundID;
  booking.slotId = slotID;
  booking.spots = spotsCount;
  booking.slotTimestamp = slotInfo.timestamp;

  batch.create(
    db.collection("bookings").doc(bookingID),
    convertObjectToFirestoreData(booking)
  );

  // create order
  try {
    const KEY_SECRET = RAZORPAY.test.keySecret; // confidential
    const KEY_ID = RAZORPAY.test.keyId; // confidential

    const instance = new Razorpay(
      {key_id: KEY_ID, key_secret: KEY_SECRET}
    );
    const order: Partial<OrderRz> = await instance?.orders?.fetch(oid);
    order.uid = userID;
    order.bookingId = bookingID;
    batch.set(
      db.collection("orders").doc(oid),
      convertObjectToFirestoreData(order)
    );
  } catch (error) {
    console.log("Razorpay error: ", error);
    throw new functions.https.HttpsError(
      "unknown",
      "Something went wrong! Try again later."
    );
  }

  // Executing main batch
  try {
    await batch.commit();
    return oid;
  } catch (error) {
    console.log("Booking error: ", error);
    await refundOrder(
      {orderID: oid, bookingID, reason: "Admin: booking-failed"}, context
    );
    throw new functions.https.HttpsError(
      "unknown",
      "Booking Failed! Try again later."
    );
  }
}
