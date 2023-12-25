import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import {isRequestAuthenticated} from "./functions-utils";
import {CancellationBehavior, Constants} from "@ballzo-ui/core";
const db = admin.firestore();

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
