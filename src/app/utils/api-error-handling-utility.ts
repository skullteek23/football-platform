import { ApiMessages, AuthMessages, CommonMessages } from '@app/constant/app-messages';
import { CloudFnErrorCode, CloudStorageErrorCode, IApiError } from '@app/models/common.model';

/**
 * Returns the error message from the auth error
 * @param error
 * @returns
 */
export function getAuthErrorMsg(error: IApiError): string {
  if (error?.code) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return AuthMessages.error.emailAlreadyExists;
      case 'auth/account-exists-with-different-credential':
        return AuthMessages.error.emailAlreadyExists;
      case 'auth/network-request-failed':
        return CommonMessages.error.noInternet;
      case 'auth/invalid-email':
        return AuthMessages.error.incorrectEmail;
      case 'auth/id-token-expired':
        return AuthMessages.error.sessionExpired;
      case 'auth/user-not-found':
        return AuthMessages.error.userNotExist;
      case 'auth/uid-already-exists':
        return AuthMessages.error.userAlreadyExists;
      case 'auth/too-many-requests':
        return AuthMessages.error.tooManyRequests;
      case 'auth/invalid-phone-number':
        return AuthMessages.error.invalidNumber;
      case 'auth/invalid-app-credential':
        return 'Error: Invalid App Credential';
      case 'auth/invalid-verification-code':
        return AuthMessages.error.invalidOtp;
      case 'auth/user-disabled':
        return AuthMessages.error.accountDisabled;
      case 'auth/captcha-check-failed':
        return AuthMessages.error.captchaFailed;
      default:
        return CommonMessages.error.genericError;
    }
  } else if (error?.message) {
    return error.message;
  } else {
    return CommonMessages.error.genericError;
  }
}

/**
 * Returns the error message from the Firestore API error
 * Verified from https://firebase.google.com/docs/reference/js/firestore_#firestoreerrorcode
 * @param error
 * @returns
 */
export function getFirestoreErrorMsg(error: IApiError): string {
  if (error?.code) {
    switch (error.code) {
      case 'cancelled':
        return ApiMessages.error.cancelled;
      case 'unknown':
        return ApiMessages.error.unknown
      case 'deadline-exceeded':
        return ApiMessages.error.deadline;
      case 'not-found':
        return ApiMessages.error.notFound
      case 'already-exists':
        return ApiMessages.error.alreadyExists;
      case 'permission-denied':
        return ApiMessages.error.permissionDenied;
      case 'failed-precondition':
        return ApiMessages.error.failedPrecondition;
      case 'aborted':
        return ApiMessages.error.aborted;
      case 'unimplemented':
        return ApiMessages.error.notSupported;
      case 'internal':
        return ApiMessages.error.internal;
      case 'unavailable':
        return ApiMessages.error.unavailable
      case 'unauthenticated':
        return ApiMessages.error.unauthenticated;

      default:
        return CommonMessages.error.genericError;
    }
  } else {
    return CommonMessages.error.genericError;
  }
}

/**
 * Parses the cloud function error and returns the error message
 * @param error
 * @returns
 */
export function getCloudFnErrorMsg(error: any): string {
  const { code } = JSON.parse(JSON.stringify(error));
  if (code) {
    switch (code as CloudFnErrorCode) {
      case 'functions/not-found':
        return ApiMessages.error.notFound;
      case 'functions/invalid-argument':
        return ApiMessages.error.invalidArgument;
      case 'functions/internal':
        return ApiMessages.error.internal;
      case 'functions/failed-precondition':
        return ApiMessages.error.failedPrecondition;
      case 'functions/permission-denied':
        return ApiMessages.error.permissionDenied;
      case 'functions/unauthenticated':
        return ApiMessages.error.unauthenticated;
      case 'functions/unknown':
        return ApiMessages.error.unknown;
      case 'functions/aborted':
        return ApiMessages.error.aborted;
      case 'functions/already-exists':
        return ApiMessages.error.alreadyExists;
      case 'functions/cancelled':
        return ApiMessages.error.cancelled;
      case 'functions/unimplemented':
        return ApiMessages.error.notSupported;
      case 'functions/deadline-exceeded':
        return ApiMessages.error.deadline;
      case 'functions/resource-exhausted':
        return ApiMessages.error.internal;
      case 'functions/unavailable':
        return ApiMessages.error.unavailable;

      default:
        return ApiMessages.error.somethingWentWrong;
    }
  }
  return ApiMessages.error.somethingWentWrong;
}

/**
 * Returns the error message from the Cloud Storage API error
 * @param error
 * @returns
 */
export function handleStorageError(error: any) {
  const { code } = JSON.parse(JSON.stringify(error));
  if (code) {
    const stripCode = code.replace('storage/', '');
    switch (stripCode as CloudStorageErrorCode) {
      case 'bucket-not-found':
        return ApiMessages.error.notFound;
      case 'invalid-argument':
        return ApiMessages.error.invalidArgument;
      case 'internal-error':
        return ApiMessages.error.internal;
      case 'unauthorized':
        return ApiMessages.error.permissionDenied;
      case 'unauthenticated':
        return ApiMessages.error.unauthenticated;
      case 'unknown':
        return ApiMessages.error.unknown;
      case 'canceled':
        return ApiMessages.error.cancelled;
      case 'invalid-root-operation':
        return ApiMessages.error.notSupported;
      case 'retry-limit-exceeded':
        return ApiMessages.error.deadline;
      case 'quota-exceeded':
        return ApiMessages.error.internal;
      case 'unsupported-environment':
        return ApiMessages.error.unavailable;

      default:
        return ApiMessages.error.somethingWentWrong;
    }
  }
  return ApiMessages.error.somethingWentWrong;
}
