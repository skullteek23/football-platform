export class GlobalConstants {
  static readonly GET_STARTED = 'Get Started';
  static readonly SHEET_OPEN_OUTLET = 'open';
  static readonly INPUT_NAME = 'input';
  static readonly loginURL = `(${GlobalConstants.SHEET_OPEN_OUTLET}:login)`;
  static readonly signupURL = `(${GlobalConstants.SHEET_OPEN_OUTLET}:signup)`;
}

export class LocalStorageProperties {
  static readonly BOTTOM_SHEET = 'openSheet';
  static readonly USER_UID = 'uid';
}

export class SessionStorageProperties {
  static readonly REDIRECT_URL = 'redirectUrl';
  static readonly USER_POSITION_SELECTION = 'userPositionSelection';
  static readonly USER_GROUND_SELECTION = 'userGroundSelection';
}

export class SnackbarConstants {
  static readonly AUTO_HIDE = 5000; // time in milliseconds
  static readonly HORIZONTAL_POSITION = 'center'; // time in milliseconds
  static readonly VERTICAL_POSITION = 'bottom'; // time in milliseconds
  static readonly DEFAULT_ACTION = 'OK';
}

export enum Position {
  manager = 0,
  striker = 1,
  midfielder = 2,
  defender = 3,
  goalkeeper = 4,
}
