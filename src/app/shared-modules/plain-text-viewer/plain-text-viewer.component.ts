import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-plain-text-viewer',
  templateUrl: './plain-text-viewer.component.html',
  styleUrls: ['./plain-text-viewer.component.scss']
})
export class PlainTextViewerComponent implements OnInit {

  @Input() heading = '';
  @Input() HTMLText = '';

  constructor() { }

  ngOnInit(): void {
  }

}
