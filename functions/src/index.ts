import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
admin.initializeApp();

// import {withErrorHandling} from "./functions-utils";
import {checkUserExist} from "./checkUserExist";
import {updateUserRole} from "./updateUserRole";
import {updateProfile} from "./updateProfile";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const REGION = "asia-south1";

// Callable functions
export const userExists = functions.region(REGION).https.onCall(checkUserExist);
export const setRole = functions.region(REGION).https.onCall(updateUserRole);
export const updateUserProfile = functions
  .region(REGION).https.onCall(updateProfile);
