import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginBottomSheetComponent } from './login-bottom-sheet.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ButtonsModule } from '@app/shared-modules/buttons/buttons.module';
import { LogoModule } from '@app/shared-modules/logo/logo.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginBottomSheetComponent],
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
  ],
  exports: [LoginBottomSheetComponent],
})
export class LoginBottomSheetModule {}
