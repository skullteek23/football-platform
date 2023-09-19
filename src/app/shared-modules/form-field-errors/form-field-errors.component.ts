import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { GlobalConstants } from '@app/constant/app-constants';
import { CommonFormFieldMessages } from '@app/constant/app-messages';

@Component({
  selector: 'app-form-field-errors',
  templateUrl: './form-field-errors.component.html',
  styleUrls: ['./form-field-errors.component.scss'],
})
export class FormFieldErrorsComponent implements OnInit {
  readonly messages = CommonFormFieldMessages;

  @Input() control: AbstractControl | null = null;
  @Input() inputName: string = GlobalConstants.INPUT_NAME;

  constructor() {}

  ngOnInit(): void {}
}
