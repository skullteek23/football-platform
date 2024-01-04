import { Component, OnInit } from '@angular/core';
import { BottomSheetService } from '@app/utils/services/bottom-sheet.service';
import { IconsShareConstants } from './constants/icons-share.constants';

@Component({
  selector: 'app-icons-share',
  templateUrl: './icons-share.component.html',
  styleUrls: ['./icons-share.component.scss']
})
export class IconsShareComponent implements OnInit {

  title: string = IconsShareConstants.title;
  description: string = IconsShareConstants.description;
  shareButtonsInclude: string[] = IconsShareConstants.shareButtonsInclude;

  constructor(
    private sheetService: BottomSheetService
  ) { }

  ngOnInit(): void {
  }

  canDeactivate() {
    this.sheetService.closeSheet();
  }

}
