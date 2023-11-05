import * as admin from "firebase-admin";
const db = admin.firestore();
import {DocumentSnapshot} from "firebase-admin/firestore";
import {Change} from "firebase-functions/lib/common/change";

/**
 * Modifies the slot document when a booking is created, updated or deleted
 * @param {Change<DocumentSnapshot>} change
 * @param {any} context
 * @return {Promise<any>}
 */
export async function modifySlot(
  change: Change<DocumentSnapshot>, context: any
): Promise<any> {
  const before = change.after.exists ? change.after.data() : null;
  const after = change.after.exists ? change.after.data() : null;
  const slotId = after?.slotId || before?.slotId;

  if (!slotId) {
    return true;
  }

  const slot = (await db.collection("slots").doc(slotId).get()).data();
  const slotChanges: any = {};
  let spotCount = 0;

  if (!slot) {
    return true;
  }

  slotChanges.groundId = slot.groundId;
  slotChanges.facilityId = slot.facilityId;
  slotChanges.timestamp = slot.timestamp;
  slotChanges.price = slot.price;
  slotChanges.status = slot.status;
  slotChanges.allowedCount = slot.allowedCount;
  slotChanges.participantCount = slot.participantCount;

  if (!before && after?.slotId) {
    // Case when booking is created
    spotCount = after.spots;
  } else if (before?.slotId && !after) {
    // Case when booking is deleted
    spotCount = before.spots * -1;
  } else if (before?.slotId && after?.slotId) {
    // Case when booking is updated
    // spot can be added or removed, but after.spots cannot be 0
    spotCount = after.spots - before.spots;
  }

  const newCount = slotChanges.participantCount + Number(spotCount);
  if (newCount <= slotChanges.allowedCount) {
    slotChanges.participantCount = newCount;
  }
  if (slotChanges.participantCount >= slotChanges.allowedCount) {
    slotChanges.status = "booked";
  }

  return db.collection("slots").doc(slotId).update({
    ...slotChanges,
  });
}
