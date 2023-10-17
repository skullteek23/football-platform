import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeNumberComponent } from './change-number.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonsModule } from '../buttons/buttons.module';
import { FormFieldErrorsModule } from '../form-field-errors/form-field-errors.module';
import { LoaderModule } from '../loader/loader.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { LogoModule } from '../logo/logo.module';

@NgModule({
  declarations: [
    ChangeNumberComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    ButtonsModule,
    FormFieldErrorsModule,
    LoaderModule,
    MatInputModule,
    MatButtonModule,
    MatDividerModule,
    LogoModule
  ],
  exports: [
    ChangeNumberComponent
  ]
})
export class ChangeNumberModule { }
