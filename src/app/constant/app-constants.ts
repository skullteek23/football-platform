export class Constants {
  static readonly GET_STARTED = 'Get Started';
  static readonly SHEET_OPEN_OUTLET = 'open';
  static readonly INPUT_NAME = 'input';
  static readonly NOT_AVAILABLE = 'N/A';
  static readonly loginURL = `(${Constants.SHEET_OPEN_OUTLET}:login)`;
  static readonly signupURL = `(${Constants.SHEET_OPEN_OUTLET}:signup)`;
  static readonly RUPEE_SYMBOL = '₹';
  static readonly PLACEHOLDER_ARRAY = [1, 2, 3, 4];
  static readonly DEFAULT_FACILITY_MAX_PLAYER_LIMIT = 22;
  static readonly DEFAULT_FACILITY_ALLOWED_PLAYER_LIMIT = Constants.DEFAULT_FACILITY_MAX_PLAYER_LIMIT;
  static readonly DEFAULT_SLOT_PRICE = 50;
  static readonly FILE_NAME_SEPARATOR = '-';
  static readonly DATE_TIME_FORMATS = {
    format_1: 'dd EEE', // 8 Sat
    format_2: 'd MMM, y', // 14 Aug, 2021
    format_3: 'h:mm a', // 8:03 PM
  };
  static readonly NUMBER_FORMATS = {
    format_1: '1.0-0', // 3.6 -> 4
  };
  static readonly SEVEN_MINUTES_IN_MILLISECONDS = 420000;
  static readonly ORDER_PREFIX = 'OD';
  static readonly ORDER_PREFIX_UI = 'Order #' + Constants.ORDER_PREFIX;
  static readonly DAY_TIMES = {
    morning: 'Morning',
    afternoon: 'Afternoon',
    evening: 'Evening',
    night: 'Night',
  };
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
  static readonly AUTO_HIDE = 3000; // time in milliseconds
  static readonly HORIZONTAL_POSITION = 'center'; // time in milliseconds
  static readonly VERTICAL_POSITION = 'bottom'; // time in milliseconds
  static readonly DEFAULT_ACTION = 'OK';
}
