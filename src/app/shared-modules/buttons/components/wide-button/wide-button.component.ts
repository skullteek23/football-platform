import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonConfig } from '../../models/button.model';

@Component({
  selector: 'app-wide-button',
  templateUrl: './wide-button.component.html',
  styleUrls: ['./wide-button.component.scss'],
})
export class WideButtonComponent implements OnInit {
  @Input() displayDetails = new ButtonConfig();
  @Output() clickEv = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  /**
   * Emits event whenever button is clicked
   */
  onClickButton() {
    this.clickEv.next();
  }
}
