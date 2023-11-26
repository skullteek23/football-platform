import * as admin from "firebase-admin";
const db = admin.firestore();
import {GroundSlot, convertObjectToFirestoreData} from "@ballzo-ui/core";

/**
 * Adds multiple slot in one facility at a time
 * @param {any} data
 * @param {any} context
 * @return {any}
 */
export function addSlot(data: any, context: any): any {
  const batch = db.batch();
  const slots: any[] = [];
  const facility = data.facility;
  const groundId = data.groundId;
  facility.slots.forEach((facilitySlot: any) => {
    const slot = new GroundSlot();
    slot.facilityId = facilitySlot.facilityId;
    slot.groundId = groundId;
    slot.status = 1;
    slot.timestamp = facilitySlot.time;
    slot.participantCount = 0;
    slot.price = facility.price;
    slot.allowedCount = facility.maxPlayers;
    slots.push(slot);
  });
  slots.forEach((slot: any) => {
    batch.create(
      db.collection("slots").doc(), convertObjectToFirestoreData(slot)
    );
  });
  return batch.commit();
}
