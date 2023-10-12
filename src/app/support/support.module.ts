import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupportComponent } from './support.component';
import { RouterModule } from '@angular/router';
import { LoaderModule } from '@app/shared-modules/loader/loader.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormFieldErrorsModule } from '@app/shared-modules/form-field-errors/form-field-errors.module';
import { CustomFileUploaderModule } from '@app/shared-modules/custom-file-uploader/custom-file-uploader.module';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';
import { ResultBoxModule } from '@app/shared-modules/result-box/result-box.module';

@NgModule({
  declarations: [SupportComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: SupportComponent }]),
    LoaderModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormFieldErrorsModule,
    CustomFileUploaderModule,
    ButtonsModule,
    ResultBoxModule
  ],
})
export class SupportModule { }
