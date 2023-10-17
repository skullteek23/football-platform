import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  checkSomeKeysExist,
  isRequestAuthenticated,
} from "./functions-utils";

/**
 * Update the user profile details
 * @param {any} data
 * @param {any} context
 * @return {Promise<boolean>}
 */
export async function updateProfile(data: any, context: any): Promise<any> {
  const missingParameter = checkSomeKeysExist(data, [
    "email",
    "phoneNumber",
    "emailVerified",
    "password",
    "displayName",
    "photoURL",
    "disabled",
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

  // Function main logic

  return admin.auth().updateUser(context.auth.uid, {...data});
}
