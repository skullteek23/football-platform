import * as admin from "firebase-admin";
import {QueryDocumentSnapshot} from "firebase-admin/firestore";
const db = admin.firestore();

/**
 * Deletes the user when the player is deletedÍ
 * @param {QueryDocumentSnapshot} snapshot
 * @param {any} context
 * @return {Promise<any>}
 */
export async function deleteAuthProfile(
  snapshot: QueryDocumentSnapshot, context: any
): Promise<any> {
  try {
    await admin.auth()
      .deleteUser(snapshot.id);
    await db.collection("user-wallet")
      .doc(snapshot.id).delete();
    return true;
  } catch (error) {
    // Handle other errors
    console.log("Error deleting profile: ", error);
  }
}
