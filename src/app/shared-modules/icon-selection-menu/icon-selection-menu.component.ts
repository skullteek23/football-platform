import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnimationsList } from '@app/services/animation.service';
import {
  IconSelectionData,
  IconSelectionDataItem,
} from './models/icon-selection.model';

@Component({
  selector: 'app-icon-selection-menu',
  templateUrl: './icon-selection-menu.component.html',
  styleUrls: ['./icon-selection-menu.component.scss'],
  animations: [
    AnimationsList.expandCollapseAnimationTrigger,
    AnimationsList.fadeInOutAnimation,
    AnimationsList.fadeOutInAnimation,
  ],
})
export class IconSelectionMenuComponent implements OnInit {
  isExpanded = false;

  @Input() data = new IconSelectionData();
  @Output() selectionChange = new EventEmitter<IconSelectionDataItem>();

  constructor() { }

  ngOnInit(): void { }

  selection(selectedValue: IconSelectionDataItem) {
    if (!selectedValue?.label) {
      console.log('invalid option selected!');
      return;
    }
    this.selectionChange.next(selectedValue);
  }

  toggleMenu() {
    this.isExpanded = !this.isExpanded;
  }
}
