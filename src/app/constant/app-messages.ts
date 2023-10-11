export const HomeMessages = {
  success: {
    refreshPage: 'Bookings refreshed!',
  },
  error: {
    noBooking: 'Bookings will appear here.',
  },
  title: {},
};
export const AuthMessages = {
  success: {
    logout: 'Logged out successfully!',
  },
  hints: {
    otpSent: 'OTP sent successfully!',
    leaveConfirm: 'Are you sure you want to leave?',
    loginToContinue: 'Please login to continue.',
  },
  error: {
    invalidOtp: 'Error! OTP is invalid.',
    invalidNumber: 'Error! Phone Number is invalid.',
    signOutError: 'Error! Unable to logout.',
    alreadySignOut: 'You are already signed out.',
    userNotExist: 'User not registered! Please create an account.',
    userAlreadyExists:
      'Phone number is already in use. Please login to continue.',
    tooManyRequests: 'Too many requests! Please try again later.',
    incorrectPassword: 'Incorrect password! Please try again.',
    weakPassword: 'Password too weak! Please try another one.',
    incorrectEmail: 'Incorrect email! Please try again.',
    emailAlreadyExists: 'Email already registered! Please try another one.',
    sessionExpired: 'Session Expired! Please login again.',
    accountDisabled: 'Account disabled! Please contact admin.',
    captchaFailed: 'Captcha failed! Please try again.',
  },
};

export const ApiMessages = {
  error: {
    cancelled: 'Operation cancelled! Please try again.',
    unknown: 'Unknown error occurred! Please try again.',
    deadline: 'Operation timed out! Please try again.',
    alreadyExists: 'Already exists! Please try again.',
    notFound: 'Not found! Please try again.',
    failedPrecondition: 'Condition failed! Please contact admin.',
    aborted: 'Operation aborted by system! Please try again.',
    internal: 'Internal error! Please try again later.',
    permissionDenied: 'Permission denied! Please try again.',
    notSupported: 'Operation not supported! Please try again.',
    unavailable: 'Service unavailable! Please try again.',
    unauthenticated: 'Invalid credentials! Please try again.',
    somethingWentWrong: 'Something went wrong! Please try again.',
  }
}

export const CommonMessages = {
  error: {
    genericError: 'Error Occurred! Please try again later.',
    noInternet: 'Please check your internet connection',
  },
};

export const CommonFormFieldMessages = {
  error: {
    required: 'This field is required',
    maxlength: 'Maximum length exceeded',
    minlength: 'Minimum length required',
    pattern: 'Invalid ',
  },
};

export const PositionSelectionMessages = {
  tip: {
    player: 'Tip: Player can book a slot only for themselves.',
    manager: 'Tip: Manager can book a slot for the team or other players.',
  },
};

export const OrderMessages = {
  success: {
    invoice: 'Invoice sent successfully to your mail ID!',
  },
  error: {
    invoice: 'Error! Unable to send invoice.',
    emailNotRegistered: 'Email not registered! Please try again.',
  },
  booking: {
    thankYou: 'Thank you for your booking!',
    thankYouNote: 'Get ready to score goals and make memories on the field - see you at the game!',
  }
}

export const GroundSelectionMessages = {
  error: {
    noSlots: 'No slots are available!',
    noGrounds: 'No grounds are available!',
    slotError: 'Error! Unable to fetch slots.',
  }
}

export const PaymentMessages = {
  success: 'Payment successful!',
  error: {
    slotFull: 'Slot is full! Please try another one.',
  }
}

export const PlayerListMessages = {
  error: {
    noBookings: 'No bookings yet!',
  }
}

export const AccountMessages = {
  success: {
    roleChange: 'Congrats! You are now a Manager.',
  },
  confirmation: {
    logout: 'Are you sure you want to logout?',
    becomeManager: 'Are you sure you want to become a Manager?'
  }
}
