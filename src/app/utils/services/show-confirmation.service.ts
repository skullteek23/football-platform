import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShowConfirmationService {
  constructor() {}

  /**
   * Opens a native confirm dialog
   * @param message
   * @returns
   */
  openNativeConfirm(message: string) {
    return confirm(message);
  }
}
