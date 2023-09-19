import { AuthMessages, CommonMessages } from '@app/constant/app-messages';

export function getAuthErrorMsg(error: any): string {
  if (error.message) {
    return error.message;
  } else if (error?.code || error.code === 0) {
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
  } else {
    return CommonMessages.error.genericError;
  }
}
