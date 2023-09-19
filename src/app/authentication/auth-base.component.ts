import { Router } from '@angular/router';
import { AuthMessages } from '@app/constant/app-messages';
import { ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import { AuthService } from './auth.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CanComponentDeactivate } from '@app/guards/confirm-form-closure.guard';
import { FormGroup } from '@angular/forms';
import { IConfirmationResult } from '@app/models/common.model';
import { SnackbarService } from '@app/services/snackbar.service';
import { AuthConstants } from './constants/auth.constant';

export class AuthBaseComponent implements CanComponentDeactivate {
  readonly messages = AuthMessages;

  requestOtpBtnDetails = new ButtonConfig();
  continueBtnDetails = new ButtonConfig();
  otpSent = false;
  isLoaderShown = false;

  constructor(
    protected authService: AuthService,
    protected snackbarService: SnackbarService,
    private _bottomSheetRef: MatBottomSheetRef<any>,
    protected router: Router
  ) {
    this.requestOtpBtnDetails.label = 'Send OTP';
    if (this.authService.isUserLogin()) {
      this.closeSheet('/');
    }
  }

  /**
   * Closes the current sheet and navigate to provided path
   * @param nextPath
   */
  closeSheet(nextPath = '..') {
    if (this._bottomSheetRef?.dismiss) {
      this.router.navigate([nextPath]);
      this._bottomSheetRef.dismiss();
    }
  }

  /**
   * Initializes captcha on bottom sheet open
   * @param containerID
   * @returns
   */
  initCaptcha(containerID: string) {
    if (!containerID) {
      console.log('invalid container ID');
      return;
    }
    this.authService.initCaptcha(containerID);
  }

  /**
   * Triggered when otp is to be requested from backend
   * @param formGroup
   * @returns {Promise<IConfirmationResult>}
   */
  requestOtp(formGroup: FormGroup): Promise<IConfirmationResult> {
    const number = this.getControlValue(formGroup, 'phoneNumber');
    if (number.startsWith(AuthConstants.INDIAN_DIAL_CODE)) {
      return this.authService.sendOtp(number);
    } else {
      return this.authService.sendOtp(AuthConstants.INDIAN_DIAL_CODE + number);
    }
  }

  /**
   * Open login sheet
   */
  openLogin() {
    this.authService.openLogin();
  }

  /**
   * Open signup sheet
   */
  openSignup() {
    this.authService.openSignup();
  }

  /**
   * Verify otp and finish login
   */
  login(formGroup: FormGroup, result: IConfirmationResult) {
    if (!result) {
      console.log('Invalid result! Pls try again.');
      return;
    } else if (!this.getControlValue(formGroup, 'otp')?.trim()) {
      console.log('Invalid otp input! Pls try again.');
      return;
    } else {
      this.showLoader();
      result
        ?.confirm(this.getControlValue(formGroup, 'otp'))
        .then((user) => {
          this.hideLoader();
          this.closeSheet('/');
        })
        .catch((error) => {
          this.hideLoader();
          this.snackbarService.displayCustomMsg(this.messages.error.invalidOtp);
        });
    }
  }

  /**
   * Verify otp and finish signup
   */
  signup(formGroup: FormGroup, result: IConfirmationResult) {
    if (!result) {
      console.log('Invalid result! Pls try again.');
      return;
    } else if (!this.getControlValue(formGroup, 'otp')?.trim()) {
      console.log('Invalid otp input! Pls try again.');
      return;
    } else {
      this.showLoader();
      result
        ?.confirm(this.getControlValue(formGroup, 'otp'))
        .then((user) => {
          this.hideLoader();
          const displayName = this.getControlValue(formGroup, 'name');
          if (displayName) {
            this.authService.updateUserProfile({ displayName });
          }
          this.closeSheet('/');
        })
        .catch((error) => {
          this.hideLoader();
          this.snackbarService.displayCustomMsg(this.messages.error.invalidOtp);
        });
    }
  }

  /**
   * Function to prevent abrupt/accidental closing of login.signup sheet
   * @param nextPath
   * @returns
   */
  canDeactivate(nextPath: string = '..'): boolean | Promise<boolean> {
    if (this.otpSent) {
      const result = confirm(this.messages.hints.leaveConfirm);
      if (result) {
        this.closeSheet(nextPath);
      }
      return result;
    } else {
      this.closeSheet(nextPath);
      return true;
    }
  }

  /**
   * Action to be performed after login
   */
  postLogin() {
    this.router.navigate(['/']);
    this.closeSheet();
  }

  /**
   * Get control value
   * @param formGroup
   * @returns
   */
  getControlValue(formGroup: FormGroup, controlName: string): string {
    const control = formGroup?.get(controlName);
    if (control?.value && String(control?.value)?.trim()) {
      return String(control.value).trim();
    }
    return '';
  }

  /**
   * Condition for disabling the action button
   * @param formGroup
   * @returns
   */
  isDisableFinalBtn(formGroup: FormGroup): boolean {
    return formGroup?.invalid || !formGroup?.dirty;
  }

  /**
   * Shows loader
   */
  showLoader() {
    this.isLoaderShown = true;
  }

  /**
   * Hides loader
   */
  hideLoader() {
    this.isLoaderShown = false;
  }
}
