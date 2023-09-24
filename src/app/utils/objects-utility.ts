/**
 * Check if the value is an enum key
 * @param value
 * @param myEnum
 * @returns {boolean}
 */
export function isEnumKey(value: any, myEnum: any): boolean {
  for (const enumKey in myEnum) {
    if (myEnum.hasOwnProperty(enumKey) && myEnum[enumKey] === value) {
      return true;
    }
  }
  return false;
}
