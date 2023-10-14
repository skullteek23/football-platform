import { Component, OnInit } from '@angular/core';
import { PRIVACY_POLICY_CONTENT } from './constants/privacy-policy.constants';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {

  readonly content = PRIVACY_POLICY_CONTENT;

  constructor() { }

  ngOnInit(): void {
  }

}
