import * as admin from "firebase-admin";
import {DocumentSnapshot} from "firebase-admin/firestore";
import {Change} from "firebase-functions/lib/common/change";
import {Player} from "@ballzo-ui/core";
import {UpdateRequest} from "firebase-admin/auth";

/**
 * Modifies the display name of the user when the player name is updated
 * @param {Change<DocumentSnapshot>} change
 * @param {any} context
 * @return {Promise<any>}
 */
export async function updateAuthProfile(
  change: Change<DocumentSnapshot>, context: any
): Promise<any> {
  const before = change.before.exists ? change.before.data() as Player : null;
  const after = change.after.exists ? change.after.data() as Player : null;

  try {
    // Function main logic
    const currentName = before?.name;
    const newName = after?.name;

    const currentImgpath = before?.imgLink;
    const newImgpath = after?.imgLink;
    const update: Partial<UpdateRequest> = {};

    if (currentImgpath !== newImgpath) {
      update.photoURL = newImgpath;
    }

    if (currentName !== newName) {
      update.displayName = newName;
    }

    if (update.displayName || update.photoURL) {
      return admin.auth()
        .updateUser(context.auth.uid, {...update});
    }
  } catch (error) {
    // Handle other errors
    console.log("Error updating name: ", error);
  }
}
