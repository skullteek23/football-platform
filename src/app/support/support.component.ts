import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SupportConstants } from './constants/support.constants';
import { IUploaderOptions } from '@app/shared-modules/custom-file-uploader/models/custom-file-uploader.model';
import { ButtonConfig } from '@app/shared-modules/buttons/models/button.model';
import { SupportService } from './services/support.service';
import { AuthService } from '@app/authentication/auth.service';
import { SnackbarService } from '@app/services/snackbar.service';
import { ResultBoxData, ResultType } from '@app/shared-modules/result-box/models/result-box.model';
import { AnimationsList } from '@app/services/animation.service';
import { Regex } from '@ballzo-ui/core';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.scss'],
  animations: [AnimationsList.fadeAppear]
})
export class SupportComponent implements OnInit {

  readonly MAX_DESCRIPTION_LIMIT = SupportConstants.MAX_DESCRIPTION_LIMIT;
  readonly MAX_SUBJECT_LIMIT = SupportConstants.MAX_SUBJECT_LIMIT;

  isLoaderShown = false;
  supportForm!: FormGroup;
  options = new IUploaderOptions();
  submitBtnDetails = new ButtonConfig();
  referenceId: string = '';
  resultData!: ResultBoxData;
  result: ResultType = ResultType.failure;

  constructor(
    private supportService: SupportService,
    private authService: AuthService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initOptions();
  }

  /**
   * This method is used to initialize the form.
   */
  initForm() {
    this.supportForm = new FormGroup({
      subject: new FormControl(null, [
        Validators.required,
        Validators.maxLength(this.MAX_SUBJECT_LIMIT),
        Validators.pattern(Regex.alphabeticWithNumbersAndSpecialCharacters)
      ]),
      description: new FormControl(null, [
        Validators.required,
        Validators.maxLength(this.MAX_DESCRIPTION_LIMIT),
      ]),
      screenshots: new FormControl(null),
    });
  }

  /**
   * This method is used to initialize the options for the file uploader.
   */
  initOptions() {
    this.options.allowedFormats = SupportConstants.ALLOWED_FORMATS;
    this.options.placeholder = SupportConstants.DEFAULT_PLACEHOLDER;
    this.submitBtnDetails.label = 'Submit';
    this.submitBtnDetails.icon = '';
    this.submitBtnDetails.type = 'submit'
  }

  /**
   * Sets the selected files to the form control.
   * @param files
   */
  selectFile(files: File[]) {
    if (files) {
      this.screenshots?.setValue(files);
    }
  }

  /**
   * Submits the support request.
   * @returns
   */
  submit() {
    if (this.supportForm.invalid) {
      return;
    }
    this.isLoaderShown = true;
    this.authService._user().subscribe(user => {
      if (user?.uid) {
        this.referenceId = this.supportService.getReferenceId();
        this.supportService.submitRequest(this.supportForm.value, user.uid, this.referenceId)
          .then(() => {
            this.supportForm.reset();
            this.createSuccessBoxData();
            this.result = ResultType.success;
            this.isLoaderShown = false;
          })
          .catch((error) => {
            this.createFailureBoxData(error);
            this.screenshots?.reset();
            this.result = ResultType.failure;
            this.isLoaderShown = false;
          })
      }
    })
  }

  /**
   * Creates the data for the result box.
   */
  createSuccessBoxData() {
    this.resultData = new ResultBoxData();
    this.resultData.title = 'Support Request Submitted';
    this.resultData.description = 'Your support request has been submitted successfully. We will get back to you soon.';
    this.resultData.footer = 'Reference ID: ' + this.referenceId;
  }

  /**
   * Creates the failure data for the result box.
   */
  createFailureBoxData(errorDesc: any) {
    this.resultData = new ResultBoxData();
    this.resultData.title = 'Support Request Failed';
    this.resultData.description = errorDesc;
    this.resultData.footer = 'Reference ID: NA';
  }

  /**
   * Getter for the form control.
   */
  get screenshots() {
    return this.supportForm.get('screenshots');
  }

  /**
   * Getter for the form control.
   */
  get subject() {
    return this.supportForm.get('subject');
  }

  /**
   * Getter for the form control.
   */
  get description() {
    return this.supportForm.get('description');
  }
}
