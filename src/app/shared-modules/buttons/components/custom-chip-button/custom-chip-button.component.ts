import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IListOption } from '@app/models/common.model';
import { AnimationsList } from '@app/services/animation.service';

@Component({
  selector: 'app-custom-chip-button',
  templateUrl: './custom-chip-button.component.html',
  styleUrls: ['./custom-chip-button.component.scss'],
  animations: [AnimationsList.fadeAppearSideways],
})
export class CustomChipButtonComponent implements OnInit {
  @Input() chipsData: IListOption[] = [];
  @Input() panelClass!: string;
  @Input() selectable = true;
  @Input() disabled = false;
  @Input() selectedChip!: IListOption;
  @Output() selectionChange = new EventEmitter<IListOption>();


  constructor() { }

  ngOnInit(): void { }

  /**
   * Sets the selected chip
   * @param chip
   */
  selectChip(chip: IListOption) {
    if (chip) {
      this.selectedChip = chip;
      this.selectionChange.emit(chip);
    }
  }
}
