import * as functions from "firebase-functions";

/**
 * Check if all the keys exist in the data object
 * @param {any} data
 * @param {string[]} parameters
 * @return {string}
 */
export function checkKeysExist(data: any, parameters: string[]): string {
  if (!data) {
    return "unknown";
  } else if (!parameters.length) {
    return "";
  } else {
    for (let index = 0; index < parameters.length; index++) {
      const parameter = parameters[index];
      if (
        !Object.prototype.hasOwnProperty.call(data, parameter) ||
        (Object.prototype.hasOwnProperty.call(data, parameter) &&
          (data[parameter] === undefined ||
            data[parameter] === null))
      ) {
        return parameter;
      }
    }
    return "";
  }
}

/**
 * Check if at least one of the keys exist in the data object
 * @param {any} data
 * @param {string[]} parameters
 * @return {string}
 */
export function checkSomeKeysExist(data: any, parameters: string[]): string {
  if (!data) {
    return "one";
  } else if (!parameters.length) {
    return "one";
  } else {
    const result = parameters.some((parameter) => {
      if (
        !Object.prototype.hasOwnProperty.call(data, parameter) ||
        (Object.prototype.hasOwnProperty.call(data, parameter) &&
          (data[parameter] === undefined ||
            data[parameter] === null))
      ) {
        return true;
      } else {
        return false;
      }
    });

    return result ? "" : "one";
  }
}

/**
 * Check if the request is authenticated
 * @param {any} context
 * @return {boolean}
 */
export function isRequestAuthenticated(
  context: functions.https.CallableContext
): boolean {
  if (context?.auth?.uid) {
    return true;
  }
  return false;
}
