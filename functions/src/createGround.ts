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

  const ground: any = {};
  ground.name = data.name;
  ground.addressLine = data.addressLine;
  ground.city = data.city;
  ground.state = data.state;
  ground.mapLink = data.mapLink;
  ground.price = {};
  ground.price.weekdays = data.price;
  ground.price.weekends = data.price;
  ground.zip = data.zip;
  ground.status = data.status;
  ground.imgLinks = data.imgLinks;

  const more: any = {};
  more.contactInfo = {};
  more.contactInfo.email = data.contactInfo.email;
  more.contactInfo.name = data.contactInfo.name;
  more.contactInfo.phone = data.contactInfo.phone;
  more.description = data.description;
  more.rules = data.rules;
  more.website = data.website;

  const facilities: any[] = [];
  const slots: any[] = [];

  data.facilities.forEach((facility: any) => {
    const newFacility: any = {};
    newFacility.groundId = groundId;
    newFacility.name = facility.name;
    newFacility.maxPlayers = facility.maxPlayers;
    newFacility.status = facility.status;
    newFacility.id = facility.id;
    facilities.push(newFacility);

    facility.slots.forEach((facilitySlot: any) => {
      const slot: any = {};
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

    batch.create(db.collection("grounds").doc(groundId), ground);
    batch.create(db.collection("ground-additional-info").doc(groundId), more);

    facilities.forEach((facility: any) => {
      batch.create(db.collection("facilities").doc(facility.id), facility);
    });

    slots.forEach((slot: any) => {
      batch.create(db.collection("slots").doc(), slot);
    });

    return batch.commit();
  }

  return false;
}
