import {pluck} from "@monsterlessonsacademy/utilities";

/**
 * Check if the user exists with the given phone number
 * @param {any} data
 * @param {any} context
 * @return {Promise<UserRecord>}
 */
export async function checkUserExist(
  data: any, context: any): Promise<any> {
  console.log(pluck([{name: "foo"}, {name: "bar"}], "name"));
  return true;
}
