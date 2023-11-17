import { Component, OnInit } from '@angular/core';
import { CANCELLATION_POLICY_CONTENT } from './constants/cancellation-policy.constants';
import { BottomSheetService } from '@app/services/bottom-sheet.service';

@Component({
  selector: 'app-cancellation-policy',
  templateUrl: './cancellation-policy.component.html',
  styleUrls: ['./cancellation-policy.component.scss']
})
export class CancellationPolicyComponent implements OnInit {

  readonly content = CANCELLATION_POLICY_CONTENT;

  constructor(
    private bottomSheetService: BottomSheetService,
  ) { }

  ngOnInit(): void {
  }

  /**
   * Closes sheet
   */
  closeSheet() {
    this.bottomSheetService.closeSheet();
  }

}
