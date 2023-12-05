import * as admin from "firebase-admin";

/**
 * Retrieves users
 * @return {Promise<admin.auth.ListUsersResult>}
 */
export function retrieveUsers(): Promise<any> {
  // [START admin_sdk_auth_list_users]
  // List batch of users, 1000 at a time.
  return admin.auth().listUsers(1000);
}
