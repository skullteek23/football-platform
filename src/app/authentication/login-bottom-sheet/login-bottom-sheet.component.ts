import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { AuthBaseComponent } from '../auth-base.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationsList } from '@app/services/animation.service';
import { AuthService } from '../auth.service';
import { AuthConstants } from '../constants/auth.constant';
import { IConfirmationResult } from '@app/models/user.model';
import { SnackbarService } from '@app/services/snackbar.service';
import {
  MOBILE_VALIDATORS,
  OTP_VALIDATORS,
} from '@app/utils/form-validators-utility';
import { BottomSheetService } from '@app/services/bottom-sheet.service';
import { MatInput } from '@angular/material/input';
import { ShowConfirmationService } from '@app/services/show-confirmation.service';
import { SessionStorageService } from '@app/services/session-storage.service';
import { getCloudFnErrorMsg } from '@app/utils/api-error-handling-utility';

@Component({
  selector: 'app-login-bottom-sheet',
  templateUrl: './login-bottom-sheet.component.html',
  styleUrls: ['./login-bottom-sheet.component.scss'],
  animations: [AnimationsList.fadeInOutAnimation],
})
export class LoginBottomSheetComponent
  extends AuthBaseComponent
  implements OnDestroy, AfterViewInit {
  readonly captchaContainer = AuthConstants.LOGIN_CAPTCHA_PLACEHOLDER;
  confirmationResult: IConfirmationResult = null;

  formGroup = new FormGroup({
    phoneNumber: new FormControl(null, MOBILE_VALIDATORS),
    otp: new FormControl(null, OTP_VALIDATORS),
  });

  @ViewChild('firstInputRef', { static: false })
  firstInputRef!: ElementRef<MatInput>;

  constructor(
    authService: AuthService,
    snackbarService: SnackbarService,
    bottomSheetService: BottomSheetService,
    router: Router,
    showConfirmationService: ShowConfirmationService,
    sessionStorageService: SessionStorageService
  ) {
    super(
      authService,
      snackbarService,
      bottomSheetService,
      router,
      showConfirmationService,
      sessionStorageService
    );
  }

  ngOnDestroy(): void {
    this.otpSent = false;
    this.phoneNumber?.enable();
  }

  ngAfterViewInit(): void {
    if (this.firstInputRef?.nativeElement) {
      this.firstInputRef.nativeElement.focus();
    }
    this.initCaptcha(AuthConstants.LOGIN_CAPTCHA_PLACEHOLDER);
  }

  /**
   * Requests otp from backend
   */
  requestLoginOtp() {
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
        if (!result?.data) {
          this.hideLoader();
          alert(this.messages.error.userNotExist);
          this.authService.openSignup();
        } else {
          this.requestOtp(this.formGroup)
            .then((confirmationResult) => {
              this.hideLoader();
              this.confirmationResult = confirmationResult;
              this.otpSent = true;
              this.phoneNumber?.disable();
              this.continueBtnDetails.label = 'Continue';
            })
            .catch(this.handleRequestOtpError.bind(this));
        }
      })
      .catch(this.handleApiError.bind(this));
  }

  /**
   * Handles the error while requesting otp
   * @param error
  */
  handleRequestOtpError(error: any) {
    this.confirmationResult = null;
    this.otpSent = false;
    this.phoneNumber?.enable();
    this.hideLoader();
  }

  /**
   * Handles the error when cloud function returns http error
   * @param error
   */
  handleApiError(error: any) {
    this.hideLoader();
    this.snackbarService.displayError(getCloudFnErrorMsg(error));
    this.confirmationResult = null;
    this.otpSent = false;
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
    return this.formGroup.get('phoneNumber');
  }

  /**
   * Returns the form control otp
   */
  get otp() {
    return this.formGroup.get('otp');
  }
}
