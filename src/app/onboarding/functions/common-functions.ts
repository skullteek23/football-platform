/**
 * Checks if the position is already selected
 */
export function checkPositionAlreadyExists(position: any): boolean {

  if (
    position !== undefined &&
    position !== null &&
    Number(position) >= 0 &&
    Number(position) <= 4
  ) {
    return true;
  }
  return false;
}
