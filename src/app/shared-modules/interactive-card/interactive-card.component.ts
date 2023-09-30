import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { InteractiveCardData } from './models/interactive-card.model';

@Component({
  selector: 'app-interactive-card',
  templateUrl: './interactive-card.component.html',
  styleUrls: ['./interactive-card.component.scss'],
})
export class InteractiveCardComponent implements OnInit {
  @Input() data = new InteractiveCardData();
  @Input() selected = false;
  @Output() actionBtnClick = new EventEmitter<InteractiveCardData>();

  constructor() { }

  ngOnInit(): void { }

  /**
   * Selects the card
   */
  select() {
    if (!this.selected) {
      this.actionBtnClick.emit(this.data);
    }
  }

  /**
   * Gets the selected state of the card
   */
  get isSelected(): boolean {
    return this.selected && this.data.actionBtn.isSelectable;
  }
}
