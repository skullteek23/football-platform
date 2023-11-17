import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { AnimationsList } from '@app/services/animation.service';
import { AuthBaseComponent } from '../auth-base.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Constants, IApiError } from '@ballzo-ui/core/common';
import { SnackbarService } from '@app/services/snackbar.service';
import { getAuthErrorMsg, getCloudFnErrorMsg } from '@ballzo-ui/core/utils';
import { BottomSheetService } from '@app/services/bottom-sheet.service';
import { MatInput } from '@angular/material/input';
import { ShowConfirmationService } from '@app/services/show-confirmation.service';
import { SessionStorageService } from '@app/services/session-storage.service';
import { IConfirmationResult } from '@app/models/user.model';
import { FULL_NAME_VALIDATORS, MOBILE_VALIDATORS, OTP_VALIDATORS } from '@app/utils/form-validators-utility';

@Component({
  selector: 'app-signup-bottom-sheet',
  templateUrl: './signup-bottom-sheet.component.html',
  styleUrls: ['./signup-bottom-sheet.component.scss'],
  animations: [AnimationsList.fadeInOutAnimation],
})
export class SignupBottomSheetComponent
  extends AuthBaseComponent
  implements OnDestroy, AfterViewInit {
  readonly captchaContainer = Constants.LOGIN_CAPTCHA_PLACEHOLDER;
  confirmationResult: IConfirmationResult = null;

  formGroup = new FormGroup({
    name: new FormControl(null, FULL_NAME_VALIDATORS),
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
    this.initCaptcha(Constants.LOGIN_CAPTCHA_PLACEHOLDER);
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
      Constants.INDIAN_DIAL_CODE +
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
            .catch((error: IApiError) => {
              this.snackbarService.displayError(getAuthErrorMsg(error));
              this.hideLoader();
              this.confirmationResult = null;
              this.otpSent = false;
              this.phoneNumber?.enable();
            });
        }
      })
      .catch((error: any) => {
        this.snackbarService.displayError(getCloudFnErrorMsg(error));
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
