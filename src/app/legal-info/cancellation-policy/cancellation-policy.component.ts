import { Component, OnInit } from '@angular/core';
import { CANCELLATION_POLICY_CONTENT } from './constants/cancellation-policy.constants';

@Component({
  selector: 'app-cancellation-policy',
  templateUrl: './cancellation-policy.component.html',
  styleUrls: ['./cancellation-policy.component.scss']
})
export class CancellationPolicyComponent implements OnInit {

  readonly content = CANCELLATION_POLICY_CONTENT;

  constructor() { }

  ngOnInit(): void {
  }
}
