import { Component, OnInit } from '@angular/core';
import { RULES } from './constants/rules';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  readonly content = RULES;

  constructor() { }

  ngOnInit(): void {
  }

}
