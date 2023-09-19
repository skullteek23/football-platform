import { Validators } from '@angular/forms';
import { FormValidations } from '@app/authentication/constants/auth.constant';
import { Regex } from '@app/constant/regex-constants';

export const FULL_NAME_VALIDATORS = [
  Validators.required,
  Validators.minLength(FormValidations.displayName.min),
  Validators.maxLength(FormValidations.displayName.max),
  Validators.pattern(Regex.alphabeticAndSpace),
];

export const MOBILE_VALIDATORS = [
  Validators.required,
  Validators.minLength(FormValidations.phone),
  Validators.maxLength(FormValidations.phone),
  Validators.pattern(Regex.customNumericMobileNumber),
];

export const OTP_VALIDATORS = [
  Validators.required,
  Validators.pattern(Regex.customNumericOtp),
];
