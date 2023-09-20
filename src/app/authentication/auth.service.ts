import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { LoginBottomSheetComponent } from '@app/authentication/login-bottom-sheet/login-bottom-sheet.component';
import { Router } from '@angular/router';
import { SignupBottomSheetComponent } from './signup-bottom-sheet/signup-bottom-sheet.component';
import {
  Auth,
  RecaptchaVerifier,
  authState,
  signInWithPhoneNumber,
  signOut,
  updateProfile,
} from '@angular/fire/auth';
import {
  IConfirmationResult,
  IUser,
  IUserProperties,
} from '@app/models/common.model';
import {
  GlobalConstants,
  LocalStorageProperties,
} from '@app/constant/app-constants';
import { AuthConstants } from './constants/auth.constant';
import { SnackbarService } from '@app/services/snackbar.service';
import { AuthMessages } from '@app/constant/app-messages';
import { LocalStorageService } from '@app/services/local-storage.service';
import { SessionStorageService } from '@app/services/session-storage.service';
import { CoreApiService } from '@app/services/core-api.service';
import { HttpsCallableResult } from 'firebase/functions';
import { cloudFunctionNames } from '@app/constant/api-constants';
import { getAuthErrorMsg } from '@app/utils/auth-error-handling-utility';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Firebase related variables
  private captchaVerifier: any = null;

  // User related variables
  private user: IUser = null;
  private user$$ = new Subject<IUser>();

  /**
   * Constructor method
   */
  constructor(
    private sheetService: BottomSheetService,
    private router: Router,
    private snackbarService: SnackbarService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private auth: Auth,
    private coreApiService: CoreApiService
  ) {
    // Subscribe to auth object from backend.
    this.auth.onAuthStateChanged(
      (user) => {
        this.user$$.next(user);
        this.user = user?.uid ? user : null;
        if (this.user?.uid) {
          this.localStorageService.set(
            LocalStorageProperties.USER_UID,
            this.user?.uid
          );
        } else {
          this.localStorageService.remove(LocalStorageProperties.USER_UID);
        }
      },
      (error) => {
        this.snackbarService.displayError(getAuthErrorMsg(error));
      }
    );
  }

  /**
   * Returns user observable
   */
  _user(): Observable<IUser> {
    if (this.auth) {
      return authState(this.auth);
    } else if (this.isUserLogin()) {
      return of(this.user);
    } else {
      return of(null);
    }
  }

  /**
   * Checks whether user is logged in or not
   * @returns
   */
  isUserLogin(): boolean {
    const uid = this.localStorageService.get(LocalStorageProperties.USER_UID);
    return uid?.trim() ? true : false;
  }

  /**
   * Open login sheet using mat bottom sheet
   */
  openLogin() {
    this.router.navigate([
      { outlets: { [GlobalConstants.SHEET_OPEN_OUTLET]: 'login' } },
    ]);
    this.sheetService.openSheet(LoginBottomSheetComponent);
  }

  /**
   * Open signup sheet using mat bottom sheet
   */
  openSignup() {
    this.router.navigate([
      { outlets: { [GlobalConstants.SHEET_OPEN_OUTLET]: 'signup' } },
    ]);
    this.sheetService.openSheet(SignupBottomSheetComponent);
  }

  /**
   * Triggered when user requests OTPs
   */
  initCaptcha(containerID: string) {
    if (!this.auth) {
      console.log('Invalid auth instance!');
      return;
    } else if (this.captchaVerifier) {
      console.log('Captcha is already rendered!');
      return;
    } else {
      this.captchaVerifier = new RecaptchaVerifier(this.auth, containerID, {
        size: 'invisible',
      });
    }
  }

  /**
   * Send otp to user via SMS
   */
  sendOtp(phoneNumber: string): Promise<IConfirmationResult> {
    if (!this.auth) {
      console.log('Invalid auth instance!');
      return Promise.reject(null);
    } else if (!this.captchaVerifier) {
      console.log('Invalid captcha!');
      return Promise.reject(null);
    } else if (
      typeof phoneNumber !== 'string' ||
      !phoneNumber?.startsWith(AuthConstants.INDIAN_DIAL_CODE)
    ) {
      console.log('Invalid phone number');
      return Promise.reject(null);
    } else {
      return this.signup(phoneNumber);
    }
  }

  /**
   * Create user API call to backend
   */
  signup(phoneNumber: string) {
    return signInWithPhoneNumber(this.auth, phoneNumber, this.captchaVerifier);
  }

  /**
   * Logout from the app
   */
  logout() {
    if (this.user) {
      signOut(this.auth)
        .then(() => {
          this.postLogoutActivity();
        })
        .catch((error) => {
          if (error?.message) {
            this.snackbarService.displayError(error?.message);
          } else {
            alert(error);
          }
        });
      this.postLogoutActivity();
    } else {
      this.snackbarService.displayError(AuthMessages.error.signOutError);
      this.postLogoutActivity();
    }
  }

  /**
   * Cleanups and navigation reset after logout
   */
  postLogoutActivity() {
    this.user = null;
    this.localStorageService.clear();
    this.sessionStorageService.clear();
    this.router.navigate(['/']);

    // Close any pending open sheet.
    this.sheetService.closeSheet();
  }

  /**
   * Updates user profile
   * @param updates
   * @returns
   */
  updateUserProfile(updates: IUserProperties): Promise<any> {
    if (this.user) {
      return updateProfile(this.user, updates);
    }
    return Promise.reject(null);
  }

  /**
   * Checks whether user exists or not
   * @param phoneNumber
   */
  checkUserExists(phoneNumber: string): Promise<HttpsCallableResult<any>> {
    return this.coreApiService.callCloudFn(cloudFunctionNames.userExists, {
      phoneNumber,
    });
  }
}
