import { Component, Input, OnInit } from '@angular/core';
import { WideButtonComponent } from '../wide-button/wide-button.component';

@Component({
  selector: 'app-next-action-button',
  templateUrl: './next-action-button.component.html',
  styleUrls: ['./next-action-button.component.scss'],
})
export class NextActionButtonComponent
  extends WideButtonComponent
  implements OnInit {
  @Input() buttonID = '';
  @Input() disabled = false;
}
