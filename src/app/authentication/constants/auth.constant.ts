export class AuthConstants {
  static readonly LOGIN_CAPTCHA_PLACEHOLDER = 'recaptcha-container-login';
  static readonly SIGNUP_CAPTCHA_PLACEHOLDER = 'recaptcha-container-signup';
  static readonly INDIAN_DIAL_CODE = '+91';
}
export class FormValidations {
  static readonly displayName = {
    min: 3,
    max: 50,
  };
  static readonly phone = 10;
  static readonly otp = 6;
}
