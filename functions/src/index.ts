import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
admin.initializeApp();

import {checkUserExist} from "./checkUserExist";
import {updateUserRole} from "./updateUserRole";
import {updateProfile} from "./updateProfile";
import {walletCreation} from "./createWallet";
import {orderCancellation} from "./orderCancellation";
import {createRazorpayOrder} from "./createRazorpayOrder";
import {modifySlot} from "./modifySlot";
import {groundCreation} from "./createGround";
import {addSlot} from "./addSlot";
import {bookingCreation} from "./bookingCreation";
import {retrieveUsers} from "./retrieveUsers";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const REGION = "asia-south1";

// Callable functions
export const userExists = functions
  .region(REGION).https.onCall(checkUserExist);
export const setRole = functions
  .region(REGION).https.onCall(updateUserRole);
export const returnOrder = functions
  .region(REGION).https.onCall(orderCancellation);
export const updateUserProfile = functions
  .region(REGION).https.onCall(updateProfile);
export const createOrder = functions
  .region(REGION).https.onCall(createRazorpayOrder);
export const createGround = functions
  .region(REGION).https.onCall(groundCreation);
export const addNewSlot = functions
  .region(REGION).https.onCall(addSlot);
export const createBooking = functions
  .region(REGION).https.onCall(bookingCreation);
export const getUsers = functions
  .region(REGION).https.onCall(retrieveUsers);


// Background Triggered functions
export const updateSlot = functions
  .region(REGION).firestore.document("bookings/{bookingId}")
  .onWrite(modifySlot);
export const createWallet = functions
  .region(REGION).auth.user()
  .onCreate(walletCreation);
