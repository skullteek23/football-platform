import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
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

export function valueNotSameValidator(valueToCompare: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const enteredValue = control.value?.trim();

    if (enteredValue === valueToCompare) {
      return { 'valueSame': true }; // return an error object if the entered value is the same as the value to compare
    }
    return null; // return null if the entered value is different
  };
}
