import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Regex } from '@ballzo-ui/core/common';

export class FormValidations {
  static readonly displayName = {
    min: 3,
    max: 50,
  };
  static readonly phone = 10;
  static readonly otp = 6;
}

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

export function valueNotSameValidator(valueToCompare: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const enteredValue = control.value?.trim();

    if (enteredValue === valueToCompare) {
      return { 'valueSame': true }; // return an error object if the entered value is the same as the value to compare
    }
    return null; // return null if the entered value is different
  };
}
