import * as functions from "firebase-functions";

/**
 * Check if all the keys exist in the data object
 * @param {any} data
 * @param {string[]} parameters
 * @return {string}
 */
export function checkKeysExist(data: any, parameters: string[]): string {
  if (!data) {
    return "data property is missing.";
  } else if (!parameters.length) {
    return "";
  } else {
    for (let index = 0; index < parameters.length; index++) {
      if (
        !Object.prototype.hasOwnProperty.call(data, parameters[index]) ||
        (Object.prototype.hasOwnProperty.call(data, parameters[index]) &&
          (data[parameters[index]] === undefined ||
            data[parameters[index]] === null))
      ) {
        return parameters[index];
      }
    }
    return "";
  }
}

/**
 * Check if the request is authenticated
 * @param {any} context
 * @return {boolean}
 */
export function isRequestAuthenticated(context: any): boolean {
  if (!context?.auth) {
    return false;
  }
  return false;
}

/**
 * Perform error handling for a callable function
 * @param {any} func
 * @return {functions.HttpsFunction}
 */
export function withErrorHandling(
  func: (data: any, context: functions.https.CallableContext) => any
): functions.HttpsFunction {
  return functions.region("asia-south1").https.onCall(async (data, context) => {
    try {
      // Call the provided function and pass required keys
      return await func(data, context);
    } catch (error: any) {
      // Handle other errors here
      console.error("Error:", error);
      if (error.message === "INTERNAL") {
        throw new functions.https.HttpsError(
          "internal",
          "Internal server error"
        );
      } else {
        // Rethrow the error to propagate it to the client
        throw error;
      }
    }
  });
}
