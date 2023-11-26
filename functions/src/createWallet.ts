import * as admin from "firebase-admin";
const db = admin.firestore();
import {UserRecord} from "firebase-admin/auth";
import {UserWallet, convertObjectToFirestoreData} from "@ballzo-ui/core";

/**
 * Creates the wallet for the user
 * @param {UserRecord} user
 * @param {functions.EventContext<Record<string, string>>} context
 * @return {Promise<any>}
 */
export async function walletCreation(
  user: UserRecord, context: any
): Promise<any> {
  if (user && !user.disabled && user.phoneNumber && user.uid) {
    const uid: string = user.uid;
    const wallet = new UserWallet();

    return db.collection("user-wallet")
      .doc(uid).set(convertObjectToFirestoreData(wallet));
  }
  return;
}
