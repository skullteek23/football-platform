export class Regex {
  static readonly alphabeticAndSpace = /^[A-Za-z\s]+$/;
  static readonly alphanumeric = /^[A-Za-z0-9]+$/;
  static readonly alphanumericAndSpace = /^[A-Za-z0-9\s]+$/;
  static readonly alphabeticWithNumbersAndSpecialCharacters =
    /^[A-Za-z0-9\s\.\;\-]+$/;
  static readonly alphanumericWithSpecialCharacters = /^[A-Za-z0-9\.\,\-]+$/;
  static readonly alphanumericWithSpecialCharactersAndSpace =
    /^[A-Za-z0-9\.\,\-\s]+$/;
  static readonly customNumericMobileNumber = /^[1-9][0-9]{9}$/;
  static readonly customNumericOtp = /^[0-9]{6}$/;
}
