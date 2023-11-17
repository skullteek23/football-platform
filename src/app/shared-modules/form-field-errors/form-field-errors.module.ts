import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldErrorsComponent } from './form-field-errors.component';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [FormFieldErrorsComponent],
  imports: [CommonModule, MatFormFieldModule],
  exports: [FormFieldErrorsComponent],
})
export class FormFieldErrorsModule {}
