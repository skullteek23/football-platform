import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of } from 'rxjs';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { LoginBottomSheetComponent } from '@app/authentication/login-bottom-sheet/login-bottom-sheet.component';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SignupBottomSheetComponent } from './signup-bottom-sheet/signup-bottom-sheet.component';
import {
  Auth,
  IdTokenResult,
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
  Position,
  SessionStorageProperties,
} from '@app/constant/app-constants';
import { AuthConstants } from './constants/auth.constant';
import { SnackbarService } from '@app/services/snackbar.service';
import { AuthMessages } from '@app/constant/app-messages';
import { LocalStorageService } from '@app/services/local-storage.service';
import { SessionStorageService } from '@app/services/session-storage.service';
import { CoreApiService } from '@app/services/core-api.service';
import { HttpsCallableResult } from 'firebase/functions';
import { cloudFunctionNames } from '@app/constant/api-constants';
import { isEnumKey } from '@app/utils/objects-utility';

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
    try {
      this.auth.onAuthStateChanged((user) => {
        if (user?.uid) {
          // Logged in state
          this.localStorageService.set(
            LocalStorageProperties.USER_UID,
            user?.uid
          );
          this.user = user;
        } else {
          // Logged out state
          this.localStorageService.remove(LocalStorageProperties.USER_UID);
          this.user = null;
        }
        this.user$$.next(this.user);
      });
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Returns user observable
   */
  _user(): Observable<IUser> {
    if (this.auth) {
      return authState(this.auth).pipe(
        catchError((error) => {
          return of(null);
        })
      );
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
          this.snackbarService.displayCustomMsg(AuthMessages.success.logout);
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
    return this.coreApiService.callBackendFn(cloudFunctionNames.userExists, {
      phoneNumber,
    });
  }

  /**
   * Checks whether user has a role set or not
   */
  async getRole(): Promise<Number> {
    if (this.auth) {
      const result = await this.auth?.currentUser?.getIdTokenResult(true);
      if (result?.hasOwnProperty('claims') && result.claims.hasOwnProperty('role')) {
        return Number(result.claims['role']);
      }
      return Promise.resolve(-1);
    }
    return Promise.reject('Error: Auth not initialized');
  }

  /**
 * Returns true if user is onboard
 * @param value
 * @returns
 */
  isUserOnboard(value: any): boolean {
    return isEnumKey(value, Position);
  }

  /**
   * Resolves the asynchronous onboarding
   * @param route
   * @returns
   */
  async resolveOnboarding(route: ActivatedRouteSnapshot): Promise<boolean> {
    const role = await this.getRole();
    const data = route?.data?.hasOwnProperty('destination') ? route.data['destination'] : null;
    if (data && data === 'onboarding') {
      if (this.isUserOnboard(role)) {
        this.router.navigate(['/main', 'book-match']);
        return false;
      } else {
        return true;
      }
    } else if (data && data === 'booking') {
      if (this.isUserOnboard(role)) {
        return true;
      } else {
        this.router.navigate(['/main', 'onboarding']);
        return false;
      }
    }
    return false;
  }
}
