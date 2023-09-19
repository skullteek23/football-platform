import * as admin from "firebase-admin";
admin.initializeApp();

import {withErrorHandling} from "./functions-utils";
import {checkUserExist} from "./checkUserExist";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// Callable functions
export const userExists = withErrorHandling(checkUserExist);
