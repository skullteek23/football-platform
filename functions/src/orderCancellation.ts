import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
const db = admin.firestore();
import {checkKeysExist, isRequestAuthenticated} from "./functions-utils";

/**
 * Refunds order and free associated slots
 * @param {any} data
 * @param {any} context
 * @return {Promise<any>}
 */
export async function orderCancellation(data: any, context: any): Promise<any> {
  const missingParameter = checkKeysExist(data, ["orderID", "reason"]);
  if (missingParameter) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "invalid-argument",
      `Missing ${missingParameter} parameter.`
    );
  }

  const orderID: string = data?.orderID || "";

  // Check if request is authenticated
  if (!isRequestAuthenticated(context)) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required for this action."
    );
  }

  // Check if Order ID is valid
  if (!orderID?.startsWith("OD")) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid Order Id."
    );
  }

  // Check if order data exists and is not already returned
  const orderData = (await db.collection("orders").doc(orderID).get()).data();
  if (!orderData || orderData?.status === "returned") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Order is already cancelled."
    );
  }
  // Check if booking data exists and is valid
  const bookingQueryResult = await db
    .collection("bookings")
    .where("orderIds", "array-contains", orderID).get();
  if (!bookingQueryResult ||
    bookingQueryResult?.empty ||
    !Object.prototype.hasOwnProperty.call(orderData?.ref, "spots") ||
    orderData?.ref?.spots <= 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Order is non-cancellable."
    );
  }
  const bookingData = bookingQueryResult.docs[0].data();
  const bookingId = bookingQueryResult.docs[0].id;

  // Check if slot data exists and is valid
  const slotId = bookingData?.slotId || "";
  const slotData = (
    await db.collection("slots").doc(slotId).get()
  ).data();
  if (!slotData || slotData.participantCount <= 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Order is non-cancellable."
    );
  }

  const updateBookingData = {
    spots: Number(bookingData?.spots) - Number(orderData?.ref?.spots),
    lastUpdated: new Date().getTime(),
  };
  const reason = data?.reason?.trim();
  const orderReturn = {
    reason,
    oid: orderID,
    returnCount: Number(orderData?.ref?.spots),
    timestamp: new Date().getTime(),
    returnMode: "ballzo-wallet",
  };

  const allPromises = [];
  allPromises.push(
    db.collection("orders")
      .doc(orderID)
      .update({status: "returned"})
  );
  allPromises.push(
    db.collection("order-returns")
      .doc(orderID)
      .create(orderReturn)
  );
  if (updateBookingData.spots <= 0) {
    allPromises.push(
      db.collection("bookings")
        .doc(bookingId)
        .delete()
    );
  } else {
    allPromises.push(
      db.collection("bookings")
        .doc(bookingId)
        .update({
          ...updateBookingData,
        })
    );
  }

  try {
    await Promise.all(allPromises);
    // await db.collection("user-wallet").doc(context.auth.uid).update({
    //   amount: admin.firestore.FieldValue.increment(orderData?.amount),
    // });
    // await db.collection("wallet-transactions").doc().create({
    //   amount: orderData.amount,
    //   type: "credit",
    //   createdOn: new Date().getTime(),
    //   orderId: orderID,
    //   uid: bookingData.uid,
    //   transactionFor: "booking cancellation",
    // });
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "Internal Error occurred."
    );
  }
}
