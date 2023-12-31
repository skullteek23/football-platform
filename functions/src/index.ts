import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
admin.initializeApp();

import {checkUserExist} from "./checkUserExist";
import {updateProfile} from "./updateProfile";
import {profileCreation} from "./createProfile";
import {refundOrder} from "./refundOrder";
import {modifySlot} from "./modifySlot";
import {bookingCreation} from "./bookingCreation";
import {generateRzOrder} from "./generateRzOrder";
import {paymentVerification} from "./paymentVerification";
import {updateAuthProfile} from "./updateAuthProfile";
import {deleteAuthProfile} from "./deleteAuthProfile";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const REGION = "asia-south1";

// Callable functions
export const userExists = functions
  .region(REGION).https.onCall(checkUserExist);
export const returnOrder = functions
  .region(REGION).https.onCall(refundOrder);
export const updateUserProfile = functions
  .region(REGION).https.onCall(updateProfile);
export const createOrder = functions
  .region(REGION).https.onCall(generateRzOrder);
export const verifyPayment = functions
  .region(REGION).https.onCall(paymentVerification);
export const createBooking = functions
  .region(REGION).https.onCall(bookingCreation);
export const createProfile = functions
  .region(REGION).https.onCall(profileCreation);

// Background Triggered functions
export const updateSlot = functions
  .region(REGION).firestore.document("bookings/{bookingId}")
  .onWrite(modifySlot);
export const updateName = functions
  .region(REGION).firestore.document("players/{playerId}")
  .onUpdate(updateAuthProfile);
export const deleteUser = functions
  .region(REGION).firestore.document("players/{playerId}")
  .onDelete(deleteAuthProfile);
