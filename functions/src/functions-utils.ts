import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

import {
  GroundSlot,
  SlotStatus,
  CancellationBehavior,
  Constants,
} from "@ballzo-ui/core";
const db = admin.firestore();


/**
 * Check if all the keys exist in the data object
 * @param {any} data
 * @param {string[]} parameters
 * @return {string}
 */
export function checkKeysExist(data: any, parameters: string[]): string {
  if (!data) {
    return "unknown";
  } else if (!parameters.length) {
    return "";
  } else {
    for (let index = 0; index < parameters.length; index++) {
      const parameter = parameters[index];
      if (
        !Object.prototype.hasOwnProperty.call(data, parameter) ||
        (Object.prototype.hasOwnProperty.call(data, parameter) &&
          (data[parameter] === undefined ||
            data[parameter] === null))
      ) {
        return parameter;
      }
    }
    return "";
  }
}

/**
 * Check if at least one of the keys exist in the data object
 * @param {any} data
 * @param {string[]} parameters
 * @return {string}
 */
export function checkSomeKeysExist(data: any, parameters: string[]): string {
  if (!data) {
    return "one";
  } else if (!parameters.length) {
    return "one";
  } else {
    const result = parameters.some((parameter) => {
      if (
        !Object.prototype.hasOwnProperty.call(data, parameter) ||
        (Object.prototype.hasOwnProperty.call(data, parameter) &&
          (data[parameter] === undefined ||
            data[parameter] === null))
      ) {
        return true;
      } else {
        return false;
      }
    });

    return result ? "" : "one";
  }
}

/**
 * Check if the request is authenticated
 * @param {any} context
 * @return {boolean}
 */
export function isRequestAuthenticated(
  context: functions.https.CallableContext
): boolean {
  if (context?.auth?.uid) {
    return true;
  }
  return false;
}

/**
 * Run validity check on slot
 * @param {GroundSlot} slot
 * @param {any} context
 * @return {Promise<any>}
 */
export async function runSlotValidityCheck(
  slot: GroundSlot, context: any
): Promise<any> {
  const uid = context.auth?.uid;

  // Check if slot exists or not
  if (!slot || slot.status !== SlotStatus.available) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Slot is not available! Please contact support."
    );
  }

  // Check if slot is full or not
  if (slot?.allowedCount &&
    slot.allowedCount <= slot.participantCount) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Slot is full! Please try another slot."
    );
  }

  const queryResult = (await db
    .collection("bookings")
    .where("uid", "==", uid)
    .where("slotTimestamp", "==", slot.timestamp)
    .get()).docs;
  if (queryResult?.length) {
    throw new functions.https.HttpsError(
      "failed-precondition",
      "Multiple bookings not allowed for same time."
    );
  }

  return;
}

/**
 * Returns true if cancellation is allowed
 * @param {any} data
 * @param {any} context
 * @return {Promise<any>}
 */
export async function getCancellationBehavior(
  data: any, context: any
): Promise<any> {
  // Check if request is authenticated
  if (!isRequestAuthenticated(context)) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Authentication required for this action."
    );
  }

  const UID = context?.auth?.uid;

  const cancelData = (await db.collection("booking-cancellations")
    .doc(UID)
    .get())
    ?.data() as CancellationBehavior;

  const maxCancelPerWeek = Constants.CANCELLATIONS_ALLOWED_IN_WEEK;
  const SEVEN_DAYS = 7 * Constants.ONE_DAY_IN_MILLISECONDS;
  const currentTimestamp = Date.now();
  const count = cancelData?.count || 0;
  const updateData = new CancellationBehavior();
  updateData.lastCancellationTimestamp = currentTimestamp;

  if (count >= maxCancelPerWeek &&
    (currentTimestamp - cancelData.lastCancellationTimestamp > SEVEN_DAYS)
  ) {
    // reset count
    updateData._resetCount();
    return true;
  } else if (count < maxCancelPerWeek) {
    updateData._updateCancellationCount();
    return true;
  } else {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Cancellation not allowed!"
    );
  }
}
