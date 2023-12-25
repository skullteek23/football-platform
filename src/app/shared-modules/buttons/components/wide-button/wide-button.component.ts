import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ButtonConfig, ButtonTheme } from '../../models/button.model';
import { AnimationsList } from '@app/utils/services/animation.service';

@Component({
  selector: 'app-wide-button',
  templateUrl: './wide-button.component.html',
  styleUrls: ['./wide-button.component.scss'],
  animations: [AnimationsList.fadeAppearSideways, AnimationsList.fadeAppearBottomTop],
})
export class WideButtonComponent implements OnInit {
  readonly ButtonTheme = ButtonTheme;

  @Input() displayDetails = new ButtonConfig();
  @Input() theme: ButtonTheme = ButtonTheme.primary;
  @Input() disabled = false;
  @Output() clickEv = new EventEmitter<void>();


  constructor() { }

  ngOnInit(): void { }

  /**
   * Emits event whenever button is clicked
   */
  onClickButton() {
    this.clickEv.next();
  }
}
