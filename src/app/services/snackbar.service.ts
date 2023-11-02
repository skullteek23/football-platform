import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarConstants } from '@ballzo-ui/core/common';
import { CommonMessages } from '@ballzo-ui/core/common';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private matSnack: MatSnackBar) {}

  /**
   * Display custom message
   * @param message
   * @param isError
   * @returns
   */
  displayCustomMsg(message: string, isError = false): void {
    if (message === null || message === '') {
      return;
    }
    const config = new MatSnackBarConfig();
    config.verticalPosition = SnackbarConstants.VERTICAL_POSITION;
    config.horizontalPosition = SnackbarConstants.HORIZONTAL_POSITION;
    config.duration = SnackbarConstants.AUTO_HIDE;
    config.panelClass = isError
      ? 'error-class-snackbar'
      : 'success-class-snackbar';
    const action = isError ? undefined : SnackbarConstants.DEFAULT_ACTION;
    this.matSnack.open(message, action, config);
  }

  /**
   * Display error message
   * @param errorMessage
   */
  displayError(errorMessage?: string): void {
    if (
      errorMessage === undefined ||
      errorMessage === null ||
      errorMessage === ''
    ) {
      errorMessage = CommonMessages.error.genericError;
    }
    this.displayCustomMsg(errorMessage, true);
  }
}
