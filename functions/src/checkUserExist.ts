import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {checkKeysExist} from "./functions-utils";

/**
 * Check if the user exists with the given phone number
 * @param {any} data
 * @param {any} context
 * @return {Promise<UserRecord>}
 */
export async function checkUserExist(data: any, context: any): Promise<any> {
  const missingParameter = checkKeysExist(data, ["phoneNumber"]);
  if (missingParameter) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
      "invalid-argument",
      `Missing ${missingParameter} parameter.`
    );
  }

  // Check if request is authenticated
  // if (!isRequestAuthenticated(context)) {
  //   throw new functions.https.HttpsError(
  //     'unauthenticated',
  //     'Authentication required for this action.'
  //   );
  // }

  // Function main logic
  const phoneNumber = data.phoneNumber;
  if (!phoneNumber.startsWith("+91") || phoneNumber.length !== 13) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid phone number"
    );
  }

  try {
    // Attempt to retrieve the user by phone number
    await admin.auth().getUserByPhoneNumber(data.phoneNumber);

    // User found, you can use userRecord
    return true;
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      // Handle the case where no user is found
      return false;
    } else {
      // Handle other errors
      throw new functions.https.HttpsError(
        "internal",
        "Error retrieving user."
      );
    }
  }
}
