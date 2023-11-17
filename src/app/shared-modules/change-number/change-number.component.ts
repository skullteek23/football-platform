import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '@app/authentication/auth.service';
import { AccountMessages, AuthMessages } from '@ballzo-ui/core/common';
import { IUser } from '@app/models/user.model';
import { BottomSheetService } from '@app/services/bottom-sheet.service';
import { ShowConfirmationService } from '@app/services/show-confirmation.service';
import { ButtonConfig } from '../buttons/models/button.model';
import { SnackbarService } from '@app/services/snackbar.service';
import { getAuthErrorMsg, getCloudFnErrorMsg } from '@ballzo-ui/core/utils';
import { Constants } from '@ballzo-ui/core/common';
import { MatInput } from '@angular/material/input';
import { AnimationsList } from '@app/services/animation.service';
import { PhoneAuthProvider } from '@angular/fire/auth';
import { MOBILE_VALIDATORS, valueNotSameValidator, OTP_VALIDATORS } from '@app/utils/form-validators-utility';

@Component({
  selector: 'app-change-number',
  templateUrl: './change-number.component.html',
  styleUrls: ['./change-number.component.scss'],
  animations: [AnimationsList.fadeInOutAnimation],
})
export class ChangeNumberComponent implements OnInit, AfterViewInit {

  readonly messages = AuthMessages;

  user!: IUser;
  numberForm!: FormGroup
  otpSent = false;
  continueBtnDetails = new ButtonConfig();
  requestOtpBtnDetails = new ButtonConfig();
  isLoaderShown = false;
  authProvider!: PhoneAuthProvider;
  verificationId!: string;

  @ViewChild('firstInputRef', { static: false })
  firstInputRef!: ElementRef<MatInput>;

  constructor(
    private authService: AuthService,
    private confirmationService: ShowConfirmationService,
    private sheetService: BottomSheetService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.authService._user().subscribe(user => {
      this.user = user;
      this.initForm();
    });
    this.continueBtnDetails.label = 'Continue';
    this.requestOtpBtnDetails.label = 'Send OTP';
  }

  ngAfterViewInit(): void {
    if (this.firstInputRef?.nativeElement) {
      this.firstInputRef.nativeElement.focus();
    }
    this.initCaptcha(Constants.LOGIN_CAPTCHA_PLACEHOLDER);
    this.authProvider = this.authService.getPhoneAuthProvider();
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
   * Initializes form
   */
  initForm() {
    const currentNumber = this.user?.phoneNumber?.replace(Constants.INDIAN_DIAL_CODE, '');
    this.numberForm = new FormGroup({
      phoneNumber: new FormControl(null, [...MOBILE_VALIDATORS, valueNotSameValidator(currentNumber)]),
      otp: new FormControl(null, OTP_VALIDATORS),
    });
  }

  /**
   * Closes sheet
   */
  canDeactivate() {
    const result = this.confirmationService.openNativeConfirm(AccountMessages.confirmation.changeNumber);
    if (result) {
      this.sheetService.closeSheet();
    }
  }

  /**
   * Returns whether otp button should be disabled
   * @returns
   */
  isDisableSendOtpBtn() {
    if (this.phoneNumber) {
      return this.phoneNumber.invalid;
    }
    return true;
  }

  /**
   * Returns whether final button should be disabled
   */
  isDisableFinalBtn() {
    if (this.numberForm) {
      return this.numberForm.invalid;
    }
    return true;
  }

  /**
   * Changes number
   * @returns
   */
  verifyOtp(): void {
    if (this.isDisableFinalBtn() || !this.authProvider) {
      return;
    }

    const otp = this.otp?.value?.trim() || '';

    if (!otp) {
      console.log('Invalid otp input! Pls try again.');
      return;
    } else {
      this.showLoader();
      const credential = this.authService.getCredential(this.verificationId, otp);
      this.authService._user().subscribe(user => {
        if (user) {
          this.authService.updatePhone(user, credential)
            .then(status => {
              this.hideLoader();
              this.sheetService.closeSheet();
              this.snackbarService.displayCustomMsg(status);
            })
            .catch(error => {
              this.hideLoader();
              this.sheetService.closeSheet();
              this.snackbarService.displayError(error);
            })
        } else {
          window.location.reload();
        }
      })
    }
  }

  /**
   * Requests otp
   */
  sendOtp() {
    if (this.isDisableSendOtpBtn() || !this.authProvider) {
      return;
    }
    this.showLoader();
    const number = Constants.INDIAN_DIAL_CODE + String(this.phoneNumber?.value)?.trim();

    // Checks if the phone number is already registered
    this.authService
      .checkUserExists(number)
      .then(async (result) => {
        if (result?.data) {
          this.hideLoader();
          alert(this.messages.error.numberAlreadyInUse);
        } else {
          // Sends otp
          this.authService.verifyPhoneNumber(number, this.authProvider)
            .then((result) => {
              if (result) {
                this.hideLoader();
                this.verificationId = result;
                this.otpSent = true;
                if (this.phoneNumber) {
                  this.phoneNumber.disable();
                }
                this.continueBtnDetails.label = 'Continue';
              }
            })
            .catch(this.handleRequestOtpError.bind(this))
        }
      })
      .catch(this.handleApiError.bind(this));
  }

  /**
 * Handles the error while requesting otp
 * @param error
*/
  handleRequestOtpError(error: any) {
    this.otpSent = false;
    this.phoneNumber?.enable();
    this.snackbarService.displayError(getAuthErrorMsg(error));
    this.hideLoader();
  }

  /**
   * Handles the error when cloud function returns http error
   * @param error
   */
  handleApiError(error: any) {
    this.hideLoader();
    this.snackbarService.displayError(getCloudFnErrorMsg(error));
    this.otpSent = false;
  }

  /**
   * Edits number
   */
  editNumber() {
    this.otpSent = false;
    this.phoneNumber?.enable();
  }

  showLoader() {
    this.isLoaderShown = true;
  }

  hideLoader() {
    this.isLoaderShown = false;
  }

  /**
   * Gets form control
   */
  get phoneNumber() {
    return this.numberForm.get('phoneNumber');
  }

  /**
   * Gets form control
   */
  get otp() {
    return this.numberForm.get('otp');
  }

}
