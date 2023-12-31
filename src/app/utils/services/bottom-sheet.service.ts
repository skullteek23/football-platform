import { Injectable } from '@angular/core';
import {
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { LocalStorageService } from './local-storage.service';
import { LocalStorageProperties } from '@ballzo-ui/core';

@Injectable({
  providedIn: 'root',
})
export class BottomSheetService {
  private configDefault = new MatBottomSheetConfig();
  private sheetRef!: MatBottomSheetRef;

  constructor(
    private _bottomSheet: MatBottomSheet,
    private localStorageService: LocalStorageService
  ) {
    this.configDefault.disableClose = true;
    this.configDefault.hasBackdrop = true;
    this.configDefault.backdropClass = 'sheet-backdrop';
    this.configDefault.panelClass = 'sheet-custom';
  }

  /**
   * Open any provided component bottom sheet
   * @param component
   * @param config
   */
  openSheet(component: any, config = this.configDefault): MatBottomSheetRef {
    this.sheetRef = this._bottomSheet.open(component, config);
    this.localStorageService.set(LocalStorageProperties.BOTTOM_SHEET, true);
    return this.sheetRef;
  }

  /**
   * Closes the currently opened bottom sheet
   * @returns {boolean}
   */
  closeSheet(): boolean {
    if (this.sheetRef) {
      this.sheetRef.dismiss();
      this.localStorageService.set(LocalStorageProperties.BOTTOM_SHEET, false);
      return true;
    }
    return false;
  }
}
