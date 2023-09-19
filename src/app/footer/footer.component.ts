import { Component, OnInit } from '@angular/core';
import { FOOTER_SOCIAL_LIST } from './constants/footer.constants';
import { environmentCommon } from 'src/environments/environment.common';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  readonly list = FOOTER_SOCIAL_LIST;
  readonly support = environmentCommon.support;

  constructor() {}

  ngOnInit(): void {}
}
