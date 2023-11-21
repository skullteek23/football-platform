import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
admin.initializeApp();

import {checkUserExist} from "./checkUserExist";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
const REGION = "asia-south1";

// Callable functions
export const userExists = functions
  .region(REGION).https.onCall(checkUserExist);
