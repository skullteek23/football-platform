import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
const db = admin.firestore();
import {
  Player, UserWallet, convertObjectToFirestoreData,
} from "@ballzo-ui/core";
import {
  checkKeysExist,
  isRequestAuthenticated,
} from "./functions-utils";

/**
 * Creates a profile for the user
 * @param {any} data
 * @param {any} context
 * @return {Promise<any>}
 */
export async function profileCreation(
  data: any, context: any
): Promise<any> {
  const missingParameter = checkKeysExist(data, ["displayName"]);
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

  const name = data?.displayName;
  const userID = context?.auth?.uid;

  if (name && userID) {
    const wallet = new UserWallet();
    const player = new Player();
    player.name = name;

    const batch = db.batch();

    batch.create(
      db.collection("user-wallet").doc(userID),
      convertObjectToFirestoreData(wallet)
    );

    batch.create(
      db.collection("players").doc(userID),
      convertObjectToFirestoreData(player)
    );

    try {
      await batch.commit();
      await admin.auth().updateUser(userID, {displayName: name});

      return true;
    } catch (error) {
      console.error("Error creating profile: ", error);
      return false;
    }
  }
  return false;
}
