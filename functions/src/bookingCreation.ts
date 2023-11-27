import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
const db = admin.firestore();
import {
  checkKeysExist,
  generateOID,
  isRequestAuthenticated,
} from "./functions-utils";
import {
  Booking,
  GroundSlot,
  Order,
  convertObjectToFirestoreData,
  getRandomString,
} from "@ballzo-ui/core";

/**
 * Creates booking for a valid user and returns an order ID
 * @param {any} data
 * @param {any} context
 * @return {Promise<any>}
 */
export async function bookingCreation(data: any, context: any): Promise<any> {
  const missingParameter = checkKeysExist(data, [
    "groundId", "facilityId", "slotId", "spots",
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
  const slotInfo: GroundSlot = (await db
    .collection("slots")
    .doc(slotID)
    .get()).data() as GroundSlot;

  // Check if slot exists or not
  if (!slotInfo) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Slot doesn't exist! Please try another one."
    );
  }

  // Check if slot is full or not
  if (slotInfo?.allowedCount &&
    slotInfo.allowedCount <= slotInfo.participantCount) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Slot is full! Please try another one."
    );
  }

  // Check is requested booking is valid or not
  if (spotsCount <= 0) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "At least one slot needs to be booked."
    );
  }

  // create batch
  const batch = db.batch();
  const oid = generateOID(getRandomString(10));

  const queryResult = (await db
    .collection("bookings")
    .where("uid", "==", userID)
    .where("slotTimestamp", "==", slotInfo.timestamp)
    .get()).docs;
  if (queryResult?.length > 0) {
    const existingBooking = queryResult[0]?.data() as Booking;

    // Check if user has already booked another slot for the same time
    if (queryResult.length > 1 || existingBooking.slotId !== slotID) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "You have already booked another slot for the same time."
      );
    }

    // Check if user has already booked the same slot
    // update booking if so
    existingBooking.orderIds.push(oid);
    existingBooking.spots += spotsCount;
    existingBooking.lastUpdated = new Date().getTime();

    // ADD TO BATCH
    batch.update(
      queryResult[0].ref,
      convertObjectToFirestoreData(existingBooking)
    );
  } else {
    // Add new booking
    const booking = new Booking();
    booking.uid = userID;
    booking.orderIds.push(oid);
    booking.facilityId = facilityID;
    booking.groundId = groundID;
    booking.slotId = slotID;
    booking.spots = spotsCount;
    booking.slotTimestamp = slotInfo.timestamp;

    // ADD TO BATCH
    batch.create(
      db.collection("bookings").doc(),
      convertObjectToFirestoreData(booking)
    );
  }

  // create order
  const order = new Order();
  order.amount = order.totalPrice(spotsCount, slotInfo.price);
  order.ref = {
    spots: spotsCount,
  };
  order.uid = userID;

  // ADD TO BATCH
  batch.create(
    db.collection("orders").doc(oid),
    convertObjectToFirestoreData(order)
  );
  try {
    await batch.commit();
    return oid;
  } catch (error) {
    throw new functions.https.HttpsError(
      "unknown",
      "Something went wrong! Try again later."
    );
  }
}
