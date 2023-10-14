import { Component, OnInit } from '@angular/core';
import { TERMS_CONTENT } from './constants/terms.constants';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  readonly content = TERMS_CONTENT;

  constructor() { }

  ngOnInit(): void {
  }

}
