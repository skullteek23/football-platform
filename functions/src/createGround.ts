import {
  Ground,
  GroundAdditionalInfo,
  GroundFacility,
  GroundSlot,
  convertObjectToFirestoreData,
} from "@ballzo-ui/core";
import * as admin from "firebase-admin";
const db = admin.firestore();

/**
 * Creates ground
 * @param {any} data
 * @param {any} context
 * @return {Promise<any>}
 */
export async function groundCreation(data: any, context: any): Promise<any> {
  const groundId = data.groundId;

  const ground = new Ground();
  ground.name = data.name;
  ground.addressLine = data.addressLine;
  ground.city = data.city;
  ground.state = data.state;
  ground.mapLink = data.mapLink;
  ground.price.weekdays = data.price;
  ground.price.weekends = data.price;
  ground.zip = data.zip;
  ground.status = data.status;
  ground.imgLinks = data.imgLinks;

  const more = new GroundAdditionalInfo();
  more.contactInfo.email = data.contactInfo.email;
  more.contactInfo.name = data.contactInfo.name;
  more.contactInfo.phone = data.contactInfo.phone;
  more.description = data.description;
  more.rules = data.rules;
  more.website = data.website;

  const facilities: GroundFacility[] = [];
  const slots: GroundSlot[] = [];

  data.facilities.forEach((facility: any) => {
    const newFacility = new GroundFacility();
    newFacility.groundId = groundId;
    newFacility.name = facility.name;
    newFacility.maxPlayers = facility.maxPlayers;
    newFacility.status = facility.status;
    newFacility.id = facility.id;
    facilities.push(newFacility);

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
  });


  if (slots.length && facilities.length && ground && more) {
    const batch = db.batch();

    batch.create(
      db.collection("grounds").doc(groundId),
      convertObjectToFirestoreData(ground)
    );
    batch.create(
      db.collection("ground-additional-info").doc(groundId),
      convertObjectToFirestoreData(more)
    );

    facilities.forEach((facility: any) => {
      batch.create(
        db.collection("facilities").doc(facility.id),
        convertObjectToFirestoreData(facility)
      );
    });

    slots.forEach((slot: any) => {
      batch.create(
        db.collection("slots").doc(),
        convertObjectToFirestoreData(slot)
      );
    });

    return batch.commit();
  }

  return false;
}
