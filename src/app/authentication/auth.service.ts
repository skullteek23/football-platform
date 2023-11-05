import { Injectable, inject } from '@angular/core';
import { Observable, Subject, firstValueFrom, of, switchMap, take } from 'rxjs';
import { BottomSheetService } from '../services/bottom-sheet.service';
import { LoginBottomSheetComponent } from '@app/authentication/login-bottom-sheet/login-bottom-sheet.component';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { SignupBottomSheetComponent } from './signup-bottom-sheet/signup-bottom-sheet.component';
import {
  Auth,
  ConfirmationResult,
  PhoneAuthCredential,
  PhoneAuthProvider,
  RecaptchaVerifier,
  User,
  authState,
  signInWithPhoneNumber,
  signOut,
  updatePhoneNumber,
  updateProfile,
} from '@angular/fire/auth';
import { IUserProperties } from '@ballzo-ui/core/common';
import {
  Constants,
  LocalStorageProperties,
} from '@ballzo-ui/core/common';
import { SnackbarService } from '@app/services/snackbar.service';
import { AuthMessages } from '@ballzo-ui/core/common';
import { LocalStorageService } from '@app/services/local-storage.service';
import { SessionStorageService } from '@app/services/session-storage.service';
import { CoreApiService } from '@app/services/core-api.service';
import { HttpsCallableResult } from 'firebase/functions';
import { cloudFunctionNames } from '@app/constant/api-constants';
import { isEnumKey } from '@ballzo-ui/core/utils';
import { Position } from '@ballzo-ui/core/user';
import { getCloudFnErrorMsg } from '@ballzo-ui/core/utils';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Firebase related variables
  private captchaVerifier: any = null;

  // User related variables
  private user: User | null = null;
  private user$$ = new Subject<User | null>();

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
  _user(): Observable<User | null> {
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
      { outlets: { [Constants.SHEET_OPEN_OUTLET]: 'login' } },
    ]);
    this.sheetService.openSheet(LoginBottomSheetComponent);
  }

  /**
   * Open signup sheet using mat bottom sheet
   */
  openSignup() {
    this.router.navigate([
      { outlets: { [Constants.SHEET_OPEN_OUTLET]: 'signup' } },
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
  sendOtp(phoneNumber: string): Promise<ConfirmationResult> {
    if (!this.auth) {
      console.log('Invalid auth instance!');
      return Promise.reject(null);
    } else if (!this.captchaVerifier) {
      console.log('Invalid captcha!');
      return Promise.reject(null);
    } else if (
      typeof phoneNumber !== 'string' ||
      !phoneNumber?.startsWith(Constants.INDIAN_DIAL_CODE)
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
   * Adds user role by calling cloud function
   * @param role
   */
  setUserRole(role: Position): Promise<any> {
    const data = { role };
    return this.coreApiService.callHttpFunction(cloudFunctionNames.setRole, data)
      .catch(error => this.snackbarService.displayError(getCloudFnErrorMsg(error)));
  }

  /**
   * Checks whether user exists or not
   * @param phoneNumber
   */
  checkUserExists(phoneNumber: string): Promise<HttpsCallableResult<any>> {
    return this.coreApiService.callHttpFunction(cloudFunctionNames.userExists, {
      phoneNumber,
    });
  }

  /**
   * Checks whether user has a role set or not
   */
  async getRole(): Promise<string> {
    if (this.auth) {
      return firstValueFrom(
        this._user().pipe(
          switchMap(
            user => new Promise<string>((resolve, reject) => {
              this.getCustomClaims(user)
                .then(value => resolve(this.parseRole(value)))
                .catch(error => reject('Error: Role not found!'));
            })
          ),
          take(1)
        )
      )
    }
    return Promise.reject(AuthMessages.error.authNotInit);
  }

  /**
   * Returns custom claims of the user
   */
  getCustomClaims(user: User | null): Promise<any> {
    if (user) {
      return user?.getIdTokenResult(true);
    }
    return Promise.resolve(null);
  }

  /**
   * Checks whether user has a role set or not
   */
  parseRole(value?: any): string {
    if (value?.hasOwnProperty('claims') && value.claims.hasOwnProperty('role') && isEnumKey(value.claims.role, Position)) {
      return String(value.claims['role']);
    } else {
      return 'Error: Role not found!';
    }
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
        this.router.navigate(['/m', 'book-match']);
        return false;
      } else {
        return true;
      }
    } else if (data && data === 'booking') {
      if (this.isUserOnboard(role)) {
        return true;
      } else {
        this.router.navigate(['/m', 'onboarding']);
        return false;
      }
    }
    return false;
  }

  /**
   * Updates user phone number
   * @param data
   */
  updateSensitiveUserData(data: any): Promise<any> {
    return this.coreApiService.callHttpFunction(cloudFunctionNames.updateUserProfile, data);
  }

  /**
   * Get phone auth provider
   * @returns {PhoneAuthProvider}
   */
  getPhoneAuthProvider(): PhoneAuthProvider {
    let authInstance = this.auth;

    // Initialize auth instance if not already initialized
    if (!authInstance) {
      authInstance = inject(Auth);
    }
    const provider = new PhoneAuthProvider(authInstance);
    return provider;
  }

  /**
   * Verify phone number by sending otp and returns verification id
   * @param number
   * @returns
   */
  verifyPhoneNumber(number: string, provider: PhoneAuthProvider): Promise<string> {
    // Initialize captcha if not already initialized
    if (!this.captchaVerifier) {
      this.initCaptcha(Constants.LOGIN_CAPTCHA_PLACEHOLDER);
    }

    if (typeof number !== 'string' || !number?.startsWith(Constants.INDIAN_DIAL_CODE)) {
      return Promise.reject(AuthMessages.error.invalidNumber);
    }

    return provider.verifyPhoneNumber(number, this.captchaVerifier);
  }

  /**
   * Get phone auth credential
   * @param code
   * @param verificationId
   * @returns
   */
  getCredential(verificationId: string, code: string): PhoneAuthCredential {
    return PhoneAuthProvider.credential(verificationId, code);
  }

  /**
   * Updates user phone number using firebase SDK
   */
  async updatePhone(user: User, credential: PhoneAuthCredential): Promise<string> {
    if (user) {
      try {
        await updatePhoneNumber(user, credential);
        return Promise.resolve(AuthMessages.success.numberChanged);
      } catch (error) {
        console.log(error);
        return Promise.reject(AuthMessages.error.phoneNotUpdated);
      }
    }
    return Promise.reject(AuthMessages.error.authNotInit);
  }
}

