import { Component, Inject, OnInit, Input } from '@angular/core';
import { BottomSheetService } from '@app/utils/services/bottom-sheet.service';
import { Constants, Player } from '@ballzo-ui/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss']
})
export class PlayersListComponent implements OnInit {

  readonly defaultImg = Constants.DEFAULT_IMG;

  constructor(
    private sheetService: BottomSheetService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public bookedPlayersList: Player[]
  ) { }

  ngOnInit(): void {

  }

  canDeactivate() {
    this.sheetService.closeSheet();
  }

}
