import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { GroundsNearMeService } from '@app/grounds-near-me/services/grounds-near-me.service';
import { Ground, GroundAdditionalInfo } from '@ballzo-ui/core';
import { AnimationsList } from '@app/utils/services/animation.service';
import { BottomSheetService } from '@app/utils/services/bottom-sheet.service';
import { GroundService } from '@app/utils/services/ground.service';
import { SnackbarService } from '@app/utils/services/snackbar.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-ground-info',
  templateUrl: './ground-info.component.html',
  styleUrls: ['./ground-info.component.scss'],
  animations: [AnimationsList.sliderSidewayVoid]
})
export class GroundInfoComponent implements OnInit {

  isLoaderShown = false;
  selectedAsset = '';
  index = 0;
  groundInfo = new GroundAdditionalInfo();
  facilityList: string[] = [];

  constructor(
    private sheetService: BottomSheetService,
    private groundService: GroundService,
    private snackbarService: SnackbarService,
    private groundNearMeService: GroundsNearMeService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public ground: Ground
  ) { }

  ngOnInit(): void {
    if (this.ground.imgLinks?.length > 0) {
      this.selectedAsset = this.ground?.imgLinks[0];
    }
    if (this.ground) {
      this.getInfoData();
    }
  }

  /**
   * Gets all other info of the ground
   */
  getInfoData() {
    this.showLoader();
    forkJoin([
      this.groundService.getGroundInfo(this.ground.id),
      this.groundService.getFacilities(this.ground.id)
    ]).subscribe({
      next: (response) => {
        if (response?.length === 2) {
          this.groundInfo = response[0];
          this.facilityList = this.groundNearMeService.parseFacilityData(response[1]);
        }
        this.hideLoader();
      },
      error: (err) => {
        this.groundInfo = new GroundAdditionalInfo();
        this.facilityList = [];
        this.snackbarService.displayError(err);
        this.hideLoader();
      }
    });
  }

  /**
   * Closes sheet
   */
  canDeactivate() {
    this.sheetService.closeSheet();
  }

  /**
   * Sets previous image as selected
   */
  previousImage() {
    if (!this.imagesCount || this.index <= 0) {
      return;
    }
    this.selectedAsset = '';
    setTimeout(() => {
      this.index--;
      this.selectedAsset = this.ground?.imgLinks[this.index];
    });
  }

  /**
   * Sets next image as selected
   */
  nextImage() {
    if (!this.imagesCount || this.index > this.imagesCount - 1) {
      return;
    }

    this.selectedAsset = '';
    setTimeout(() => {
      this.index++;
      this.selectedAsset = this.ground?.imgLinks[this.index];
    });
  }

  /**
   * Opens maps
   */
  openMaps() {
    if (this.ground?.mapLink) {
      window.open(this.ground.mapLink, '_blank');
    }
  }

  /**
   * Shows loader
   */
  showLoader() {
    this.isLoaderShown = true;
  }

  /**
   * Hides loader
   */
  hideLoader() {
    this.isLoaderShown = false;
  }

  /**
   * Returns number of images
   */
  get imagesCount() {
    return this.ground?.imgLinks?.length || 0;
  }
}
