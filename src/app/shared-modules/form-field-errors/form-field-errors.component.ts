import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Constants } from '@ballzo-ui/core';
import { CommonFormFieldMessages } from '@app/constant/common-messages';

@Component({
  selector: 'app-form-field-errors',
  templateUrl: './form-field-errors.component.html',
  styleUrls: ['./form-field-errors.component.scss'],
})
export class FormFieldErrorsComponent implements OnInit {
  readonly messages = CommonFormFieldMessages;

  @Input() control: AbstractControl | null = null;
  @Input() inputName: string = Constants.INPUT_NAME;

  constructor() { }

  ngOnInit(): void { }
}
