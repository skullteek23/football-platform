import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AnimationService } from '@app/services/animation.service';
import { AuthBaseComponent } from '../auth-base.component';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthConstants } from '../constants/auth.constant';
import { IAuthError, IConfirmationResult } from '@app/models/common.model';
import { SnackbarService } from '@app/services/snackbar.service';
import { getAuthErrorMsg } from '@app/utils/auth-error-handling-utility';
import {
  FULL_NAME_VALIDATORS,
  MOBILE_VALIDATORS,
  OTP_VALIDATORS,
} from '@app/utils/form-validators-utility';
import { BottomSheetService } from '@app/services/bottom-sheet.service';

@Component({
  selector: 'app-signup-bottom-sheet',
  templateUrl: './signup-bottom-sheet.component.html',
  styleUrls: ['./signup-bottom-sheet.component.scss'],
  animations: [AnimationService.fadeInOutAnimation],
})
export class SignupBottomSheetComponent
  extends AuthBaseComponent
  implements OnDestroy, AfterViewInit
{
  readonly captchaContainer = AuthConstants.LOGIN_CAPTCHA_PLACEHOLDER;
  confirmationResult: IConfirmationResult = null;

  formGroup = new FormGroup({
    name: new FormControl(null, FULL_NAME_VALIDATORS),
    phoneNumber: new FormControl(null, MOBILE_VALIDATORS),
    otp: new FormControl(null, OTP_VALIDATORS),
  });

  constructor(
    authService: AuthService,
    snackbarService: SnackbarService,
    bottomSheetService: BottomSheetService,
    router: Router
  ) {
    super(authService, snackbarService, bottomSheetService, router);
  }

  ngOnDestroy(): void {
    this.otpSent = false;
    this.phoneNumber?.enable();
  }

  ngAfterViewInit(): void {
    this.initCaptcha(AuthConstants.LOGIN_CAPTCHA_PLACEHOLDER);
  }

  /**
   * Requests otp from backend
   */
  requestSignupOtp() {
    if (this.isDisableSendOtpBtn(this.formGroup)) {
      return;
    }
    this.showLoader();
    const number =
      AuthConstants.INDIAN_DIAL_CODE +
      this.getControlValue(this.formGroup, 'phoneNumber');

    // Checks if the user already exists
    this.authService
      .checkUserExists(number)
      .then((result) => {
        if (result?.data) {
          this.hideLoader();
          alert(this.messages.error.userAlreadyExists);
          this.authService.openLogin();
        } else {
          this.requestOtp(this.formGroup)
            .then((confirmationResult) => {
              this.hideLoader();
              this.confirmationResult = confirmationResult;
              this.otpSent = true;
              this.phoneNumber?.disable();
              this.continueBtnDetails.label = 'Continue';
            })
            .catch((error: IAuthError) => {
              this.snackbarService.displayError(getAuthErrorMsg(error));
              this.hideLoader();
              this.confirmationResult = null;
              this.otpSent = false;
              this.phoneNumber?.enable();
            });
        }
      })
      .catch((error: IAuthError) => {
        this.snackbarService.displayError(getAuthErrorMsg(error));
        this.hideLoader();
        this.phoneNumber?.enable();
      });
  }

  /**
   * Condition for disabling the action button
   * @param formGroup
   * @returns
   */
  isDisableSendOtpBtn(formGroup: FormGroup): boolean {
    return (
      formGroup?.get('name')?.invalid ||
      formGroup?.get('phoneNumber')?.invalid ||
      !formGroup?.get('name')?.dirty ||
      !formGroup?.get('phoneNumber')?.dirty
    );
  }

  /**
   * Triggered when user wants to change the phone number after otp is sent
   */
  editNumber() {
    this.otpSent = false;
    this.phoneNumber?.enable();
  }

  /**
   * Returns the form control phoneNumber
   */
  get phoneNumber() {
    return this.formGroup?.get('phoneNumber');
  }

  /**
   * Returns the form control otp
   */
  get otp() {
    return this.formGroup?.get('otp');
  }

  /**
   * Returns the form control name
   */
  get name() {
    return this.formGroup?.get('name');
  }
}
