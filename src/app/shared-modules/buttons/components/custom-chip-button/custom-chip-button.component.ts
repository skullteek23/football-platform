import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnimationsList } from '@app/services/animation.service';

@Component({
  selector: 'app-custom-chip-button',
  templateUrl: './custom-chip-button.component.html',
  styleUrls: ['./custom-chip-button.component.scss'],
  animations: [AnimationsList.fadeAppearSideways],
})
export class CustomChipButtonComponent implements OnInit {
  @Input() chipsData: string[] = [];
  @Input() panelClass!: string;
  @Input() selectable = true;
  @Input() disabled = false;
  @Input() selectedChip = '';
  @Output() selectionChange = new EventEmitter<string>();


  constructor() { }

  ngOnInit(): void { }

  /**
   * Sets the selected chip
   * @param chip
   */
  selectChip(chip: string) {
    if (chip) {
      this.selectedChip = chip;
      this.selectionChange.emit(chip.trim());
    }
  }
}
