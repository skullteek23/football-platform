import * as admin from "firebase-admin";
const db = admin.firestore();
import {QueryDocumentSnapshot} from "firebase-admin/firestore";

/**
 * Creates the wallet for the user
 * @param {QueryDocumentSnapshot} snap
 * @param {any} context
 * @return {Promise<any>}
 */
export async function walletCreation(
  snap: QueryDocumentSnapshot, context: any
): Promise<any> {
  if (snap?.exists) {
    const uid: string = snap.id;
    const wallet: any = {
      amount: 0,
      disabled: false,
    };

    return db.collection("user-wallet").doc(uid).set(wallet);
  }
  return;
}
