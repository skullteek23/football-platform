import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {
  checkKeysExist,
  isRequestAuthenticated,
} from "./functions-utils";
import {Position} from "@ballzo-ui/core";

/**
 * Update the user role
 * @param {any} data
 * @param {any} context
 * @return {Promise<boolean>}
 */
export async function updateUserRole(data: any, context: any): Promise<any> {
  const missingParameter = checkKeysExist(data, ["role"]);
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

  try {
    // Function main logic
    const newRole = data.role.trim();
    const positionArray: any[] = Object.values(Position);
    const indexValue = positionArray.indexOf(newRole);
    if (indexValue === -1) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Invalid role"
      );
    }

    return admin.auth()
      .setCustomUserClaims(context.auth.uid, {role: newRole});
  } catch (error) {
    // Handle other errors
    throw new functions.https.HttpsError(
      "internal",
      "Error updating user role."
    );
  }
}
