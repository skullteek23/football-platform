import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupBottomSheetComponent } from './signup-bottom-sheet.component';
import { LogoModule } from '@app/shared-modules/logo/logo.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldErrorsModule } from '@app/shared-modules/form-field-errors/form-field-errors.module';
import { LoaderModule } from '@app/shared-modules/loader/loader.module';

@NgModule({
  declarations: [SignupBottomSheetComponent],
  imports: [
    CommonModule,
    LogoModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ButtonsModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormFieldErrorsModule,
    LoaderModule,
  ],
  exports: [SignupBottomSheetComponent],
})
export class SignupBottomSheetModule {}
