import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DetailsContainerData } from './models/details-container.model';

@Component({
  selector: 'app-details-container',
  templateUrl: './details-container.component.html',
  styleUrls: ['./details-container.component.scss']
})
export class DetailsContainerComponent implements OnInit {

  @Input() data: DetailsContainerData = new DetailsContainerData();
  @Output() clickAction = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * This method is used to emit the action event
   */
  onAction() {
    this.clickAction.emit();
  }

}
