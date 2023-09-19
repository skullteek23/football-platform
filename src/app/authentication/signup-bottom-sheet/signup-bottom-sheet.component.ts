import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { AnimationService } from '@app/services/animation.service';
import { AuthBaseComponent } from '../auth-base.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthConstants, FormValidations } from '../constants/auth.constant';
import { IConfirmationResult } from '@app/models/common.model';
import { SnackbarService } from '@app/services/snackbar.service';
import { getAuthErrorMsg } from '@app/utils/auth-error-handling-utility';

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
    name: new FormControl(null, [
      Validators.required,
      Validators.minLength(FormValidations.displayName),
    ]),
    phoneNumber: new FormControl(null, [
      Validators.required,
      Validators.maxLength(FormValidations.phone),
      Validators.minLength(FormValidations.phone),
    ]),
    otp: new FormControl(null, [
      Validators.required,
      Validators.maxLength(FormValidations.otp),
      Validators.minLength(FormValidations.otp),
    ]),
  });

  constructor(
    authService: AuthService,
    _bottomSheetRef: MatBottomSheetRef<SignupBottomSheetComponent>,
    router: Router,
    snackbarService: SnackbarService
  ) {
    super(authService, snackbarService, _bottomSheetRef, router);
  }

  ngOnDestroy(): void {
    this.otpSent = false;
  }

  ngAfterViewInit(): void {
    this.initCaptcha(AuthConstants.LOGIN_CAPTCHA_PLACEHOLDER);
  }

  /**
   * Requests otp from backend
   */
  requestSignupOtp() {
    const number =
      AuthConstants.INDIAN_DIAL_CODE +
      this.getControlValue(this.formGroup, 'phoneNumber');

    // Checks if the user already exists
    this.authService
      .checkUserExists(number)
      .then((result) => {
        if (result?.data) {
          alert(this.messages.error.userAlreadyExists);
          this.authService.openLogin();
        } else {
          this.requestOtp(this.formGroup)
            .then((confirmationResult) => {
              this.confirmationResult = confirmationResult;
              this.otpSent = true;
              this.continueBtnDetails.label = 'Continue';
            })
            .catch((error) => {
              this.confirmationResult = null;
              this.otpSent = false;
              this.snackbarService.displayError(getAuthErrorMsg(error));
            });
        }
      })
      .catch((error) => {
        if (error?.message) {
          this.snackbarService.displayError(error?.message);
        }
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
}
