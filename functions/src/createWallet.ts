import * as admin from "firebase-admin";
const db = admin.firestore();
import {UserRecord} from "firebase-admin/auth";

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
    const wallet: any = {
      amount: 0,
      disabled: false,
    };

    return db.collection("user-wallet").doc(uid).set(wallet);
  }
  return;
}
