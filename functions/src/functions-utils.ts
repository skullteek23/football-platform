import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

const db = admin.firestore();

import {GroundSlot, SlotStatus} from "@ballzo-ui/core";

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
