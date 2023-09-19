import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { AuthBaseComponent } from '../auth-base.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { AnimationService } from '@app/services/animation.service';
import { AuthService } from '../auth.service';
import { AuthConstants, FormValidations } from '../constants/auth.constant';
import { IConfirmationResult } from '@app/models/common.model';
import { SnackbarService } from '@app/services/snackbar.service';
import { getAuthErrorMsg } from '@app/utils/auth-error-handling-utility';

@Component({
  selector: 'app-login-bottom-sheet',
  templateUrl: './login-bottom-sheet.component.html',
  styleUrls: ['./login-bottom-sheet.component.scss'],
  animations: [AnimationService.fadeInOutAnimation],
})
export class LoginBottomSheetComponent
  extends AuthBaseComponent
  implements OnDestroy, AfterViewInit
{
  readonly captchaContainer = AuthConstants.LOGIN_CAPTCHA_PLACEHOLDER;
  confirmationResult: IConfirmationResult = null;

  formGroup = new FormGroup({
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
    _bottomSheetRef: MatBottomSheetRef<LoginBottomSheetComponent>,
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
  requestLoginOtp() {
    const number =
      AuthConstants.INDIAN_DIAL_CODE +
      this.getControlValue(this.formGroup, 'phoneNumber');

    // Checks if the user already exists
    this.authService
      .checkUserExists(number)
      .then((result) => {
        if (!result?.data) {
          alert(this.messages.error.userNotExist);
          this.authService.openSignup();
        } else {
          this.requestOtp(this.formGroup)
            .then((confirmationResult) => {
              this.confirmationResult = confirmationResult;
              this.otpSent = true;
              this.continueBtnDetails.label = 'Continue';
            })
            .catch((error) => {
              console.log(error);
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
      formGroup?.get('phoneNumber')?.invalid ||
      !formGroup?.get('phoneNumber')?.dirty
    );
  }
}
