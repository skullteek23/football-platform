import { Component, Input, OnInit } from '@angular/core';
import { ResultBoxData, ResultType } from './models/result-box.model';

@Component({
  selector: 'app-result-box',
  templateUrl: './result-box.component.html',
  styleUrls: ['./result-box.component.scss']
})
export class ResultBoxComponent implements OnInit {

  readonly resultType = ResultType;
  @Input() type: ResultType = ResultType.success;
  @Input() data = new ResultBoxData();

  constructor() { }

  ngOnInit(): void {
  }

}
